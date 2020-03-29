import Widget, { StyleProps } from "./Widget";
import Color from "../Color";
import { StrMap } from "../../util/Types";
import {InputEvent} from '../InputHandler';

export interface ContainerStyleProps extends StyleProps {
  backgroundColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
  borderRadius?: number;
}

function getDefaultStyle(): ContainerStyleProps {
  return {
    backgroundColor: Color.BLACK.copy(),
    borderColor: Color.WHITE.copy(),
    borderWidth: 1,
    borderRadius: 0,
  }
}

class Container extends Widget {
  private children: StrMap<Widget> = {};

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.style = getDefaultStyle();
  }

  public addChildren(name: string, child: Widget): Container {
    child.parent = this;
    this.children[name] = child;
    return this;
  }

  public removeChildren(name: string): Container {
    delete this.children[name];
    return this;
  }

  public setStyle(style: ContainerStyleProps): Container {
    super.setStyle(style);
    return this;
  }

  public update(delta: number): void {
    Object.values(this.children).forEach(child => child.update(delta));
  }
  
  public input(e: InputEvent): void {
    Object.values(this.children).forEach(child => child.input(e));
  }

  public render(g: CanvasRenderingContext2D): void {
    const style = this.style as ContainerStyleProps;
    g.fillStyle = (style.backgroundColor ?? Color.BLACK.copy()).toString();
    g.lineJoin = 'round';
    g.lineWidth = style.borderWidth ?? 1;
    g.strokeStyle = (style.borderColor ?? Color.WHITE.copy()).toString();

    const x = this.getRealX();
    const y = this.getRealY();
    g.strokeRect(x, y, this.width, this.height);
    g.fillRect(x, y, this.width, this.height);

    Object.values(this.children).forEach(child => child.render(g));
  }
}

export default Container;