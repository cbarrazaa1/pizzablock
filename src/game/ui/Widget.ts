import {Nullable} from '../../util/Types';
import {InputEvent} from '../InputHandler';

export interface StyleProps {}

abstract class Widget {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public visible: boolean;
  public parent: Nullable<Widget>;
  protected style: StyleProps;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visible = true;
    this.parent = null;
    this.style = {};
  }

  public setStyle(style: StyleProps): Widget {
    this.style = {...this.style, ...style};
    return this;
  }

  public setVisible(visible: boolean): Widget {
    this.visible = visible;
    return this;
  }

  public getRealX(): number {
    let curr = this.parent;
    let res = this.x;

    while (curr != null) {
      res += curr.x;
      curr = curr.parent;
    }

    return res;
  }

  public getRealY(): number {
    let curr = this.parent;
    let res = this.y;

    while (curr != null) {
      res += curr.y;
      curr = curr.parent;
    }

    return res;
  }

  public abstract update(delta: number): void;
  public abstract input(e: InputEvent): void;
  public abstract render(g: CanvasRenderingContext2D): void;
}

export default Widget;
