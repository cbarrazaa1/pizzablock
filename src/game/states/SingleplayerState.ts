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
import Button from '../ui/Button';

enum InternalState {
  NONE,
  MENU,
  IN_GAME,
}

class SingleplayerState extends State {
  private static instance: Nullable<SingleplayerState> = null;
  private board!: Board;
  private selectedLevel!: number;
  private widgets: WidgetManager;
  private txtSelectedTitle: Text;
  private txtSelectedLevel: Text;
  private btnMinusOne: Button;
  private btnMinusFive: Button;
  private btnPlusOne: Button;
  private btnPlusFive: Button;
  private btnStart: Button;
  private cntMenu: Container;
  private myLines: CounterComponent;
  private myLevel: CounterComponent;
  private myScore: CounterComponent;
  private cntNextBlock: Container;
  private nextBlock: NextBlockComponent;
  private cntBoard: Container;
  private cntGame: Container;

  constructor() {
    super();
    const boardX = 10,
      boardY = 10;
    const boardXWidth = boardX + BOARD_WIDTH * 32;
    this.selectedLevel = 9;

    // menu interface
    this.txtSelectedTitle = new Text(0, 50, 'Selected Level')
      .centerHorizontally()
      .setStyle({fontSize: 46});

    this.txtSelectedLevel = new Text(0, 125, '9')
      .centerHorizontally()
      .setStyle({fontSize: 40});
    
    const buttonXBase = Screen.width / 2 - 32;
    this.btnMinusOne = new Button(
      buttonXBase - 70,
      this.txtSelectedLevel.y - 15,
      64,
      64,
      '- 1',
      new Color(20, 20, 20, 255),
    );
    this.btnMinusOne.onPress(() => {
      this.updateSelectedLevel(-1);
    }).setStyle({borderColor: new Color(100, 100, 100, 255), borderWidth: 2.3});

    this.btnMinusFive = new Button(
      this.btnMinusOne.x - 72,
      this.btnMinusOne.y,
      64,
      64,
      '- 5',
      new Color(20, 20, 20, 255),
    );
    this.btnMinusFive.onPress(() => {
      this.updateSelectedLevel(-5);
    }).setStyle({borderColor: new Color(100, 100, 100, 255), borderWidth: 2.3});

    this.btnPlusOne = new Button(
      buttonXBase + 70,
      this.txtSelectedLevel.y - 15,
      64,
      64,
      '+ 1',
      new Color(20, 20, 20, 255),
    );
    this.btnPlusOne.onPress(() => {
      this.updateSelectedLevel(1);
    }).setStyle({borderColor: new Color(100, 100, 100, 255), borderWidth: 2.3});

    this.btnPlusFive = new Button(
      this.btnPlusOne.x + 72,
      this.btnPlusOne.y,
      64,
      64,
      '+ 5',
      new Color(20, 20, 20, 255)
    )
    this.btnPlusFive.onPress(() => {
      this.updateSelectedLevel(5);
    }).setStyle({borderColor: new Color(100, 100, 100, 255), borderWidth: 2.3});

    const buttonX = Screen.width / 2 - 100;
    const buttonY = Screen.height / 2 - 30;
    this.btnStart = new Button(
      buttonX,
      buttonY,
      200,
      60,
      'Start Game',
      new Color(20, 20, 20, 255)
    )
    this.btnStart.onPress(() => {
      this.board = new Board(this.cntBoard, 32, this.selectedLevel);
      this.board.onGameEnded = (): void => {
        this.cntMenu.setVisible(true);
        this.cntGame.setVisible(false);
      }
      this.cntMenu.setVisible(false);
      this.cntGame.setVisible(true);
    }).setStyle({borderColor: new Color(100, 100, 100, 255), borderWidth: 2.3});

    this.cntMenu = new Container(0, 0, Screen.width, Screen.height)
      .addChild('txtSelectedTitle', this.txtSelectedTitle)
      .addChild('txtSelectedLevel', this.txtSelectedLevel)
      .addChild('btnMinusOne', this.btnMinusOne)
      .addChild('btnMinusFive', this.btnMinusFive)
      .addChild('btnPlusOne', this.btnPlusOne)
      .addChild('btnPlusFive', this.btnPlusFive)
      .addChild('btnStart', this.btnStart)
      .setStyle({borderWidth: 0});

    // game interface
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

    this.cntGame = new Container(mainX, mainY, mainWidth, mainHeight)
      .setStyle({borderWidth: 0})
      .addChild('myLines', this.myLines)
      .addChild('myLevel', this.myLevel)
      .addChild('myScore', this.myScore)
      .addChild('cntNextBlock', this.cntNextBlock)
      .addChild('cntBoard', this.cntBoard);

    this.cntGame.setVisible(false);
    this.widgets = new WidgetManager().addWidget('cntGame', this.cntGame).addWidget('cntMenu', this.cntMenu)
  }

  public static getInstance(): SingleplayerState {
    if (this.instance == null) {
      this.instance = new SingleplayerState();
    }

    return this.instance;
  }

  public update(delta: number): void {
    this.widgets.update(delta);
    if (this.board != null) {
      this.myLines.setCounter(this.board.clearedLines);
      this.myLevel.setCounter(this.board.level);
      this.myScore.setCounter(this.board.score);
      this.nextBlock.setBlock(this.board.nextBlock);
    }
    this.txtSelectedLevel.text = `${this.selectedLevel}`;
  }

  public render(g: CanvasRenderingContext2D): void {
    this.widgets.render(g);
  }

  public input(e: InputEvent): void {
    this.widgets.input(e);
  }

  private updateSelectedLevel(amount: number): void {
    this.selectedLevel += amount;
    if (this.selectedLevel < 0) {
      this.selectedLevel = 0;
    } else if (this.selectedLevel > 29) {
      this.selectedLevel = 29;
    }
  }
}

export default SingleplayerState;
