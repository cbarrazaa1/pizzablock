import State from './State';
import {InputEvent} from '../InputHandler';
import {Nullable} from '../../util/Types';
import Board, {
  BOARD_X,
  BOARD_Y,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../logic/Board';
import Container, {ContainerStyleProps} from '../ui/Container';
import Color from '../Color';
import Text from '../ui/Text';
import WidgetManager from '../ui/WidgetManager';
import CustomWidget from '../ui/CustomWidget';
import Block from '../logic/Block';

class SingleplayerState extends State {
  private static instance: Nullable<SingleplayerState> = null;
  private board: Board;
  private widgets: WidgetManager;
  private cntLines: Container;
  private txtLines: Text;
  private cntLevel: Container;
  private txtLevel: Text;
  private cntScore: Container;
  private txtScore: Text;
  private cntNextBlock: Container;
  private nextBlock: CustomWidget;
  private cntBoard: Container;

  constructor() {
    super();
    this.board = new Board();
    const boardXWidth = BOARD_X + BOARD_WIDTH * 32;
    const cntStyle: ContainerStyleProps = {
      borderWidth: 4,
      borderColor: new Color(80, 80, 80, 255),
    };

    this.txtLines = new Text(0, 0, 'Lines: 0')
      .centerHorizontally()
      .centerVertically();
    this.cntLines = new Container(boardXWidth + 20, BOARD_Y + 1, 200, 60)
      .addChild('lineCount', this.txtLines)
      .setStyle(cntStyle);

    this.txtLevel = new Text(0, 0, 'Level: 0')
      .centerHorizontally()
      .centerVertically();
    this.cntLevel = new Container(boardXWidth + 20, BOARD_Y + 81, 200, 60)
      .addChild('lvlCount', this.txtLevel)
      .setStyle(cntStyle);

    this.txtScore = new Text(0, 0, 'Score: 0')
      .centerHorizontally()
      .centerVertically();
    this.cntScore = new Container(boardXWidth + 20, BOARD_Y + 161, 200, 60)
      .addChild('scoreCount', this.txtScore)
      .setStyle(cntStyle);

    this.nextBlock = new CustomWidget()
      .onUpdate((self: CustomWidget): void => {
        self.data['block'] = this.board.nextBlock;
      })
      .onRender((self: CustomWidget, g: CanvasRenderingContext2D): void => {
        const {shape, rotation, color} = self.data['block'] as Block;
        const shapeHeight = shape.rotations[rotation].length;
        const shapeWidth = shape.rotations[rotation][0].length;
        const actualWidth = shapeWidth * 32;
        const actualHeight = shapeHeight * 32;
        const parentWidth = self.parent!.width;
        const parentHeight = self.parent!.height;

        for (let i = 0; i < shapeWidth; i++) {
          for (let j = 0; j < shapeHeight; j++) {
            if (shape.rotations[rotation][j][i] === 1) {
              g.fillStyle = color.toString();
              g.fillRect(
                self.getRealX() + parentWidth / 2 - actualWidth / 2 + i * 32,
                self.getRealY() + parentHeight / 2 - actualHeight / 2 + j * 32,
                32,
                32,
              );
            }
          }
        }
      });

    this.cntNextBlock = new Container(boardXWidth + 20, BOARD_Y + 241, 150, 150)
      .addChild('nextBlock', this.nextBlock)
      .setStyle(cntStyle);

    this.cntBoard = new Container(
      BOARD_X,
      BOARD_Y,
      BOARD_WIDTH * 32,
      BOARD_HEIGHT * 32,
    ).addChild(
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

    this.widgets = new WidgetManager()
      .addWidget('cntLines', this.cntLines)
      .addWidget('cntLevel', this.cntLevel)
      .addWidget('cntScore', this.cntScore)
      .addWidget('cntNextBlock', this.cntNextBlock)
      .addWidget('cntBoard', this.cntBoard);
  }

  public static getInstance(): SingleplayerState {
    if (this.instance == null) {
      this.instance = new SingleplayerState();
    }

    return this.instance;
  }

  public update(delta: number): void {
    this.widgets.update(delta);
    this.txtLines.text = `Lines: ${this.board.clearedLines.toString()}`;
    this.txtLevel.text = `Level: ${this.board.level.toString()}`;
    this.txtScore.text = `Score: ${this.board.score.toString()}`;
  }

  public render(g: CanvasRenderingContext2D): void {
    this.widgets.render(g);
  }

  public input(e: InputEvent): void {
    this.widgets.input(e);
  }
}

export default SingleplayerState;
