import Color from "../Color";
import Block, {BlockType} from "./Block";
import { InputEvent } from "../states/State";

interface BlockData {
  value: number;
  color: Color;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

class Board {
  private mat: BlockData[][];
  private selectedBlock: Block;
  private dropTimer: number;

  constructor() {
    const emptyData: BlockData = {
      value: 0,
      color: Color.RED,
    };

    this.mat = new Array(BOARD_WIDTH).fill(null).map(
      () => new Array(BOARD_HEIGHT).fill(emptyData)
    );

    this.selectedBlock = new Block(BlockType.T, 4, 0);
    this.dropTimer = 0;
  }

  public update(delta: number): void {
    if (this.dropTimer >= 300) {
      let shouldFall = true;
      const {x, y, rotation, shape, color} = this.selectedBlock;
      const shapeHeight = this.selectedBlock.shape.rotations[rotation].length;
      const shapeWidth = this.selectedBlock.shape.rotations[rotation][0].length;
      console.log(shapeWidth, shapeHeight);

      // check if at bottom
      if (y + shapeHeight + 1 > BOARD_HEIGHT) {
        shouldFall = false;
        for (let i = 0; i < shapeWidth; i++) {
          for (let j = 0; j < shapeHeight; j++) {
            if (shape.rotations[rotation][j][i] === 1) {
              this.mat[x + i][y + j] = {
                color,
                value: 1,
              };
            }
          }
        }
      }
      
      // check if there is a block below
      if (shouldFall) {
        for (let i = 0; i < shapeWidth; i++) {
          for (let j = 0; j < shapeHeight; j++) {
            if (shape.rotations[rotation][j][i] === 1 && this.mat[x + i][y + j + 1].value === 1) {
              for (let ii = 0; ii < shapeWidth; ii++) {
                for (let jj = 0; jj < shapeHeight; jj++) {
                  if (shape.rotations[rotation][jj][ii] === 1) {
                    this.mat[x + ii][y + jj] = {
                      color,
                      value: 1,
                    };
                  }
                }
              }
              
              shouldFall = false;
              break;
            }
          }
        }
      }

      if (shouldFall) {
        this.selectedBlock.y++;
      } else {
        this.selectedBlock = new Block(BlockType.T, 4, 0);
      }
      
      this.dropTimer = 0;
    }

    this.dropTimer += delta;
  }

  public input(e: InputEvent): void {
    if (e.type === 'keydown') {
      const ev = e as React.KeyboardEvent;
      console.log(ev.key);
      if (ev.key === 'ArrowLeft') {
        this.selectedBlock.x--;
      } else if (ev.key === 'ArrowRight') {
        this.selectedBlock.x++;
      } else if (ev.key === 'z') {
        this.selectedBlock.rotateCCW();
      } else if (ev.key === 'x') {
        this.selectedBlock.rotateCW();
      }
    }
  }

  public render(g: CanvasRenderingContext2D): void {
    const pos = {
      x: 10,
      y: 10,
    };
    const borderColor = new Color(80, 80, 80, 255).toString();

    g.strokeStyle = borderColor;
    g.strokeRect(pos.x, pos.y, BOARD_WIDTH * 32, BOARD_HEIGHT * 32);

    // render board
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (this.mat[x][y].value === 1) {
          g.fillStyle = this.mat[x][y].color.toString();
          g.fillRect(x * 32 + pos.x, y * 32 + pos.y, 32, 32);
        } else {
          g.strokeStyle = borderColor;
          g.strokeRect(x * 32 + pos.x, y * 32 + pos.y, 32, 32);
        }
      }
    }

    // render selected block
    const rotation = this.selectedBlock.rotation;
    const shapeHeight = this.selectedBlock.shape.rotations[rotation].length;
    const shapeWidth = this.selectedBlock.shape.rotations[rotation][0].length;
    
    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        const {x, y} = this.selectedBlock;
        
        if (this.selectedBlock.shape.rotations[rotation][j][i] === 1) {
          g.fillStyle = this.selectedBlock.color.toString();
          g.fillRect((x + i) * 32 + pos.x, (y + j) * 32 + pos.y, 32, 32);
        }
      }
    }
  }
}

export default Board;