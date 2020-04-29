import State from './states/State';
import {InputEvent} from './InputHandler';
import SingleplayerState from './states/SingleplayerState';
import Multiplayer1v1State from './states/Multiplayer1v1State';

export const Screen = {
  width: 1080,
  height: 800,
};

class Game {
  private g: CanvasRenderingContext2D;
  private currentState: State;

  constructor(g: CanvasRenderingContext2D) {
    this.g = g;
    this.currentState = SingleplayerState.getInstance();
  }

  public update(delta: number): void {
    this.currentState.update(delta);
  }

  public input(e: InputEvent): void {
    this.currentState.input(e);
  }

  public render(): void {
    const {g} = this;
    const {width, height} = Screen;

    // clear screen
    g.clearRect(0, 0, width, height);
    g.fillStyle = 'black';
    g.fillRect(0, 0, width, height);

    // render state
    this.currentState.render(g);
  }
}

export default Game;
