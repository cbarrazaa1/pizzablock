import {BlockData, BOARD_WIDTH, BOARD_HEIGHT} from './Board';
import Widget from '../ui/Widget';
import Color from '../Color';

class OtherBoard {
  public mat: BlockData[][];
  public gameOver: boolean;
  public onlineGameEnded: boolean;
  public isWinner: boolean;
  private parent: Widget;
  private blockSize: number;

  constructor(parent: Widget, blockSize: number) {
    this.parent = parent;
    this.blockSize = blockSize;
    this.gameOver = false;
    this.onlineGameEnded = false;
    this.isWinner = false;

    this.mat = new Array(BOARD_WIDTH).fill(null).map(() =>
      new Array(BOARD_HEIGHT).fill({
        value: 0,
        color: Color.RED,
      }),
    );
  }

  public render(g: CanvasRenderingContext2D): void {
    const borderColor = new Color(80, 80, 80, 255).toString();
    const BOARD_X = this.parent.getRealX();
    const BOARD_Y = this.parent.getRealY();

    g.strokeStyle = borderColor;
    g.lineWidth = 1;
    g.strokeRect(
      BOARD_X,
      BOARD_Y,
      BOARD_WIDTH * this.blockSize,
      BOARD_HEIGHT * this.blockSize,
    );

    // render board
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (this.mat[x][y].value === 1) {
          g.fillStyle = this.mat[x][y].color.toString();
          g.fillRect(
            x * this.blockSize + BOARD_X,
            y * this.blockSize + BOARD_Y,
            this.blockSize,
            this.blockSize,
          );
        } else {
          g.strokeStyle = borderColor;
        }
      }
    }

    // render game over
    if (this.gameOver) {
      const width = BOARD_WIDTH * this.blockSize;
      const height = BOARD_HEIGHT * this.blockSize;

      g.fillStyle = 'rgba(0, 0, 0, 0.75)';
      g.fillRect(BOARD_X - 1, BOARD_Y - 1, width + 2, height + 2);

      let text = 'Game Over';
      g.fillStyle = 'rgba(150, 0, 0, 1.0)';
      if (this.onlineGameEnded) {
        if (this.isWinner) {
          text = 'Winner';
          g.fillStyle = 'rgba(0, 150, 0, 1.0)';
        } else {
          text = 'Loser';
        }
      }
      let size = null;

      if (this.blockSize === 32) {
        g.font = '30px Arial';
      } else if (this.blockSize === 16) {
        g.font = '20px Arial';
      }
      size = g.measureText(text);
      g.fillText(text, BOARD_X + width / 2 - size.width / 2, height / 2);
    }
  }

  public shiftBlocks(clearedLines: number[]): void {
    let sequentialClear = true;

    // check if lines were cleared sequentially
    if (clearedLines.length === 2) {
      if (clearedLines[1] - clearedLines[0] !== 1) {
        sequentialClear = false;
      }
    }

    // shift blocks down
    const shiftInternal = (clearY: number, shiftCount: number): void => {
      for (let y = clearY - 1; y >= 0; y--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          this.mat[x][y + shiftCount] = {...this.mat[x][y]};
          this.mat[x][y].value = 0;
        }
      }
    };

    if (sequentialClear) {
      shiftInternal(clearedLines[0], clearedLines.length);
    } else {
      shiftInternal(clearedLines[0], 1);
      shiftInternal(clearedLines[1], 1);
    }
  }
}

export default OtherBoard;
