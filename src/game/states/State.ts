class State {
  constructor() {
    if (new.target === State) {
      console.error('State is an abstract class.');
    }
  }

  public update(delta: number): void {}
  public render(g: CanvasRenderingContext2D): void {}
}

export default State;