import {InputEvent} from '../InputHandler';
import Widget, {StyleProps} from './Widget';
import Color from '../Color';

export interface TextStyleProps extends StyleProps {
  textColor?: Color;
  fontName?: string;
  fontSize?: number;
}

function getDefaultStyle(): TextStyleProps {
  return {
    textColor: Color.WHITE.copy(),
    fontName: 'Arial',
    fontSize: 20,
  };
}

class Text extends Widget {
  public text: string;
  private centeredHorizontally: boolean;
  private centeredVertically: boolean;

  constructor(x: number, y: number, text: string) {
    super(x, y, 0, 0);
    this.text = text;
    this.style = getDefaultStyle();
    this.centeredHorizontally = false;
    this.centeredVertically = false;
  }

  public centerHorizontally(): Text {
    this.centeredHorizontally = true;
    return this;
  }

  public centerVertically(): Text {
    this.centeredVertically = true;
    return this;
  }

  public setStyle(style: TextStyleProps): Text {
    super.setStyle(style);
    return this;
  }

  public update(delta: number): void {
    if (!this.visible) {
      return;
    }
  }

  public input(e: InputEvent): void {
    if (!this.visible) {
      return;
    }
  }

  public render(g: CanvasRenderingContext2D): void {
    if (!this.visible) {
      return;
    }
    
    const style = this.style as TextStyleProps;

    g.font = this.formatFont();
    const size = g.measureText(this.text);
    if (this.parent != null) {
      if (this.centeredHorizontally) {
        this.x = this.parent.width / 2 - size.width / 2;
      }

      if (this.centeredVertically) {
        const height =
          size.actualBoundingBoxAscent + size.actualBoundingBoxDescent;
        this.y = this.parent.height / 2 - height / 2;
      }
    }

    g.fillStyle = style.textColor!.toString();
    g.textBaseline = 'top';
    g.fillText(this.text, this.getRealX(), this.getRealY());
  }

  private formatFont(): string {
    const style = this.style as TextStyleProps;
    const size = style.fontSize!;
    const name = style.fontName!;
    return `${size}px ${name}`;
  }
}

export default Text;
