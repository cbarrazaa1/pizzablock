import * as React from 'react';
import {useRef, useEffect} from 'react';
import Game, {Screen} from './Game';

function GameContainer(): JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timestep = 1 / 60.0;
    const game = new Game(canvas.current!.getContext('2d')!);
    let delta = 0;
    let lastTick = new Date().getTime();
    let currentTick = 0;
    let animationFrameID = requestAnimationFrame(run);

    function run(): void {
      currentTick = new Date().getTime();
      delta = currentTick - lastTick;

      if (delta > timestep) {
        game.render();
        game.update(delta);

        lastTick = currentTick - (delta % timestep);
      }
      animationFrameID = requestAnimationFrame(run);
    }

    return () => cancelAnimationFrame(animationFrameID);
  }, []);

  return (
    <canvas 
      ref={canvas}
      width={Screen.width}
      height={Screen.height}
    />
  )
}

export default GameContainer;