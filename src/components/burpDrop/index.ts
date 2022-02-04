import * as PIXI from 'pixi.js';
import gsap, { Power0, Bounce } from 'gsap';

export interface BurpDrop {
  container: PIXI.Container;
  reset: () => void;
}

interface BurpDropProps {
  pos?: { x: number; y: number };
}

type DropPosition = { x: number; y: number };

/**
 * A blood drop to leave as a trail
 *
 * @returns Interface object containing methods that can be called on this module
 *
 */
export const burpDrop = (props: BurpDropProps): BurpDrop => {
  const pos = props.pos ?? { x: 0, y: 0 };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'burpDrop';

  let state = {
    startPos: { ...pos },
  };
  const initialState = { ...state };

  const rb = Math.round(Math.random() * 2);
  const texture = PIXI.Texture.from(`./assets/miri-game/burp${rb}.png`);

  // placeholder sprite
  const dropSprite = new PIXI.Sprite(texture);
  dropSprite.angle = Math.random() * 360;
  dropSprite.anchor.set(0.5);
  dropSprite.scale.set(0.5);
  dropSprite.alpha = 0.0;
  container.addChild(dropSprite);
  const startY = pos.y;
  const drip = (): void => {
    gsap.killTweensOf(dropSprite);
    const myTween = gsap.to(dropSprite, {
      duration: 1,
      pixi: { scale: 3.0, y: -50, angle: 360 },
      ease: Power0.easeOut,
    });

    const myTweenAlpha = gsap.to(dropSprite, {
      duration: 0.25,
      pixi: { alpha: 2 },
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
      pixi: { scale: 6.0, y: -100, angle: 580 },
      ease: Power0.easeOut,
    });

    const myTweenAlpha = gsap.to(dropSprite, {
      duration: 3,
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
