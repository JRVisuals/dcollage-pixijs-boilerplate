import { APP_HEIGHT, APP_WIDTH, SPRITE_MARGIN } from '@src/constants';
import { bloodDrop } from '../bloodDrop';

//
export type PlayerPosition = { x: number; y: number };
export enum PLAYER_DIRECTION {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
export enum PLAYER_MOVEMENT {
  IDLE = 'balls',
  WALK_UP = 'walk_up',
  WALK_DOWN = 'walk_down',
  WALK_LEFT = 'walk_left',
  WALK_RIGHT = 'walk_right',
}

export const calculateMove = (
  state,
  playerSprite,
  currentPos: PlayerPosition,
  keysDown: {},
  bloodDrop,
  delta: number
): PlayerPosition => {
  let newPos = {
    x: currentPos.x,
    y: currentPos.y,
  };

  if (keysDown['KeyW'])
    newPos = {
      x: newPos.x,
      y: newPos.y - state.movementSpeed * delta,
    };

  if (keysDown['KeyS'])
    newPos = {
      x: newPos.x,
      y: newPos.y + state.movementSpeed * delta,
    };
  if (keysDown['KeyA'])
    newPos = {
      x: newPos.x - state.movementSpeed * delta,
      y: newPos.y,
    };
  if (keysDown['KeyD'])
    newPos = {
      x: newPos.x + state.movementSpeed * delta,
      y: newPos.y,
    };

  if (currentPos === newPos) {
    playerSprite.stop();
  } else {
    playerSprite.play();
    if (Math.random() > 0.85) {
      state.bloodContainer.addChild(
        bloodDrop({ pos: { x: currentPos.x + 32, y: currentPos.y + 64 } })
          .container
      );
    }
  }

  return newPos;
};
//
export const checkInBounds = (pos: PlayerPosition): boolean =>
  pos.x < APP_WIDTH - SPRITE_MARGIN &&
  pos.x > SPRITE_MARGIN &&
  pos.y < APP_HEIGHT - SPRITE_MARGIN &&
  pos.y > SPRITE_MARGIN;
//
export const setDirection = (state: any, val: PLAYER_DIRECTION): void => {
  state.direction = val;
};
//
export const setMovement = (state, val: PLAYER_MOVEMENT): void => {
  state.movement = val;
};
//
export const moveUpdate = (
  state,
  playerSprite,
  container,
  keysDown: {},
  bloodDrop,
  delta: number
): PlayerPosition => {
  const currentPos = { x: container.x, y: container.y };

  if (state.movement === PLAYER_MOVEMENT.IDLE || state.movementSpeed === 0)
    return currentPos;

  const nextPost = calculateMove(
    state,
    playerSprite,
    currentPos,
    keysDown,
    bloodDrop,
    delta
  );
  const newPos = checkInBounds(nextPost) ? nextPost : currentPos;

  return newPos;
};
//
