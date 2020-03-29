import {InputEvent} from '../InputHandler';

abstract class State {
  public abstract update(delta: number): void;
  public abstract render(g: CanvasRenderingContext2D): void;
  public abstract input(e: InputEvent): void;
}

export default State;
