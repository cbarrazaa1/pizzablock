import State from "./State";
import {Nullable} from '../../util/Types';
import Board from "../logic/Board";

class SingleplayerState extends State {
  private static instance: Nullable<SingleplayerState> = null;
  private board: Board;

  constructor() {
    super();
    this.board = new Board();
  }

  public static getInstance(): SingleplayerState {
    if (this.instance == null) {
      this.instance = new SingleplayerState();
    }

    return this.instance;
  }

  public update(delta: number): void {
    this.board.update(delta);
  }

  public render(g: CanvasRenderingContext2D): void {
    this.board.render(g);
  }
}

export default SingleplayerState;