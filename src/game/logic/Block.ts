import Color from '../Color';

export enum BlockType {
  I,
  O,
  T,
  L,
  J,
  S,
  Z,
}

export type BlockShape = {
  rotations: number[][][];
};

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

  constructor(type: BlockType, x: number, y: number) {
    this.color = Color.RED;
    this.shape = mapBlockTypeToShape(type);
    this.rotation = 0;
    this.x = x;
    this.y = y;
  }

  rotateCW(): void {
    this.rotation++;
    if (this.rotation === this.shape.rotations.length) {
      this.rotation = 0;
    }
  }

  rotateCCW(): void {
    this.rotation--;
    if (this.rotation < 0) {
      this.rotation = this.shape.rotations.length - 1;
    }
  }

  simulateRotateCW(): number[][] {
    let simRotation = this.rotation;
    simRotation++;
    if (simRotation === this.shape.rotations.length) {
      simRotation = 0;
    }

    return [...this.shape.rotations[simRotation]];
  }

  simulateRotateCCW(): number[][] {
    let simRotation = this.rotation;
    simRotation--;
    if (simRotation < 0) {
      this.rotation = this.shape.rotations.length - 1;
    }

    return [...this.shape.rotations[simRotation]];
  }
}

export default Block;
