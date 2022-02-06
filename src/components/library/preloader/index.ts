import * as PIXI from 'pixi.js';
import * as PIXISOUND from 'pixi-sound'; // Can we preload sounds here too?
import { APP_VERSION, PRELOAD_ARRAY } from '@src/constants';
export interface Preloader {
  init: (onAssetsLoadedCallback: () => void) => void;
  secondaryLoad: (onAssetsLoadedCallback: () => void) => void;
}

interface PreloaderProps {
  assetList?: Array<any>; // unused for now
}

/**
 * A non-visual asset preloader used by core
 *
 * @param props - Standard component properties.
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const preloader = (props: PreloaderProps): Preloader => {
  // TODO: Implement an asset list prop
  const assetList = props?.assetList;

  /**
   * init
   * @description Kick it off!
   * @param onAssetsLoadedCallback a callback function to be triggered when assets are loaded
   */
  const preloader = PIXI.Loader.shared;
  preloader.defaultQueryString = `v${APP_VERSION}`;
  const init = (onAssetsLoadedCallback: () => void): void => {
    // Preload Assets ------------------------------------------------

    // Preload Array Set in Constants allows for any number of assets to be set to load
    PRELOAD_ARRAY.forEach((e) => {
      preloader.add(e.name, e.url);
    });

    preloader.load(onAssetsLoadedCallback);
  };

  const secondaryLoad = (onAssetsLoadedCallback: () => void): void => {
    // Sound bits
    const pixiSound = PIXISOUND.default;
    // Load these up on startup...
    pixiSound.add('good', './assets/example/good.mp3');

    preloader.add('MainTheme', './assets/example/example.mp3');
    //.add('Track2', './assets/sfx/OBTSOST_Track2-mono64.mp3')
    preloader.load(onAssetsLoadedCallback);
  };

  return { init, secondaryLoad };
};
