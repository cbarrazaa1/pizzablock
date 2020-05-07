import {InputEvent} from '../InputHandler';

export enum GameState {
  SINGLEPLAYER,
  MULTIPLAYER_1v1,
  MULTIPLAYER_1v4,
}

abstract class State {
  public abstract update(delta: number): void;
  public abstract render(g: CanvasRenderingContext2D): void;
  public abstract input(e: InputEvent): void;
}

export default State;
