import Text from "./Text";
import Container from "./Container";
import Color from "../Color";
import { Nullable } from "../../util/Types";

class Button extends Container {
  private txtLabel: Text;
  
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    color: Color,
  ) {
    super(x, y, width, height);
    this.txtLabel = new Text(0, 0, label)
      .centerHorizontally()
      .centerVertically();
    
    this.addChild('label', this.txtLabel);
    this.setStyle({
      borderWidth: 2,
      borderColor: color,
      backgroundColor: color,
    });
  }
}

export default Button;