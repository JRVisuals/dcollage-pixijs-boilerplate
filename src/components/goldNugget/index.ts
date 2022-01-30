import * as PIXI from 'pixi.js';
import gsap, { Power0, Bounce } from 'gsap';

export interface GoldNugget {
  container: PIXI.Container;
  reset: () => void;
}

interface GoldNuggetProps {
  pos?: { x: number; y: number };
  textures?: { nuggetTexture: PIXI.Texture };
  anims?: { [key: string]: Array<PIXI.Texture> };
}

type NuggetPosition = { x: number; y: number };

/**
 * A simple pick up object, a gold nugget
 *
 * @returns Interface object containing methods that can be called on this module
 *
 */
export const goldNugget = (props: GoldNuggetProps): GoldNugget => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'goldNugget';

  const { anims, textures } = props;

  let state = {
    startPos: { ...pos },
  };
  const initialState = { ...state };

  const nuggetContainer = new PIXI.Container();
  container.addChild(nuggetContainer);

  // animated sprite
  // const playerSprite = new PIXI.AnimatedSprite(anims[PLAYER_MOVEMENT.IDLE]);
  // playerContainer.addChild(playerSprite);

  // placeholder sprite
  const nuggetSprite = new PIXI.Sprite(textures.nuggetTexture);
  nuggetSprite.anchor.set(0.5);
  nuggetContainer.addChild(nuggetSprite);

  nuggetSprite.scale.set(0.5);
  nuggetSprite.alpha = 0;

  const spriteMargin = 20;

  const grow = (): void => {
    gsap.killTweensOf(nuggetSprite);
    const myTween = gsap.to(nuggetSprite, {
      duration: 0.35,
      pixi: { scale: 1 },
      ease: Bounce.easeOut,
    });

    const myTweenAlpha = gsap.to(nuggetSprite, {
      duration: 0.5,
      pixi: { alpha: 1 },
      ease: Power0.easeOut,
    });
  };

  grow();

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState };
    container.x = state.startPos.x;
    container.y = state.startPos.y;
  };
  reset();

  return {
    container,
    reset,
  };
};
