import {Nullable} from '../../util/Types';
import InputHandler, {InputEvent, InputKey} from '../InputHandler';
import State from './State';
import io from 'socket.io-client';
import Client from '../network/Client';
import {
  PacketType,
  PlaceBlockPacket,
  EnterQueuePacket,
  EnterGamePacket,
  PlayerPlaceBlockPacket,
  EndGamePacket,
  GameOverPacket,
} from '../network/Packets';
import Container from '../ui/Container';
import {Screen} from '../Game';
import WidgetManager from '../ui/WidgetManager';
import Text from '../ui/Text';
import CounterComponent from '../ui/custom/CounterComponent';
import NextBlockComponent from '../ui/custom/NextBlockComponent';
import Block from '../logic/Block';
import Board, {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PlaceBlockCallbackData,
} from '../logic/Board';
import CustomWidget from '../ui/CustomWidget';
import OtherBoard from '../logic/OtherBoard';
import {mapBlockTypeToColor} from '../logic/Block';

enum InternalState {
  NONE,
  QUEUE_WAIT,
  IN_GAME,
  GAME_OVER,
}

class Multiplayer1v1State extends State {
  private static instance: Nullable<Multiplayer1v1State> = null;
  private internalState: InternalState;
  private client: Client;
  private board!: Board;
  private otherBoard!: OtherBoard;
  private widgets: WidgetManager;
  private txtStatus: Text;
  private cntMenu: Container;
  private cntBoard: Container;
  private cntMyField: Container;
  private txtMyName: Text;
  private myScore: CounterComponent;
  private myLines: CounterComponent;
  private myLevel: CounterComponent;
  private cntNextBlock: Container;
  private nextBlock: NextBlockComponent;
  private cntOtherBoard: Container;
  private cntOtherField: Container;
  private txtOtherName: Text;
  private otherID!: string;
  private otherScore: CounterComponent;
  private otherLines: CounterComponent;
  private otherLevel: CounterComponent;
  private cntGame: Container;

  constructor() {
    super();
    this.internalState = InternalState.NONE;

    // setup client socket
    this.client = new Client(io('localhost:4000'));
    this.initNetworkHandlers();

    // setup interface
    this.txtStatus = new Text(0, 0, `Press 'Space' to enter game queue.`)
      .centerHorizontally()
      .centerVertically();

    this.cntMenu = new Container(0, 0, Screen.width, Screen.height)
      .addChild('txtStatus', this.txtStatus)
      .setStyle({borderWidth: 0});

    this.txtMyName = new Text(0, 10, 'Me').centerHorizontally();

    this.myLines = new CounterComponent(
      BOARD_WIDTH * 32 + 20,
      40,
      140,
      50,
      'Lines',
    ).setTextStyle({fontSize: 16});

    this.myLevel = new CounterComponent(
      this.myLines.x,
      this.myLines.y + this.myLines.height + 10,
      140,
      50,
      'Level',
    ).setTextStyle({fontSize: 16});

    this.myScore = new CounterComponent(
      this.myLines.x,
      this.myLevel.y + this.myLevel.height + 10,
      140,
      50,
      'Score',
    ).setTextStyle({fontSize: 16});

    this.nextBlock = new NextBlockComponent(32);
    this.cntNextBlock = new Container(
      this.myScore.x,
      this.myScore.y + this.myScore.height + 10,
      140,
      140,
    ).addChild('nextBlock', this.nextBlock);

    this.cntBoard = new Container(10, 40, BOARD_WIDTH * 32, BOARD_HEIGHT * 32);

    this.cntBoard.addChild(
      'board',
      new CustomWidget()
        .onUpdate((_, delta: number): void => {
          this.board.update(delta);
        })
        .onInput((_, e: InputEvent): void => {
          this.board.input(e);
        })
        .onRender((_, g: CanvasRenderingContext2D): void => {
          this.board.render(g);
        }),
    );

    this.cntMyField = new Container(
      10,
      0,
      BOARD_WIDTH * 32 + this.myLines.width + 30,
      BOARD_HEIGHT * 32 + 50,
    )
      .addChild('txtMyName', this.txtMyName)
      .addChild('board', this.cntBoard)
      .addChild('myLines', this.myLines)
      .addChild('myLevel', this.myLevel)
      .addChild('myScore', this.myScore)
      .addChild('cntNextBlock', this.cntNextBlock);

    this.txtOtherName = new Text(0, 10, 'Other').centerHorizontally();

    this.otherLines = new CounterComponent(
      10,
      40,
      140,
      50,
      'Lines',
    ).setTextStyle({fontSize: 16});

    this.otherLevel = new CounterComponent(
      this.otherLines.x,
      this.otherLines.y + this.otherLines.height + 10,
      140,
      50,
      'Level',
    ).setTextStyle({fontSize: 16});

    this.otherScore = new CounterComponent(
      this.otherLines.x,
      this.otherLevel.y + this.otherLevel.height + 10,
      140,
      50,
      'Score',
    ).setTextStyle({fontSize: 16});

    this.cntOtherBoard = new Container(
      this.otherLines.x + this.otherLines.width + 10,
      40,
      BOARD_WIDTH * 32,
      BOARD_HEIGHT * 32,
    );

    this.cntOtherBoard.addChild(
      'board',
      new CustomWidget()
        .onInit((): void => {
          this.otherBoard = new OtherBoard(this.cntOtherBoard, 32);
        })
        .onRender((_, g: CanvasRenderingContext2D): void => {
          this.otherBoard.render(g);
        }),
    );

    this.cntOtherField = new Container(
      this.cntMyField.width + 40,
      0,
      BOARD_WIDTH * 32 + this.otherLines.width + 30,
      BOARD_HEIGHT * 32 + 50,
    )
      .addChild('txtOtherName', this.txtOtherName)
      .addChild('otherBoard', this.cntOtherBoard)
      .addChild('otherLines', this.otherLines)
      .addChild('otherLevel', this.otherLevel)
      .addChild('otherScore', this.otherScore);

    const gameWidth = this.cntMyField.width + this.cntOtherField.width + 40;
    const gameHeight = this.cntMyField.height;
    const gameX = Screen.width / 2 - gameWidth / 2;
    const gameY = Screen.height / 2 - gameHeight / 2;

    this.cntGame = new Container(gameX, gameY, gameWidth, gameHeight)
      .setStyle({borderWidth: 0})
      .addChild('cntMyField', this.cntMyField)
      .addChild('cntOtherField', this.cntOtherField);

    this.cntGame.setVisible(false);

    this.widgets = new WidgetManager()
      .addWidget('cntMenu', this.cntMenu)
      .addWidget('cntGame', this.cntGame);
  }

  public static getInstance(): Multiplayer1v1State {
    if (this.instance == null) {
      this.instance = new Multiplayer1v1State();
    }

    return this.instance;
  }

  public update(delta: number): void {
    this.widgets.update(delta);

    // update my board
    if (this.board != null) {
      this.myLines.setCounter(this.board.clearedLines);
      this.myLevel.setCounter(this.board.level);
      this.myScore.setCounter(this.board.score);
      this.nextBlock.setBlock(this.board.nextBlock);
    }
  }

  public render(g: CanvasRenderingContext2D): void {
    this.widgets.render(g);
  }

  public input(e: InputEvent): void {
    if (this.internalState === InternalState.NONE) {
      if (InputHandler.isKeyUp(InputKey.SPACE, e)) {
        this.internalState = InternalState.QUEUE_WAIT;
        this.txtStatus.text = 'Waiting in queue...';
        this.sendEnterQueue();
      }
    }

    this.widgets.input(e);
  }

  private initBoard(initialLevel: number): void {
    this.board = new Board(this.cntBoard, 32, initialLevel);
    this.board.level = initialLevel;
    this.board.isSingleplayer = false;
    this.board.onPlaceBlock = this.sendPlaceBlock.bind(this);
  }

  private sendEnterQueue(): void {
    this.client.sendData(new EnterQueuePacket());
  }

  private sendPlaceBlock(block: PlaceBlockCallbackData): void {
    this.client.sendData(new PlaceBlockPacket({...block}));
  }

  private initNetworkHandlers(): void {
    this.client.on(
      PacketType.S_1v1_ENTER_GAME,
      this.handleEnterGame.bind(this),
    );

    this.client.on(
      PacketType.S_1v1_PLAYER_PLACE_BLOCK,
      this.handlePlayerPlaceBlock.bind(this),
    );

    this.client.on(PacketType.S_1v1_GAME_OVER, this.handleGameOver.bind(this));

    this.client.on(PacketType.S_1v1_END_GAME, this.handleEndGame.bind(this));
  }

  private handleEnterGame(packet: EnterGamePacket): void {
    const {otherID, initialLevel} = packet.data;
    this.otherID = otherID;
    this.internalState = InternalState.IN_GAME;
    this.initBoard(initialLevel);
    this.otherLevel.setCounter(initialLevel);
    this.cntMenu.setVisible(false);
    this.cntGame.setVisible(true);
  }

  private handlePlayerPlaceBlock(packet: PlayerPlaceBlockPacket): void {
    const {block, clearedLines, lines, level, score} = packet.data;
    console.log(packet.data);

    // update board
    for (let i = 0; i < block.data.length; i++) {
      for (let j = 0; j < block.data[0].length; j++) {
        if (block.data[i][j] === 1) {
          this.otherBoard.mat[block.x + j][block.y + i] = {
            color: mapBlockTypeToColor(block.type),
            value: 1,
          };
        }
      }
    }

    // clear lines
    if (clearedLines.length > 0) {
      this.otherBoard.shiftBlocks(clearedLines);
    }

    // update counters
    this.otherLines.setCounter(lines);
    this.otherLevel.setCounter(level);
    this.otherScore.setCounter(score);
  }

  private handleGameOver(packet: GameOverPacket): void {
    if (this.otherID === packet.data.whoID) {
      this.otherBoard.gameOver = true;
    }
  }

  private handleEndGame(packet: EndGamePacket): void {
    this.board.onlineGameEnded = true;
    this.otherBoard.onlineGameEnded = true;
    if (this.otherID !== packet.data.winnerID) {
      this.board.isOnlineGameWinner = true;
      this.otherBoard.isWinner = false;
    } else {
      this.board.isOnlineGameWinner = false;
      this.otherBoard.isWinner = true;
    }
  }
}

export default Multiplayer1v1State;
