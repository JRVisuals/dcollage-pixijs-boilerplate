import * as PIXI from 'pixi.js';
import gsap, { Power0, Bounce } from 'gsap';

export interface BloodDrop {
  container: PIXI.Container;
  reset: () => void;
}

interface BloodDropProps {
  pos?: { x: number; y: number };
}

type DropPosition = { x: number; y: number };

/**
 * A blood drop to leave as a trail
 *
 * @returns Interface object containing methods that can be called on this module
 *
 */
export const bloodDrop = (props: BloodDropProps): BloodDrop => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'bloodDrop';

  let state = {
    startPos: { ...pos },
  };
  const initialState = { ...state };

  const rb = Math.round(Math.random() * 2);
  const texture = PIXI.Texture.from(`./assets/miri-game/blood${rb}.png`);

  // placeholder sprite
  const dropSprite = new PIXI.Sprite(texture);
  dropSprite.angle = Math.random() * 360;
  dropSprite.anchor.set(0.5);
  dropSprite.scale.set(0.5);
  dropSprite.alpha = 0.0;
  container.addChild(dropSprite);

  const drip = (): void => {
    gsap.killTweensOf(dropSprite);
    const myTween = gsap.to(dropSprite, {
      duration: 0.5,
      pixi: { scale: 2.0 },
      ease: Power0.easeOut,
    });

    const myTweenAlpha = gsap.to(dropSprite, {
      duration: 0.25,
      pixi: { alpha: 1 },
      ease: Power0.easeOut,
      onComplete: () => {
        fade();
      },
    });
  };

  const fade = (): void => {
    gsap.killTweensOf(dropSprite);
    const myTween = gsap.to(dropSprite, {
      duration: 3,
      pixi: { scale: 4.0 },
      ease: Power0.easeOut,
    });

    const myTweenAlpha = gsap.to(dropSprite, {
      duration: 6,
      pixi: { alpha: 0 },
      ease: Power0.easeOut,
      onComplete: () => {
        dropSprite.destroy();
      },
    });
  };

  drip();

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
