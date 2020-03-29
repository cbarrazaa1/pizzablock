export type InputEvent = React.KeyboardEvent | React.MouseEvent;

export enum InputKey {
  UP = 'ArrowUp',
  LEFT = 'ArrowLeft',
  DOWN = 'ArrowDown',
  RIGHT = 'ArrowRight',
  Z = 'z',
  X = 'x',
  ENTER = 'Enter',
}

export enum InputButton {
  LEFT = 1,
  RIGHT = 2,
  MIDDLE = 4,
}

interface InputHandler {
  readonly isKeyDown: (key: InputKey, e: InputEvent) => boolean;
  readonly isKeyUp: (key: InputKey, e: InputEvent) => boolean;
  readonly isMouseDown: (button: InputButton, e: InputEvent) => boolean;
}

const inputHandler: InputHandler = {
  isKeyDown: (key: InputKey, e: InputEvent): boolean => {
    const ev = e as React.KeyboardEvent;
    if (ev.type === 'keydown') {
      return ev.key === key;
    }

    return false;
  },
  isKeyUp: (key: InputKey, e: InputEvent): boolean => {
    const ev = e as React.KeyboardEvent;
    if (ev.type === 'keyup') {
      return ev.key === key;
    }

    return false;
  },
  isMouseDown: (button: InputButton, e: InputEvent): boolean => {
    const ev = e as React.MouseEvent;
    if (ev.type === 'mousedown') {
      return ev.button === button;
    }

    return false;
  },
};

export default inputHandler;
