import * as PIXI from 'pixi.js';
import gsap, { Power0, Bounce } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

import {
  APP_HEIGHT,
  APP_WIDTH,
  OBJECT_STATUS,
  PLAYER_SPEED,
} from '@src/constants';
import { bloodDrop } from '../bloodDrop';

import * as Movement from './movement';

export interface PlayerCharacter {
  container: PIXI.Container;
  initAnimations: (anims?: { [key: string]: Array<PIXI.Texture> }) => void;
  reset: () => void;
  update: (delta: number, keysDown: {}) => void;
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  moveStop: () => void;
  grow: () => void;
  getSize: () => number;
  wither: (onCompleteCallback: () => void) => void;
}

interface PlayerCharacterProps {
  pos?: { x: number; y: number };
  textures?: { playerTexture: PIXI.Texture };
  anims?: { [key: string]: Array<PIXI.Texture> };
  bloodContainer: PIXI.Container;
}

/**
 * A simple player character
 *
 * @returns Interface object containing methods that can be called on this module
 *
 */
export const playerCharacter = (
  props: PlayerCharacterProps
): PlayerCharacter => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  let playerSprite;

  container.name = 'playerCharacter';

  // Instantiate PIXI
  PixiPlugin.registerPIXI(PIXI);
  gsap.registerPlugin(PixiPlugin);

  const { anims, textures } = props;

  let state = {
    startPos: { ...pos },
    status: OBJECT_STATUS.ACTIVE,
    direction: Movement.PLAYER_DIRECTION.NONE,
    movement: Movement.PLAYER_MOVEMENT.IDLE,
    movementSpeed: PLAYER_SPEED,
    size: 1,
    bloodContainer: props.bloodContainer,
  };
  const initialState = { ...state };

  const playerContainer = new PIXI.Container();
  container.addChild(playerContainer);

  //
  const initAnimations = (anims): void => {
    // animated sprite
    playerSprite = new PIXI.AnimatedSprite(
      anims[Movement.PLAYER_MOVEMENT.IDLE]
    );
    playerContainer.addChild(playerSprite);
    playerSprite.animationSpeed = 0.15;
    playerSprite.alpha = 0;
    playerSprite.anchor.set(0.5);
  };

  const updateContainer = (delta: number, keysDown: {}): void => {
    const newPos = Movement.moveUpdate(
      state,
      playerSprite,
      container,
      keysDown,
      bloodDrop,
      delta
    );
    container.x = newPos.x;
    container.y = newPos.y;
  };

  const moveStop = (): void => {
    playerSprite.stop();
    Movement.setMovement(state, Movement.PLAYER_MOVEMENT.IDLE);
  };
  const moveUp = (): void => {
    Movement.setDirection(state, Movement.PLAYER_DIRECTION.UP);
    Movement.setMovement(state, Movement.PLAYER_MOVEMENT.WALK_UP);
  };
  const moveDown = (): void => {
    Movement.setDirection(state, Movement.PLAYER_DIRECTION.DOWN);
    Movement.setMovement(state, Movement.PLAYER_MOVEMENT.WALK_DOWN);
  };
  const moveLeft = (): void => {
    Movement.setDirection(state, Movement.PLAYER_DIRECTION.LEFT);
    Movement.setMovement(state, Movement.PLAYER_MOVEMENT.WALK_LEFT);
  };
  const moveRight = (): void => {
    Movement.setDirection(state, Movement.PLAYER_DIRECTION.RIGHT);
    Movement.setMovement(state, Movement.PLAYER_MOVEMENT.WALK_RIGHT);
  };

  const getSize = (): number => state.size;

  const grow = (): void => {
    state.size += 0.2;

    gsap.killTweensOf(playerSprite);

    const myTween = gsap.to(playerSprite, {
      duration: 0.5,
      pixi: { scale: state.size },
      ease: Bounce.easeOut,
    });
  };

  const sprout = (onCompleteCallback?): void => {
    console.log('sprout called');
    gsap.killTweensOf(playerSprite);
    playerSprite.alpha = 0;
    const myTween = gsap.to(playerSprite, {
      duration: 0.5,
      pixi: { scale: 2, alpha: 1 },
      ease: Bounce.easeInOut,
      onComplete: () => {
        onCompleteCallback && onCompleteCallback();
      },
    });
  };

  const wither = (onCompleteCallback?): void => {
    console.log('wither called');
    gsap.killTweensOf(playerSprite);

    const myTween = gsap.to(playerSprite, {
      duration: 0.5,
      pixi: { scale: 0, angle: 360 },
      ease: Bounce.easeIn,
      onComplete: () => {
        console.log('wither complete');
        onCompleteCallback && onCompleteCallback();
      },
    });
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    console.log('playersprite reset', playerSprite.scale);

    container.x = state.startPos.x;
    container.y = state.startPos.y;
    state = { ...initialState };

    playerSprite.scale.set(0);
    sprout();
  };

  const update = (delta, keysDown): void => {
    // Update called by main
    state.status === OBJECT_STATUS.ACTIVE && updateContainer(delta, keysDown);
  };

  return {
    container,

    initAnimations,

    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    moveStop,
    grow,
    getSize,
    wither,

    reset,
    update,
  };
};
