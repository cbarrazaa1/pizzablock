import State from "./State";
import { Nullable } from "../../util/Types";
import Client from "../network/Client";
import WidgetManager from "../ui/WidgetManager";
import Text from "../ui/Text";
import Container from "../ui/Container";
import CounterComponent from "../ui/custom/CounterComponent";
import NextBlockComponent from "../ui/custom/NextBlockComponent";
import OtherBoard from "../logic/OtherBoard";
import Board, { BOARD_WIDTH, BOARD_HEIGHT, PlaceBlockCallbackData } from "../logic/Board";
import Game, { Screen } from "../Game";
import CustomWidget from "../ui/CustomWidget";
import InputHandler, { InputEvent, InputKey } from "../InputHandler";
import { EnterQueue1v1Packet, PlaceBlockPacket } from "../network/Packets";

enum InternalState {
  NONE,
  QUEUE_WAIT,
  IN_GAME,
  GAME_OVER,
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

  constructor() {
    super();
    this.internalState = InternalState.NONE;

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
        })
    );

    this.cntMyField = new Container(
      10, 0,
      BOARD_WIDTH * 32 + this.myLines.width + 30,
      BOARD_HEIGHT * 32 + 50,
    )
      .addChild('txtMyName', this.txtMyName)
      .addChild('board', this.cntBoard)
      .addChild('myLines', this.myLines)
      .addChild('myLevel', this.myLevel)
      .addChild('myScore', this.myScore)
      .addChild('cntNextBlock', this.cntNextBlock);

    // for (let i = 0; i < 5; i++) {
    //   this.cntOtherBoards[i] = new Container()
    // }

    this.cntGame = new Container(0, 0, Screen.width, Screen.height)
      .setStyle({borderWidth: 0})
      .addChild('cntMyField', this.cntMyField);

    this.cntGame.setVisible(false);

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

  private sendEnterQueue(): void {
    this.client.sendData(new EnterQueue1v1Packet({
      userID: Game.user.id,
      name: Game.user.name,
    }));
  }

  private sendPlaceBlock(block: PlaceBlockCallbackData): void {
    this.client.sendData(new PlaceBlockPacket({...block}));
  }

  private initNetworkHandlers(): void {
    
  }
}

export default Multiplayer1v4State;