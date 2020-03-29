import State from './State';
import {InputEvent} from '../InputHandler';
import {Nullable} from '../../util/Types';
import Board, {
  BOARD_X,
  BOARD_Y,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../logic/Board';
import Container from '../ui/Container';
import Color from '../Color';
import Text from '../ui/Text';
import WidgetManager from '../ui/WidgetManager';

class SingleplayerState extends State {
  private static instance: Nullable<SingleplayerState> = null;
  private board: Board;
  private widgets: WidgetManager;
  private cntLines: Container;
  private txtLines: Text;
  private cntLevel: Container;
  private txtLevel: Text;

  constructor() {
    super();
    this.board = new Board();
    const boardXWidth = BOARD_X + BOARD_WIDTH * 32;
    
    this.txtLines = new Text(0, 0, 'Lines: 0').centerHorizontally().centerVertically();
    this.cntLines = new Container(
      boardXWidth + 10,
      BOARD_Y,
      200,
      60,
    ).addChildren('lineCount', this.txtLines);

    this.txtLevel = new Text(0, 0, 'Level: 0').centerHorizontally().centerVertically();
    this.cntLevel = new Container(
      boardXWidth + 10,
      BOARD_Y + 80,
      200,
      60,
    ).addChildren('lvlCount', this.txtLevel);

    this.widgets = new WidgetManager()
      .addWidget('cntLines', this.cntLines)
      .addWidget('cntLevel', this.cntLevel);
  }

  public static getInstance(): SingleplayerState {
    if (this.instance == null) {
      this.instance = new SingleplayerState();
    }

    return this.instance;
  }

  public update(delta: number): void {
    this.board.update(delta);
    this.widgets.update(delta);
    this.txtLines.text = `Lines: ${this.board.clearedLines.toString()}`;
    this.txtLevel.text = `Level: ${this.board.level.toString()}`;
  }

  public render(g: CanvasRenderingContext2D): void {
    this.board.render(g);
    this.widgets.render(g);
  }

  public input(e: InputEvent): void {
    this.board.input(e);
    this.widgets.input(e);
  }
}

export default SingleplayerState;
