import Text, {TextStyleProps} from '../Text';
import Container from '../Container';
import Color from '../../Color';

class CounterComponent extends Container {
  private txtCounter: Text;
  private label: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
  ) {
    super(x, y, width, height);
    this.label = label;
    this.txtCounter = new Text(0, 0, `${this.label}: 0`)
      .centerHorizontally()
      .centerVertically();

    this.addChild('counter', this.txtCounter);
    this.setStyle({
      borderWidth: 4,
      borderColor: new Color(80, 80, 80, 255),
    });
  }

  public setCounter(counter: number): CounterComponent {
    this.txtCounter.text = `${this.label}: ${counter}`;
    return this;
  }

  public setTextStyle(style: TextStyleProps): CounterComponent {
    this.txtCounter.setStyle(style);
    return this;
  }
}

export default CounterComponent;
