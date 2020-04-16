import Widget, {StyleProps} from './Widget';
import Color from '../Color';
import {StrMap, Nullable} from '../../util/Types';
import {InputEvent} from '../InputHandler';

export interface ContainerStyleProps extends StyleProps {
  backgroundColor?: Color;
  borderColor?: Color;
  borderWidth?: number;
}

function getDefaultStyle(): ContainerStyleProps {
  return {
    backgroundColor: Color.BLACK.copy(),
    borderColor: Color.WHITE.copy(),
    borderWidth: 1,
  };
}

class Container extends Widget {
  private children: StrMap<Widget> = {};

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.style = getDefaultStyle();
  }

  public addChild(name: string, child: Widget): Container {
    child.parent = this;
    this.children[name] = child;
    return this;
  }

  public removeChild(name: string): Container {
    delete this.children[name];
    return this;
  }

  public getChildren(name: string): Nullable<Widget> {
    return this.children[name];
  }

  public setStyle(style: ContainerStyleProps): Container {
    super.setStyle(style);
    return this;
  }

  public update(delta: number): void {
    if (!this.visible) {
      return;
    }

    Object.values(this.children).forEach(child => child.update(delta));
  }

  public input(e: InputEvent): void {
    if (!this.visible) {
      return;
    }

    Object.values(this.children).forEach(child => child.input(e));
  }

  public render(g: CanvasRenderingContext2D): void {
    if (!this.visible) {
      return;
    }
    
    const style = this.style as ContainerStyleProps;
    g.fillStyle = style.backgroundColor!.toString();
    g.lineJoin = 'round';
    g.lineWidth = style.borderWidth!;
    g.strokeStyle = style.borderColor!.toString();

    if (style.borderWidth! === 0) {
      g.strokeStyle = 'rgba(0, 0, 0, 0)';
    }

    const x = this.getRealX();
    const y = this.getRealY();
    g.strokeRect(x, y, this.width, this.height);
    g.fillRect(x, y, this.width, this.height);

    Object.values(this.children).forEach(child => child.render(g));
  }
}

export default Container;
