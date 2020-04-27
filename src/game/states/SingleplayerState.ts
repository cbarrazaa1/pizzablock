import State from './State';
import {InputEvent} from '../InputHandler';
import {Nullable} from '../../util/Types';
import Board, {BOARD_WIDTH, BOARD_HEIGHT} from '../logic/Board';
import Container, {ContainerStyleProps} from '../ui/Container';
import Color from '../Color';
import Text from '../ui/Text';
import WidgetManager from '../ui/WidgetManager';
import CustomWidget from '../ui/CustomWidget';
import Block from '../logic/Block';
import {Screen} from '../Game';
import CounterComponent from '../ui/custom/CounterComponent';
import NextBlockComponent from '../ui/custom/NextBlockComponent';

class SingleplayerState extends State {
  private static instance: Nullable<SingleplayerState> = null;
  private board!: Board;
  private widgets: WidgetManager;
  private myLines: CounterComponent;
  private myLevel: CounterComponent;
  private myScore: CounterComponent;
  private cntNextBlock: Container;
  private nextBlock: NextBlockComponent;
  private cntBoard: Container;
  private cntMain: Container;

  constructor() {
    super();
    const boardX = 10,
      boardY = 10;
    const boardXWidth = boardX + BOARD_WIDTH * 32;

    this.myLines = new CounterComponent(
      boardXWidth + 20,
      boardY + 1,
      200,
      60,
      'Lines',
    );

    this.myLevel = new CounterComponent(
      boardXWidth + 20,
      boardY + 81,
      200,
      60,
      'Level',
    );

    this.myScore = new CounterComponent(
      boardXWidth + 20,
      boardY + 161,
      200,
      60,
      'Score',
    );

    this.nextBlock = new NextBlockComponent(32);
    this.cntNextBlock = new Container(
      this.myScore.x,
      this.myScore.y + this.myScore.height + 10,
      150,
      130,
    ).addChild('nextBlock', this.nextBlock);

    this.cntBoard = new Container(
      boardX,
      boardY,
      BOARD_WIDTH * 32,
      BOARD_HEIGHT * 32,
    );

    this.cntBoard.addChild(
      'board',
      new CustomWidget()
        .onInit((_): void => {
          this.board = new Board(this.cntBoard, 32);
        })
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

    const mainWidth = this.cntBoard.width + this.myLines.width + 40;
    const mainHeight = this.cntBoard.height;
    const mainX = Screen.width / 2 - mainWidth / 2;
    const mainY = Screen.height / 2 - mainHeight / 2 - 10;

    this.cntMain = new Container(mainX, mainY, mainWidth, mainHeight)
      .setStyle({borderWidth: 0})
      .addChild('myLines', this.myLines)
      .addChild('myLevel', this.myLevel)
      .addChild('myScore', this.myScore)
      .addChild('cntNextBlock', this.cntNextBlock)
      .addChild('cntBoard', this.cntBoard);

    this.widgets = new WidgetManager().addWidget('cntMain', this.cntMain);
  }

  public static getInstance(): SingleplayerState {
    if (this.instance == null) {
      this.instance = new SingleplayerState();
    }

    return this.instance;
  }

  public update(delta: number): void {
    this.widgets.update(delta);
    this.myLines.setCounter(this.board.clearedLines);
    this.myLevel.setCounter(this.board.level);
    this.myScore.setCounter(this.board.score);
    this.nextBlock.setBlock(this.board.nextBlock);
  }

  public render(g: CanvasRenderingContext2D): void {
    this.widgets.render(g);
  }

  public input(e: InputEvent): void {
    this.widgets.input(e);
  }
}

export default SingleplayerState;
