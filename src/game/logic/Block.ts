import Color from '../Color';
import { randInt } from '../../util/Rand';

export enum BlockType {
  I = 0,
  O = 1,
  T = 2,
  L = 3,
  J = 4,
  S = 5,
  Z = 6,
}

export type BlockShape = {
  rotations: number[][][];
};

export type RotationSimulationResult = {
  rotation: number[][];
  position: {
    newX: number,
    newY: number,
  };
}

function mapBlockTypeToColor(type: BlockType): Color {
  switch (type) {
    case BlockType.I:
      return Color.CYAN;
    case BlockType.O:
      return Color.YELLOW;
    case BlockType.T:
      return Color.PURPLE;
    case BlockType.L:
      return Color.ORANGE;
    case BlockType.J:
      return Color.BLUE;
    case BlockType.S:
      return Color.RED;
    case BlockType.Z:
      return Color.GREEN;
  }
}

function mapBlockTypeToShape(type: BlockType): BlockShape {
  let res = {
    rotations: [[[0]]],
  };

  switch (type) {
    case BlockType.I:
      res.rotations = [[[1, 1, 1, 1]], [[1], [1], [1], [1]]];
      break;
    case BlockType.O:
      res.rotations = [
        [
          [1, 1],
          [1, 1],
        ],
      ];
      break;
    case BlockType.T:
      res.rotations = [
        [
          [1, 1, 1],
          [0, 1, 0],
        ],
        [
          [0, 1],
          [1, 1],
          [0, 1],
        ],
        [
          [0, 1, 0],
          [1, 1, 1],
        ],
        [
          [1, 0],
          [1, 1],
          [1, 0],
        ],
      ];
      break;
    case BlockType.L:
      res.rotations = [
        [
          [1, 1, 1],
          [1, 0, 0],
        ],
        [
          [1, 1],
          [0, 1],
          [0, 1],
        ],
        [
          [0, 0, 1],
          [1, 1, 1],
        ],
        [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
      ];
      break;
    case BlockType.J:
      res.rotations = [
        [
          [1, 1, 1],
          [0, 0, 1],
        ],
        [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
        [
          [1, 0, 0],
          [1, 1, 1],
        ],
        [
          [1, 1],
          [1, 0],
          [1, 0],
        ],
      ];
      break;
    case BlockType.S:
      res.rotations = [
        [
          [1, 1, 0],
          [0, 1, 1],
        ],
        [
          [0, 1],
          [1, 1],
          [1, 0],
        ],
      ];
      break;
    case BlockType.Z:
      res.rotations = [
        [
          [0, 1, 1],
          [1, 1, 0],
        ],
        [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      ];
      break;
  }

  return res;
}

class Block {
  public rotation: number;
  public color: Color;
  public x: number;
  public y: number;
  public shape: BlockShape;
  private type: BlockType;

  constructor(x: number, y: number, randomize: boolean = true) {
    this.rotation = 0;
    this.x = x;
    this.y = y;
    
    if (randomize) {
      this.type = randInt(0, 6) as BlockType;
    } else {
      this.type = BlockType.I;
    }

    this.color = mapBlockTypeToColor(this.type);
    this.shape = mapBlockTypeToShape(this.type);
  }

  rotateCW(): void {
    const oldRot = this.rotation;
    this.rotation++;
    if (this.rotation === this.shape.rotations.length) {
      this.rotation = 0;
    }

    const newPos = this.applyRotationOffset(oldRot, this.rotation);
    this.x = newPos.newX;
    this.y = newPos.newY;
  }

  rotateCCW(): void {
    const oldRot = this.rotation;
    this.rotation--;
    if (this.rotation < 0) {
      this.rotation = this.shape.rotations.length - 1;
    }

    const newPos = this.applyRotationOffset(oldRot, this.rotation);
    this.x = newPos.newX;
    this.y = newPos.newY;
  }

  applyRotationOffset(oldRot: number, newRot: number): {newX: number, newY: number} {
    const {x, y} = this;
    let newX = x, newY = y;

    switch (this.type) {
      case BlockType.I:
        if (oldRot === 0 && newRot === 1) {
          newX = x + 2;
          newY = y - 2;
        } else if (oldRot === 1 && newRot === 0) {
          newX = x - 2;
          newY = y + 2;
        }
        break;
      case BlockType.T:
      case BlockType.L:
      case BlockType.J:
        if (oldRot === 0 && newRot === 1) {
          newY = y - 1;
        } else if (oldRot === 2 && newRot === 3) {
          newX = x + 1;
        } else if (oldRot === 3 && newRot === 0) {
          newX = x - 1;
          newY = y + 1;
        } else if (oldRot === 1 && newRot === 0) {
          newY = y + 1;
        } else if (oldRot === 3 && newRot === 2) {
          newX = x - 1;
        } else if (oldRot === 0 && newRot === 3) {
          newX = x + 1;
          newY = y - 1;
        }
        break;
      case BlockType.S:
      case BlockType.Z:
        if (oldRot === 0 && newRot === 1) {
          newX = x + 1;
          newY = y - 1;
        } else if (oldRot === 1 && newRot === 0) {
          newX = x - 1;
          newY = y + 1;
        }
        break;
    
      default:
        break;
    }

    return {newX, newY}
  }

  simulateRotateCW(): RotationSimulationResult {
    const oldSimRot = this.rotation;
    let simRotation = this.rotation;
    simRotation++;
    if (simRotation === this.shape.rotations.length) {
      simRotation = 0;
    }

    return {
      rotation: [...this.shape.rotations[simRotation]],
      position: this.applyRotationOffset(oldSimRot, simRotation),
    };
  }

  simulateRotateCCW(): RotationSimulationResult {
    const oldSimRot = this.rotation;
    let simRotation = this.rotation;
    simRotation--;
    if (simRotation < 0) {
      this.rotation = this.shape.rotations.length - 1;
    }

    return {
      rotation: [...this.shape.rotations[simRotation]],
      position: this.applyRotationOffset(oldSimRot, simRotation),
    };
  }
}

export default Block;
