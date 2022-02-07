import * as PIXI from 'pixi.js';
import gsap, { Power0 } from 'gsap';
import * as PIXIPARTICLES from 'pixi-particles';
import { zeroPad } from '@src/util/zeroPad';
import { THEME } from '@src/constants';
import { tintDisplayObject } from '@src/util/tintMatrix';

export interface BestScoreDisplay {
  container: PIXI.Container;
  reset: () => void;
  setText: (newText: string, isNewPersonalBest: boolean) => void;
  setVisibility: (isVisible: boolean) => void;
  getVisibility: () => boolean;
  update: (delta: number) => void;
}

interface BestScoreProps {
  pos?: { x: number; y: number };
  particleTextures: Array<PIXI.Texture>;
}

/**
 * Displays the user's personal best score after a run
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const bestScoreDisplay = (props: BestScoreProps): BestScoreDisplay => {
  const pos = props.pos ?? {
    x: 0,
    y: 0,
  };
  const container = new PIXI.Container();
  container.x = pos.x;
  container.y = pos.y;

  container.name = 'personal best';

  const { particleTextures } = props;

  // Text

  // "Personal Best" text
  const pbText = new PIXI.BitmapText('PERSONAL BEST', {
    fontName: `FFFFuego-16`,
    fontSize: 16,
    align: 'center',
  });
  pbText.anchor.set(0.5, 0);
  pbText.alpha = 0.8;
  pbText.tint = THEME.TXT_TITLES_HEX;
  container.addChild(pbText);

  const scoreText = new PIXI.BitmapText('0000000', {
    fontName: `FFFFuego-16-bold`,
    fontSize: 16,
    align: 'center',
  });
  scoreText.anchor.set(0.5, 0);
  scoreText.tint = THEME.TXT_HUD_HEX;
  scoreText.y = 20;
  container.addChild(scoreText);

  const setText = (newText: string, isNewPersonalBest: boolean): void => {
    scoreText.text = zeroPad(newText, 7);
    //const newTextStyle = isNewPersonalBest ? bigTextGoldStyle : bigTextStyle;
    emitter.emit = isNewPersonalBest;
    particleContainer.alpha = isNewPersonalBest ? 1 : 0;
    //scoreText.style = newTextStyle;
  };

  const setVisibility = (isVisible: boolean): void => {
    gsap.killTweensOf(container);
    if (isVisible) {
      container.alpha = 0;
      gsap.to(container, {
        duration: 0.2,
        delay: 0.5,
        alpha: 1,
        ease: Power0.easeOut,
      });
    } else {
      gsap.to(container, {
        duration: 0.2,
        alpha: 0,
        ease: Power0.easeIn,
      });
    }
  };

  const getVisibility = (): boolean => container.alpha > 0;

  // Emitters for high score celebration
  const particleContainer = new PIXI.Container();
  particleContainer.name = 'best score particles';
  container.addChild(particleContainer);
  // Tint Matrix for Color Modes
  // tintDisplayObject(particleContainer, THEME.PARTICLE_HEX);
  particleContainer.alpha = 0;
  const colorObject = {
    color: {
      start: '#aaaaaa',
      end: '#ffffff',
    },
  };
  const emitterConfigBase = {
    alpha: {
      start: 0.75,
      end: 0.5,
    },
    scale: {
      start: 0.5,
      end: 1,
      //minimumScaleMultiplier: 1,
    },
    speed: {
      start: 100,
      end: 100,
      //minimumSpeedMultiplier: 1,
    },
    startRotation: {
      min: 180,
      max: 360,
    },
    rotationSpeed: {
      min: 0,
      max: 20,
    },
    lifetime: {
      min: 0.5,
      max: 1.0,
    },
    blendMode: 'add',
    frequency: 0.02,
    emitterLifetime: 0,
    maxParticles: 250,
    pos: {
      x: 0,
      y: 0,
    },
    addAtBack: false,
    spawnType: 'circle',
    spawnCircle: {
      x: 0,
      y: 40,
      r: 10,
    },
  };

  const emitterConfig = {
    ...emitterConfigBase,
    ...colorObject,
  };
  const emitter = new PIXIPARTICLES.Emitter(
    particleContainer,
    particleTextures,
    emitterConfig
  );

  // Reset called by play again and also on init
  const reset = (): void => {
    // setVisibility(false);
    particleContainer.alpha = 0;
    emitter.emit = false;
  };
  reset();

  const update = (delta): void => {
    // Update called by main
    // bail on updates if we're not visible
    if (container.alpha < 1) return;
    emitter.emit && emitter.update(delta * 0.025);
  };

  return {
    container,
    reset,
    update,
    setText,
    setVisibility,
    getVisibility,
  };
};
