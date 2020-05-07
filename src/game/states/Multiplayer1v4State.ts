import State from './State';
import {Nullable, StrMap} from '../../util/Types';
import Client from '../network/Client';
import WidgetManager from '../ui/WidgetManager';
import Text from '../ui/Text';
import Container from '../ui/Container';
import CounterComponent from '../ui/custom/CounterComponent';
import NextBlockComponent from '../ui/custom/NextBlockComponent';
import OtherBoard from '../logic/OtherBoard';
import Board, {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PlaceBlockCallbackData,
} from '../logic/Board';
import Game, {Screen} from '../Game';
import CustomWidget from '../ui/CustomWidget';
import InputHandler, {InputEvent, InputKey} from '../InputHandler';
import {EnterQueue1v4Packet, PlaceBlockPacket, PacketType, EnterGame1v4Packet, PlayerPlaceBlockPacket, GameOverPacket, EndGamePacket} from '../network/Packets';
import io from 'socket.io-client';
import { mapBlockTypeToColor } from '../logic/Block';

enum InternalState {
  NONE,
  QUEUE_WAIT,
  IN_GAME,
  GAME_OVER,
}

type OtherPlayerInfo = {
  id: string;
  name: string;
  board: OtherBoard;
}

class Multiplayer1v4State extends State {
  private static instance: Nullable<Multiplayer1v4State> = null;
  private internalState: InternalState;
  private client: Client;
  private board!: Board;
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
  private otherBoards: OtherBoard[] = new Array(4);
  private cntOtherBoards: Container[] = new Array(4);
  private cntGame: Container;
  private otherPlayersMap: StrMap<OtherPlayerInfo>;

  constructor() {
    super();
    this.internalState = InternalState.NONE;
    this.otherPlayersMap = {};

    // setup client socket
    this.client = new Client(io('http://localhost:4000'));
    this.initNetworkHandlers();

    // setup interface
    this.txtStatus = new Text(0, 0, `Press 'Space' to enter game queue.`)
      .centerHorizontally()
      .centerVertically();

    this.cntMenu = new Container(0, 0, Screen.width, Screen.height)
      .addChild('txtStatus', this.txtStatus)
      .setStyle({borderWidth: 0});

    this.txtMyName = new Text(0, 10, Game.user.name).centerHorizontally();

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
      0,
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

    this.cntGame = new Container(0, 0, Screen.width, Screen.height)
      .setStyle({borderWidth: 0})
      .addChild('cntMyField', this.cntMyField);

    const baseX = this.cntMyField.x + this.cntMyField.width + 20;
    const baseY = this.cntMyField.y + 16;
    const otherBoardWidth = BOARD_WIDTH * 16;
    const otherBoardHeight = BOARD_HEIGHT * 16;
    let auxX = 0;
    let auxY = 0;
    for (let i = 0; i < 4; i++) {
      if (i == 2) {
        auxX = 0;
        auxY = otherBoardHeight + 20;
      }

      this.cntOtherBoards[i] = new Container(
        baseX + auxX,
        baseY + auxY,
        otherBoardWidth,
        otherBoardHeight,
      )
      
      this.cntOtherBoards[i].addChild(
        'board',
        new CustomWidget()
          .onInit(() => {
            this.otherBoards[i] = new OtherBoard(this.cntOtherBoards[i], 16);
          })
          .onRender((_, g: CanvasRenderingContext2D): void => {
            this.otherBoards[i].render(g);
          }),
      );

      auxX = otherBoardWidth + 20;
      this.cntGame.addChild(`cntOtherBoard_${i}`, this.cntOtherBoards[i]);
    }

    this.cntGame.setVisible(false);

    // adapt game dimensions
    const gameWidth =
      this.cntMyField.width + this.cntOtherBoards[0].width * 2 + 40;
    const gameHeight = this.cntMyField.height;
    const gameX = Screen.width / 2 - gameWidth / 2;
    const gameY = Screen.height / 2 - gameHeight / 2;

    this.cntGame.x = gameX;
    this.cntGame.y = gameY;
    this.cntGame.width = gameWidth;
    this.cntGame.height = gameHeight;

    this.widgets = new WidgetManager()
      .addWidget('cntMenu', this.cntMenu)
      .addWidget('cntGame', this.cntGame);
  }

  public static getInstance(): Multiplayer1v4State {
    if (this.instance == null) {
      this.instance = new Multiplayer1v4State();
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

  private async sendEnterQueue(): Promise<void> {
    const res = await fetch('https://geoip-db.com/json/', {
      method: 'GET',
    });

    const json = await res.json();
    console.log(json);

    this.client.sendData(
      new EnterQueue1v4Packet({
        userID: Game.user.id,
        name: Game.user.name,
        ip: json.IPv4,
      }),
    );
  }

  private sendPlaceBlock(block: PlaceBlockCallbackData): void {
    this.client.sendData(new PlaceBlockPacket({...block}));
  }

  private initNetworkHandlers(): void {
    this.client.on(
      PacketType.S_1v4_ENTER_GAME,
      this.handleEnterGame.bind(this),
    );

    this.client.on(
      PacketType.S_PLAYER_PLACE_BLOCK,
      this.handlePlayerPlaceBlock.bind(this),
    );

    this.client.on(PacketType.S_GAME_OVER, this.handleGameOver.bind(this));
    this.client.on(PacketType.S_END_GAME, this.handleEndGame.bind(this));
  }

  private handleEnterGame(packet: EnterGame1v4Packet): void {
    const data = packet.data;
    data.others.forEach(other => {
      const playerInfo: OtherPlayerInfo = {
        id: other.id,
        name: other.name,
        board: this.otherBoards[Object.keys(this.otherPlayersMap).length],
      };
      console.log(other.id, playerInfo);
      this.otherPlayersMap[other.id] = playerInfo;
    });

    this.internalState = InternalState.IN_GAME;
    this.initBoard(data.initialLevel);
    this.cntMenu.setVisible(false);
    this.cntGame.setVisible(true);
  }

  private handlePlayerPlaceBlock(packet: PlayerPlaceBlockPacket): void {
    const {block, clearedLines, lines, level, score, whoID} = packet.data;
    
    // update board
    for (let i = 0; i < block.data.length; i++) {
      for (let j = 0; j < block.data[0].length; j++) {
        if (block.data[i][j] === 1) {
          this.otherPlayersMap[whoID].board.mat[block.x + j][block.y + i] = {
            color: mapBlockTypeToColor(block.type),
            value: 1,
          }
        }
      }
    }

    // clear lines
    if (clearedLines.length > 0) {
      this.otherPlayersMap[whoID].board.shiftBlocks(clearedLines);
    }
  }

  private handleGameOver(packet: GameOverPacket): void {
    Object.values(this.otherPlayersMap).forEach(other => {
      if (other.id === packet.data.whoID) {
        other.board.gameOver = true;
      }
    })
  }

  private handleEndGame(packet: EndGamePacket): void {
    Game.history.push(`/results/${packet.data.gameID}`);
  }
}

export default Multiplayer1v4State;
