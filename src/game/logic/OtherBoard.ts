import {BlockData, BOARD_WIDTH, BOARD_HEIGHT} from './Board';
import Widget from '../ui/Widget';
import Color from '../Color';

class OtherBoard {
  public mat: BlockData[][];
  private parent: Widget;
  private blockSize: number;

  constructor(parent: Widget, blockSize: number) {
    this.parent = parent;
    this.blockSize = blockSize;

    this.mat = new Array(BOARD_WIDTH)
      .fill(null)
      .map(() => new Array(BOARD_HEIGHT).fill({
        value: 0,
        color: Color.RED,
      }));
  }

  public render(g: CanvasRenderingContext2D): void {
    const borderColor = new Color(80, 80, 80, 255).toString();
    const BOARD_X = this.parent.getRealX();
    const BOARD_Y = this.parent.getRealY();

    g.strokeStyle = borderColor;
    g.lineWidth = 1;
    g.strokeRect(BOARD_X, BOARD_Y, BOARD_WIDTH * this.blockSize, BOARD_HEIGHT * this.blockSize);

    // render board
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (this.mat[x][y].value === 1) {
          g.fillStyle = this.mat[x][y].color.toString();
          g.fillRect(x * this.blockSize + BOARD_X, y * this.blockSize + BOARD_Y, this.blockSize, this.blockSize);
        } else {
          g.strokeStyle = borderColor;
        }
      }
    }
  }
}

export default OtherBoard;