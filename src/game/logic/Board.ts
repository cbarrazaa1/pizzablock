import Color from "../Color";

interface BlockData {
  value: number;
  color: Color;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

class Board {
  private mat: BlockData[][];

  constructor() {
    const emptyData: BlockData = {
      value: 0,
      color: Color.RED,
    };

    this.mat = new Array(BOARD_WIDTH).fill(null).map(
      () => new Array(BOARD_HEIGHT).fill(emptyData)
    );
  }

  public update(delta: number): void {

  }

  public render(g: CanvasRenderingContext2D): void {
    const pos = {
      x: 10,
      y: 10,
    };
    const borderColor = new Color(80, 80, 80, 255).toString();

    g.strokeStyle = borderColor;
    g.strokeRect(pos.x, pos.y, BOARD_WIDTH * 32, BOARD_HEIGHT * 32);

    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (this.mat[x][y].value === 1) {
          g.fillStyle = this.mat[x][y].color.toString();
        } else {
          g.strokeStyle = borderColor;
          g.strokeRect(x * 32 + pos.x, y * 32 + pos.y, 32, 32);
        }
        //g.fillRect(x * 32, y * 32, 32, 32);
      }
    }
  }
}

export default Board;