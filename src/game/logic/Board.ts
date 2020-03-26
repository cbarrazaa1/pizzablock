import Color from '../Color';
import Block, {BlockType} from './Block';
import InputHandler, {InputEvent, InputKey} from '../InputHandler';

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
  private newBlockTimer: number;
  private shouldSpawnBlock: boolean;

  constructor() {
    const emptyData: BlockData = {
      value: 0,
      color: Color.RED,
    };

    this.mat = new Array(BOARD_WIDTH)
      .fill(null)
      .map(() => new Array(BOARD_HEIGHT).fill(emptyData));

    this.selectedBlock = new Block(4, 0);
    this.dropTimer = 0;
    this.newBlockTimer = 0;
    this.shouldSpawnBlock = false;
  }

  public update(delta: number): void {
    if (this.dropTimer >= 100) {
      let shouldFall = true;
      const {x, y, rotation, shape, color} = this.selectedBlock;
      const shapeHeight = shape.rotations[rotation].length;
      const shapeWidth = shape.rotations[rotation][0].length;

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
            if (y + j + 1 > BOARD_HEIGHT) {
              continue;
            }

            if (
              shape.rotations[rotation][j][i] === 1 &&
              this.mat[x + i][y + j + 1].value === 1
            ) {
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
        this.shouldSpawnBlock = true;
      }

      this.dropTimer = 0;
    }
    this.dropTimer += delta;
  
    // timer to spawn new block
    if (this.shouldSpawnBlock) {
      if (this.newBlockTimer >= 260) {
        this.selectedBlock = new Block(4, 0);
        this.newBlockTimer = 0;
        this.shouldSpawnBlock = false;
      }
      this.newBlockTimer += delta;
    }
  }

  public input(e: InputEvent): void {
    // movement
    if (InputHandler.isKeyDown(InputKey.LEFT, e)) {
      if (this.canMove(true)) {
        this.selectedBlock.x--;
      }
    } else if (InputHandler.isKeyDown(InputKey.RIGHT, e)) {
      if (this.canMove(false)) {
        this.selectedBlock.x++;
      }
    }

    // rotation
    if (InputHandler.isKeyDown(InputKey.Z, e)) {
      if (this.canRotate(true)) {
        this.selectedBlock.rotateCW();
      }
    } else if (InputHandler.isKeyDown(InputKey.X, e)) {
      if (this.canRotate(false)) {
        this.selectedBlock.rotateCCW();
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
    const {x, y, rotation, shape, color} = this.selectedBlock;
    const shapeHeight = shape.rotations[rotation].length;
    const shapeWidth = shape.rotations[rotation][0].length;

    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        if (shape.rotations[rotation][j][i] === 1) {
          g.fillStyle = color.toString();
          g.fillRect((x + i) * 32 + pos.x, (y + j) * 32 + pos.y, 32, 32);
        }
      }
    }
  }

  private canMove(left: boolean): boolean {
    const {shape, rotation} = this.selectedBlock;
    const shapeWidth = shape.rotations[rotation][0].length;
    const shapeHeight = shape.rotations[rotation].length;
    const {x, y} = this.selectedBlock;

    // check if we move outside of board
    if (left) {
      if (x - 1 < 0) {
        return false;
      }
    } else {
      if (x + shapeWidth + 1 > BOARD_WIDTH) {
        return false;
      }
    }

    // check if we move into a filled block
    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        if (shape.rotations[rotation][j][i] === 1) {
          if (left) {
            if (this.mat[x + i - 1][y + j].value === 1) {
              return false;
            }
          } else {
            if (this.mat[x + i + 1][y + j].value === 1) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  private canRotate(cw: boolean): boolean {
    let sim = this.selectedBlock.simulateRotateCW();
    if (!cw) {
      sim = this.selectedBlock.simulateRotateCCW();
    }

    const {position, rotation} = sim;
    const {newX, newY} = position;
    const shapeHeight = rotation.length;
    const shapeWidth = rotation[0].length;

    // check if we rotate outside of the board
    if (newX < 0 || newX + shapeWidth > BOARD_WIDTH || newY + shapeHeight > BOARD_HEIGHT || newY < 0) {
      return false;
    }

    // check if we rotate into a filled block
    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        if (rotation[j][i] === 1) {
          if (this.mat[newX + i][newY + j].value === 1) {
            return false;
          }
        }
      }
    }

    return true;
  }
}

export default Board;
