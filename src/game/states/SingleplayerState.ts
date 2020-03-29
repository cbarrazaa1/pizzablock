import State from './State';
import {InputEvent} from '../InputHandler';
import {Nullable} from '../../util/Types';
import Board, {BOARD_X, BOARD_Y, BOARD_WIDTH, BOARD_HEIGHT} from '../logic/Board';
import Container from '../ui/Container';
import Color from '../Color';
import Text from '../ui/Text';
import WidgetManager from '../ui/WidgetManager';

class SingleplayerState extends State {
  private static instance: Nullable<SingleplayerState> = null;
  private board: Board;
  private widgets: WidgetManager;

  constructor() {
    super();
    this.board = new Board();
    this.widgets = new WidgetManager();
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
