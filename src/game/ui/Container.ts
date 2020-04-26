import Widget, {StyleProps} from './Widget';
import Color from '../Color';
import {StrMap, Nullable} from '../../util/Types';
import InputHandler, {InputEvent, InputButton} from '../InputHandler';

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

type OnPressCallback = () => void;

enum AlphaState {
  NORMAL,
  HOVER,
  CLICKED,
};

class Container extends Widget {
  private children: StrMap<Widget> = {};
  private isClickable: boolean;
  private alphaState: AlphaState;
  private onPressCallback?: Nullable<OnPressCallback>;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.style = getDefaultStyle();
    this.isClickable = false;
    this.alphaState = AlphaState.NORMAL;
  }

  public onPress(onPress: OnPressCallback): Container {
    this.onPressCallback = onPress;
    this.isClickable = true;
    return this;
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

    // check for mouse
    const ev = e as React.MouseEvent;
    const canvas = ev.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [this.getRealX(), this.getRealY()];
    const [mX, mY] = [ev.clientX - rect.left, ev.clientY - rect.top];
    const intersects = (
      (mX >= x && mX <= x + this.width) 
      && (mY >= y && mY <= y + this.height)
    );

    if (this.isClickable) {
      if (intersects) {
        this.alphaState = AlphaState.HOVER;
        if (InputHandler.isMouseDown(InputButton.LEFT, e)) {
          this.alphaState = AlphaState.CLICKED;
          if (this.onPressCallback != null) {
            this.onPressCallback();
          }
        } else {
          this.alphaState = AlphaState.HOVER;
        }
      } else {
        this.alphaState = AlphaState.NORMAL;
      }
    }

    Object.values(this.children).forEach(child => child.input(e));
  }

  public render(g: CanvasRenderingContext2D): void {
    if (!this.visible) {
      return;
    }
    
    const style = this.style as ContainerStyleProps;
    const color = style.backgroundColor!;
    // adjust depending on state
    switch (this.alphaState) {
      case AlphaState.NORMAL:
        if (this.isClickable) {
          color.a = 200;
        } else {
          color.a = 255;
        }
        break;
      case AlphaState.HOVER:
        color.a = 160;
        break;
      case AlphaState.CLICKED:
        color.a = 255;
        break;
    }

    g.fillStyle = color.toString();
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
