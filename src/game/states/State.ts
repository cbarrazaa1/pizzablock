import {InputEvent} from '../InputHandler';

abstract class State {
  public update(delta: number): void {}
  public render(g: CanvasRenderingContext2D): void {}
  public input(e: InputEvent): void {}
}

export default State;
