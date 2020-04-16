import Widget from '../Widget';
import Container from '../Container';
import Block from '../../logic/Block';
import {InputEvent} from '../../InputHandler';

class NextBlockComponent extends Widget {
  private block: Block;
  private blockSize: number;

  constructor(block: Block, blockSize: number) {
    super(0, 0, 0, 0);
    this.block = block;
    this.blockSize = blockSize;

    const {shape, rotation} = this.block;
    this.width = shape.rotations[rotation][0].length * blockSize;
    this.height = shape.rotations[rotation].length * blockSize;
  }

  public input(_: InputEvent): void {}

  public update(_: number): void {}

  public render(g: CanvasRenderingContext2D): void {
    const {shape, rotation, color} = this.block;
    const shapeWidth = shape.rotations[rotation][0].length;
    const shapeHeight = shape.rotations[rotation].length;

    this.width = shapeWidth * this.blockSize;
    this.height = shapeHeight * this.blockSize;

    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        if (shape.rotations[rotation][j][i] === 1) {
          g.fillStyle = color.toString();
          g.fillRect(
            this.getRealX() +
              this.parent!.width / 2 -
              this.width / 2 +
              i * this.blockSize,
            this.getRealY() -
              10 +
              this.parent!.height / 2 -
              this.height / 2 +
              j * this.blockSize,
            this.blockSize,
            this.blockSize,
          );
        }
      }
    }
  }
}

export default NextBlockComponent;
