import Color from '../Color';
import Block, {BlockType} from './Block';
import InputHandler, {InputEvent, InputKey} from '../InputHandler';
import {StrMap} from '../../util/Types';
import Timer from '../Timer';
import _ from 'lodash';
import Widget from '../ui/Widget';

const TWEEN = require('@tweenjs/tween.js').default;

export interface BlockData {
  value: number;
  color: Color;
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
const NEW_BLOCK_TIMER_DEFAULT = 280;
const MOVE_BLOCK_TIMER_DEFAULT = 80;

function mapLevelToDropTimer(level: number): number {
  switch (level) {
    case 0:
      return 800;
    case 1:
      return 716;
    case 2:
      return 633;
    case 3:
      return 550;
    case 4:
      return 466;
    case 5:
      return 383;
    case 6:
      return 300;
    case 7:
      return 216;
    case 8:
      return 133;
    case 9:
      return 100;
    case 10:
    case 11:
    case 12:
      return 83;
    case 13:
    case 14:
    case 15:
      return 66;
    case 16:
    case 17:
    case 18:
      return 50;
  }

  if (level >= 19 && level <= 28) {
    return 33;
  }

  return 16;
}

export type PlaceBlockCallbackData = {
  x: number;
  y: number;
  data: number[][];
  type: BlockType;
};

export type PlaceBlockCallback = (block: PlaceBlockCallbackData) => void;
type GameEndedCallback = () => void;

class Board {
  private mat!: BlockData[][];
  private selectedBlock!: Block;
  private timers!: StrMap<Timer>;
  private shouldSpawnBlock!: boolean;
  private movingLeft!: boolean;
  private movingRight!: boolean;
  private movementHoldTime!: number;
  private clearingLines!: boolean;
  private gameOver!: boolean;
  private lineCounter!: number;
  private parent: Widget;
  private blockSize: number;
  private shadowY!: number;
  private pressingDown!: boolean;
  private rotatingCW!: boolean;
  private rotatingCCW!: boolean;
  public clearedLines!: number;
  public level!: number;
  public score!: number;
  public nextBlock!: Block;
  public onPlaceBlock?: PlaceBlockCallback;
  public onGameEnded?: GameEndedCallback;
  public isSingleplayer!: boolean;
  public onlineGameEnded!: boolean;
  public isOnlineGameWinner!: boolean;

  constructor(parent: Widget, blockSize: number, initialLevel?: number) {
    this.parent = parent;
    this.blockSize = blockSize;
    this.startGame(initialLevel);
  }

  private startGame(initialLevel?: number): void {
    const emptyData: BlockData = {
      value: 0,
      color: Color.RED,
    };

    this.mat = new Array(BOARD_WIDTH)
      .fill(null)
      .map(() => new Array(BOARD_HEIGHT).fill(emptyData));

    this.selectedBlock = new Block(4, 0);
    this.nextBlock = new Block(4, 0);

    if (initialLevel != null) {
      this.level = initialLevel;
    } else {
      this.level = 9;
    }

    this.timers = {
      drop: new Timer(mapLevelToDropTimer(this.level)),
      newBlock: new Timer(NEW_BLOCK_TIMER_DEFAULT),
      moveBlock: new Timer(MOVE_BLOCK_TIMER_DEFAULT),
      pressDown: new Timer(60),
    };
    this.shouldSpawnBlock = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.movementHoldTime = 0;
    this.clearingLines = false;
    this.gameOver = false;
    this.clearedLines = 0;
    this.lineCounter = 0;
    this.score = 0;
    this.isSingleplayer = true;
    this.onlineGameEnded = false;
    this.isOnlineGameWinner = false;
    this.shadowY = 0;
    this.pressingDown = false;
    this.rotatingCW = false;
    this.rotatingCCW = false;
  }

  private calcLineClearScore(lineCount: number): number {
    let base = 50;
    if (lineCount === 2) {
      base = 150;
    } else if (lineCount === 3) {
      base = 350;
    } else if (lineCount === 4) {
      base = 1000;
    }

    return base * (this.level + 1);
  }

  public update(delta: number): void {
    if (this.gameOver) {
      return;
    }

    if (this.rotatingCW) {
      if (this.canRotate(true)) {
        this.selectedBlock.rotateCW();
      }
      this.rotatingCW = false;
    }

    if (this.rotatingCCW) {
      if (this.canRotate(false)) {
        this.selectedBlock.rotateCCW();
      }
      this.rotatingCCW = false;
    }

    if (this.timers.drop.isActivated() || (this.pressingDown && this.timers.pressDown.isActivated())) {
      this.timers.drop.setResetTime(mapLevelToDropTimer(this.level));

      if (!this.shouldSpawnBlock) {
        let shouldFall = true;
        const {x, y, rotation, shape, color} = this.selectedBlock;
        const shapeHeight = shape.rotations[rotation].length;
        const shapeWidth = shape.rotations[rotation][0].length;

        // check if at bottom
        if (y + shapeHeight + 1 > BOARD_HEIGHT) {
          shouldFall = false;

          if (this.onPlaceBlock != null) {
            this.onPlaceBlock({
              x,
              y,
              data: _.cloneDeep(shape.rotations[rotation]),
              type: this.selectedBlock.type,
            });
          }

          for (let i = 0; i < shapeWidth; i++) {
            for (let j = 0; j < shapeHeight; j++) {
              if (shape.rotations[rotation][j][i] === 1) {
                this.mat[x + i][y + j] = {
                  color: color.copy(),
                  value: 1,
                };
              }
            }
          }

          this.selectedBlock.clearShape();
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
                if (this.onPlaceBlock != null) {
                  this.onPlaceBlock({
                    x,
                    y,
                    data: _.cloneDeep(shape.rotations[rotation]),
                    type: this.selectedBlock.type,
                  });
                }

                for (let ii = 0; ii < shapeWidth; ii++) {
                  for (let jj = 0; jj < shapeHeight; jj++) {
                    if (shape.rotations[rotation][jj][ii] === 1) {
                      this.mat[x + ii][y + jj] = {
                        color: color.copy(),
                        value: 1,
                      };
                    }
                  }
                }

                this.selectedBlock.clearShape();
                shouldFall = false;
                break;
              }
            }

            if (!shouldFall) {
              break;
            }
          }
        }

        if (shouldFall) {
          this.selectedBlock.y++;
        } else {
          this.shouldSpawnBlock = true;

          // check if any line was completed
          if (!this.clearingLines) {
            const linesY: number[] = [];
            const [startY, endY] = [y, y + shapeHeight - 1];
            let completedLine = true;

            for (let y = startY; y <= endY; y++) {
              for (let x = 0; x < BOARD_WIDTH; x++) {
                if (this.mat[x][y].value !== 1) {
                  completedLine = false;
                  break;
                }
              }

              const checkShiftBlocks = (): void => {
                if (linesY.length > 0) {
                  let sequentialClear = true;

                  // check if lines were cleared separately (can only happen with 2 line clears)
                  if (linesY.length === 2) {
                    if (linesY[1] - linesY[0] !== 1) {
                      sequentialClear = false;
                    }
                  }

                  // shift blocks down
                  const shiftBlocks = (
                    clearY: number,
                    shiftCount: number,
                  ): void => {
                    for (let y = clearY - 1; y >= 0; y--) {
                      for (let x = 0; x < BOARD_WIDTH; x++) {
                        this.mat[x][y + shiftCount] = {...this.mat[x][y]};
                        this.mat[x][y].value = 0;
                      }
                    }
                  };

                  if (sequentialClear) {
                    shiftBlocks(linesY[0], linesY.length);
                  } else {
                    shiftBlocks(linesY[0], 1);
                    shiftBlocks(linesY[1], 1);
                  }
                }
              };

              if (completedLine) {
                linesY.push(y);
                this.clearingLines = true;

                // delete line
                for (let xx = 0; xx < BOARD_WIDTH; xx++) {
                  (function (xx, self) {
                    new TWEEN.Tween({
                      alpha: self.mat[xx][y].color.a,
                    })
                      .to({alpha: 0}, 200 + xx * 40)
                      .onUpdate((obj: any) => {
                        self.mat[xx][y].color.a = obj.alpha;
                      })
                      .onComplete(() => {
                        self.mat[xx][y].value = 0;

                        if (
                          xx === BOARD_WIDTH - 1 &&
                          y === linesY[linesY.length - 1]
                        ) {
                          checkShiftBlocks();
                          self.clearingLines = false;
                          self.timers.newBlock.setResetTime(0);
                          self.clearedLines += linesY.length;
                          self.lineCounter += linesY.length;
                          self.score += self.calcLineClearScore(linesY.length);

                          // level up
                          if (self.lineCounter >= 10) {
                            self.level++;
                            self.timers.drop.setResetTime(
                              mapLevelToDropTimer(self.level),
                            );
                            self.lineCounter -= 10;
                          }
                        }
                      })
                      .start();
                  })(xx, this);
                }
              } else {
                completedLine = true;
              }
            }
          }
        }
      }
    }
    this.timers.drop.tick(delta);
    if (this.pressingDown) {
      this.timers.pressDown.tick(delta);
    }

    // timer to spawn new block
    if (this.shouldSpawnBlock && !this.clearingLines) {
      if (this.timers.newBlock.isActivated()) {
        this.selectedBlock = _.cloneDeep(this.nextBlock);
        this.nextBlock = new Block(4, 0);
        this.shouldSpawnBlock = false;
        this.timers.newBlock.setResetTime(NEW_BLOCK_TIMER_DEFAULT);
      }
      this.timers.newBlock.tick(delta);
    }

    // selected block movement
    if (this.movementHoldTime >= 80) {
      if (this.timers.moveBlock.isActivated()) {
        if (this.movingLeft) {
          if (this.canMove(true)) {
            this.selectedBlock.x--;
          }
        } else if (this.movingRight) {
          if (this.canMove(false)) {
            this.selectedBlock.x++;
          }
        }

        this.timers.moveBlock.setResetTime(MOVE_BLOCK_TIMER_DEFAULT);
      }

      this.timers.moveBlock.tick(delta);
    }

    if (this.movingLeft || this.movingRight) {
      this.movementHoldTime += delta;
    } else {
      this.movementHoldTime = 0;
    }

    // check game over
    for (let x = 4; x <= 7; x++) {
      if (this.mat[x][0].value === 1) {
        this.gameOver = true;
      }
    }

    // update tween engine
    TWEEN.update();
  }

  public input(e: InputEvent): void {
    // start movement
    if (InputHandler.isKeyDown(InputKey.LEFT, e)) {
      this.movingLeft = true;
      this.movingRight = false;

      if (this.movementHoldTime < 80) {
        if (this.canMove(true)) {
          this.selectedBlock.x--;
        }
      }
    } else if (InputHandler.isKeyDown(InputKey.RIGHT, e)) {
      this.movingLeft = false;
      this.movingRight = true;

      if (this.movementHoldTime < 80) {
        if (this.canMove(false)) {
          this.selectedBlock.x++;
        }
      }
    }

    // end movement
    if (InputHandler.isKeyUp(InputKey.LEFT, e)) {
      this.movingLeft = false;
      this.timers.moveBlock.reset();
    } else if (InputHandler.isKeyUp(InputKey.RIGHT, e)) {
      this.movingRight = false;
      this.timers.moveBlock.reset();
    }

    // rotation
    if (InputHandler.isKeyDown(InputKey.Z, e)) {
      this.rotatingCW = true;
    } 

    if (InputHandler.isKeyDown(InputKey.X, e)) {
      this.rotatingCCW = true;
    }

    // instant drop
    if (InputHandler.isKeyUp(InputKey.SPACE, e)) {
      this.selectedBlock.y = this.shadowY;
      this.timers.drop.setResetTime(0);
    }

    if (InputHandler.isKeyDown(InputKey.DOWN, e)) {
      this.pressingDown = true;
    }

    if (InputHandler.isKeyUp(InputKey.DOWN, e)) {
      this.pressingDown = false;
    }

    // restart game
    if (this.gameOver) {
      if (InputHandler.isKeyUp(InputKey.ENTER, e)) {
        if (this.onGameEnded != null) {
          this.onGameEnded();
        }
      }
    }
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

    // render selected block
    const {x, y, rotation, shape, color} = this.selectedBlock;
    const shapeHeight = shape.rotations[rotation].length;
    const shapeWidth = shape.rotations[rotation][0].length;

    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        if (shape.rotations[rotation][j][i] === 1) {
          g.fillStyle = color.toString();
          g.fillRect(
            (x + i) * this.blockSize + BOARD_X,
            (y + j) * this.blockSize + BOARD_Y,
            this.blockSize,
            this.blockSize,
          );
        }
      }
    }

    // project the block shadow to the bottom and find the closest possible collision
    this.shadowY = BOARD_HEIGHT - shapeHeight;
    let changedShadowY = false;
    for (let scanY = y + shapeHeight; scanY < BOARD_HEIGHT; scanY++) {
      for (let scanX = x; scanX <= x + shapeWidth - 1; scanX++) {
        if (this.mat[scanX][scanY].value === 1) {
          this.shadowY = scanY - shapeHeight;
          changedShadowY = true;
          break;
        }
      }

      if (changedShadowY) {
        break;
      }
    }

    // try to fit a bit lower if possible
    let endSimulation = false;
    let originalShadowY = this.shadowY;
    if (changedShadowY) {
      for (let sim = 1; sim <= shapeHeight; sim++) {
        for (let i = 0; i < shapeWidth; i++) {
          for (let j = 0; j < shapeHeight; j++) {
            if (shape.rotations[rotation][j][i] === 1) {
              let ySim = originalShadowY + j + sim;
              if (ySim >= BOARD_HEIGHT) {
                endSimulation = true;
                break;
              }

              if (this.mat[x + i][ySim].value === 1) {
                endSimulation = true;
                break;
              }
            }
          }

          if (endSimulation) {
            break;
          }
        }

        if (endSimulation) {
          break;
        } else {
          this.shadowY = originalShadowY + sim;
        }
      }
    }

    // render shadow block
    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        if (shape.rotations[rotation][j][i] === 1) {
          let shadowColor = color.copy();
          shadowColor.a = 100;
          g.fillStyle = shadowColor.toString();
          g.fillRect(
            (x + i) * this.blockSize + BOARD_X,
            (this.shadowY + j) * this.blockSize + BOARD_Y,
            this.blockSize,
            this.blockSize,
          );
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
      if (!this.isSingleplayer && this.onlineGameEnded) {
        if (this.isOnlineGameWinner) {
          text = 'Winner';
          g.fillStyle = 'rgba(0, 150, 0, 1.0)';
        } else {
          text = 'Loser';
        }
      }
      let size = null;

      g.font = '30px Arial';
      size = g.measureText(text);
      g.fillText(text, BOARD_X + width / 2 - size.width / 2, height / 2);

      g.font = '16px Arial';
      text = 'Press Enter to play again.';
      g.fillStyle = 'white';
      size = g.measureText(text);

      if (this.isSingleplayer) {
        g.fillText(text, BOARD_X + width / 2 - size.width / 2, height / 2 + 26);
      } else {
        if (this.onlineGameEnded) {
          text = 'Press Enter to exit.';
          size = g.measureText(text);
          g.fillText(
            text,
            BOARD_X + width / 2 - size.width / 2,
            height / 2 + 26,
          );
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
    if (
      newX < 0 ||
      newX + shapeWidth > BOARD_WIDTH ||
      newY + shapeHeight > BOARD_HEIGHT ||
      newY < 0
    ) {
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
