export type InputEvent =  React.KeyboardEvent | React.MouseEvent;

abstract class State {
  public update(delta: number): void {}
  public render(g: CanvasRenderingContext2D): void {}
  public input(e: InputEvent): void {}
}

export default State;