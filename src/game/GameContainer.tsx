import * as React from 'react';
import {useState, useCallback, useRef, useEffect} from 'react';
import Game, {Screen} from './Game';
import {Nullable} from '../util/Types';

function GameContainer(): JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Nullable<Game>>(null);

  const inputCallback = useCallback(
    e => {
      game?.input(e);
    },
    [game],
  );

  useEffect(() => {
    setGame(new Game(canvas.current!.getContext('2d')!));
  }, []);

  useEffect(() => {
    if (game == null) {
      return;
    }

    const timestep = 1 / 60.0;
    let delta = 0;
    let lastTick = new Date().getTime();
    let currentTick = 0;
    let animationFrameID = requestAnimationFrame(run);

    function run(): void {
      currentTick = new Date().getTime();
      delta = currentTick - lastTick;

      if (delta > timestep) {
        game?.render();
        game?.update(delta);

        lastTick = currentTick - (delta % timestep);
      }
      animationFrameID = requestAnimationFrame(run);
    }

    return () => cancelAnimationFrame(animationFrameID);
  }, [game]);

  return (
    <canvas
      tabIndex={0}
      ref={canvas}
      width={Screen.width}
      height={Screen.height}
      onKeyDown={inputCallback}
      onKeyPress={inputCallback}
      onKeyUp={inputCallback}
      onMouseDown={inputCallback}
      onMouseUp={inputCallback}
      onClick={inputCallback}
      onMouseMove={inputCallback}
    />
  );
}

export default GameContainer;
