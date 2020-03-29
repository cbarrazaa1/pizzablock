import {Nullable} from '../../util/Types';
import {InputEvent} from '../InputHandler';

export interface StyleProps {}

abstract class Widget {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public parent: Nullable<Widget>;
  protected style: StyleProps;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = null;
    this.style = {};
  }

  public setStyle(style: StyleProps): Widget {
    this.style = {...this.style, ...style};
    return this;
  }

  public getRealX(): number {
    if (this.parent == null) {
      return this.x;
    }

    return this.x + this.parent.x;
  }

  public getRealY(): number {
    if (this.parent == null) {
      return this.y;
    }

    return this.y + this.parent.y;
  }

  public abstract update(delta: number): void;
  public abstract input(e: InputEvent): void;
  public abstract render(g: CanvasRenderingContext2D): void;
}

export default Widget;
