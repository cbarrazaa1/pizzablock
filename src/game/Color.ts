import {Nullable} from '../util/Types';

class Color {
  public static BLACK = new Color(0, 0, 0, 255);
  public static WHITE = new Color(255, 255, 255, 255);
  public static CYAN = new Color(0, 240, 240, 255);
  public static BLUE = new Color(0, 0, 240, 255);
  public static ORANGE = new Color(240, 160, 0, 255);
  public static YELLOW = new Color(240, 240, 0, 255);
  public static GREEN = new Color(0, 240, 0, 255);
  public static PURPLE = new Color(160, 0, 240, 255);
  public static RED = new Color(240, 0, 0, 255);

  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public toString(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255.0})`;
  }

  public copy(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }
}

export default Color;
