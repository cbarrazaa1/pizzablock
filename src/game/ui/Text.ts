import { InputEvent } from "../InputHandler";
import Widget, { StyleProps } from "./Widget";
import Color from "../Color";

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
  }
}

class Text extends Widget {
  private text: string;
  private centeredHorizontally: boolean;

  constructor(x: number, y: number, text: string) {
    super(x, y, 0, 0);
    this.text = text;
    this.style = getDefaultStyle();
    this.centeredHorizontally = false;
  }

  public centerHorizontally(): Text {
    this.centeredHorizontally = true;
    return this;
  }

  public setStyle(style: TextStyleProps): Text {
    super.setStyle(style);
    return this;
  }

  public update(delta: number): void {}

  public input(e: InputEvent): void {}

  public render(g: CanvasRenderingContext2D): void {
    const style = this.style as TextStyleProps;

    if (this.centeredHorizontally && this.parent != null) {
      g.font = this.formatFont();
      const size = g.measureText(this.text);
      this.x = this.parent.width / 2 - size.width / 2;
    }

    g.font = this.formatFont();
    g.fillStyle = style.textColor!.toString();
    g.textBaseline = 'top';
    g.fillText(this.text, this.getRealX(), this.getRealY());
  }

  private formatFont(): string {
    const style = this.style as TextStyleProps;
    const size = style.fontSize!;
    const name = style.fontName!;
    return `${size}px ${name}`
  }
}

export default Text;