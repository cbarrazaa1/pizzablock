import { Nullable } from "../util/Types";

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

  private r: number;
  private g: number;
  private b: number;
  private a: number;
  private strRep: Nullable<string>;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.strRep = null;
  }

  public toString(): string {
    if (this.strRep != null) {
      return this.strRep;
    }

    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255.0})`;
  }
}

export default Color;