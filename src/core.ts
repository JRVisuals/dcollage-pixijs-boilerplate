import * as PIXI from 'pixi.js';
import gsap, { Power0 } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
import * as PIXISOUND from 'pixi-sound';
import { CRTFilter } from '@pixi/filter-crt';

import jrvascii from './util/jrvascii';
import { browserVisibility } from './util/browserVisibility';

import initPIXI, { PixiConfig } from './pixi';

import {
  APP_NAME,
  APP_VERSION,
  DCO_VERSION,
  APP_HEIGHT,
  APP_WIDTH,
  APP_BGCOLOR,
  Z_MC_BASE,
  Z_MC_UI,
  SFX_VOL_MULT,
  PLAYER_CONTINOUS_MOVEMENT,
} from './constants';
import './index.scss';

import * as COMP from './components';
import * as SCREENS from './screens';
import { Sounds } from './components/library/audio';
import {
  personalBestScores,
  PersonalBestScores,
} from './util/personalBestScore';
import { runtime } from './components/library';

declare global {
  interface Window {
    APP: DcollageApp;
  }
}

export interface DcollageApp {
  pixiApp: PIXI.Application;
  coreInterface: any;
}

export type Spritesheets = {
  main: PIXI.Spritesheet | null;
};

const hostDiv = document.getElementById('canvas');
const hostWidth = APP_WIDTH;
const hostHeight = APP_WIDTH * (APP_HEIGHT / APP_WIDTH);
const pixiConfig: PixiConfig = {
  width: hostWidth,
  height: hostHeight,
  backgroundColor: APP_BGCOLOR,
  antialias: false,
  resolution: 1, // use resolution: >1 to scale up
};
// No anti-alias - Uncomment for pixel art
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

/**
 * @function bootstrapApp
 *
 * Kicks off the application proper by instantiating the various components and wiring up their update methods to the update loop of the main application.
 *
 * @param props - Preloaded assets ({@link Spritesheets)}, {@link Sounds}) are passed in via props
 *
 */
const bootstrapApp = (props: {
  spriteSheets: Spritesheets;
  sounds?: Sounds;
}): DcollageApp => {
  // Throw down ye olde ASCII tag
  jrvascii();
  console.log('Built with the dCollage boilerplate.');
  console.log(`Appplication Name: ${APP_NAME}`);
  console.log(`Built with the dCollage boilerplate ${DCO_VERSION}`);
  console.log(`Appplication Version: ${APP_VERSION}`);
  console.log('-------------------------------------------');
  // TODO Make distinction between APP_VERSION and DCO_VERSION (dCollage Boilerplate Version)

  // Instantiate PIXI
  PixiPlugin.registerPIXI(PIXI);
  gsap.registerPlugin(PixiPlugin);

  const { pixiApp, mainContainer } = initPIXI(pixiConfig, hostDiv);

  const crtFilter = new CRTFilter({
    curvature: 2,
    vignetting: 0.2,
    noise: 0.1,
  });
  mainContainer.filters = [crtFilter];

  // Get our preloader assets
  let { spriteSheets } = props;
  let sounds = props?.sounds;
  let audioLayer = null;

  // Hide Loader GIF
  document.getElementById('loading').style.display = 'none';
  document.getElementById('footer').style.display = 'block';

  /**
   * This does a second round of initialization once additional assets (spritesheets)
   * have been loaded up - prior to this call some modules will be null as placeholders
   * This can be used to pass secondary loaded assets to modules and set their spritesheet referecnes
   */
  const initSecondaryModules = (): void => {
    console.log('initSecondaryModules', spriteSheets);
  };

  /**
   * Brings in the secondary load set of sprites
   * will also need to trigger any module initializations that require these sprites
   */
  const setAdditionalSprites = (secondarySprites): void => {
    spriteSheets = { ...spriteSheets, ...secondarySprites };
    initSecondaryModules();
  };

  // Check for query params
  //const params = new URLSearchParams(window.location.search);

  // Handle Browser visibility changes
  let lastMutedState = null;
  const handleBrowserVisibility = (isHidden: boolean): void => {
    if (isHidden) {
      lastMutedState = audioLayer.getMutedState();
      audioLayer.muteToggle(true, true);
      pixiApp.stop();
    } else {
      audioLayer.muteToggle(lastMutedState, true);
      pixiApp.start();
    }
  };
  browserVisibility(handleBrowserVisibility);

  // Sound bits
  const pixiSound = PIXISOUND.default; //TODO: deal with persistent loading of soundeffects / also make a soundsprite already
  // Load these up on startup...
  pixiSound.add('good', './assets/example/good.mp3');
  pixiSound.add('coin', './assets/example/coin.wav');

  // Create empty BASE and UI containers and add them to the mainContainer
  // Use constants for Z-index of these containers
  const baseContainer = mainContainer.addChildAt(
    new PIXI.Container(),
    Z_MC_BASE
  );
  const uiContainer = mainContainer.addChildAt(new PIXI.Container(), Z_MC_UI);
  baseContainer.name = 'gameContainer';
  uiContainer.name = 'uiContainer';

  const bgTexture = PIXI.Texture.from('./assets/example/background600x600.png');
  const bgSprite = new PIXI.Sprite(bgTexture);
  baseContainer.addChild(bgSprite);

  const setSounds = (soundsLoaded: Sounds): void => {
    sounds = soundsLoaded;
    // Add music as a component
    audioLayer = COMP.LIB.audio(sounds);
    // Play a track
    //audioLayer.music.playRandomTrack();
  };

  // Personal Best Score Display
  const bestScore = COMP.LIB.bestScoreDisplay({
    pos: { x: Math.round(APP_WIDTH * 0.5), y: 65 },
    particleTextures: null,
  });
  uiContainer.addChild(bestScore.container);

  // High Score Manager
  const personalBestManager: PersonalBestScores = personalBestScores(() => 0);

  // Personal Best Scoe
  const showPersonalBest = (): void => {
    // check to see if this is a personal best
    const score = gameLogic.getPlayerScore();
    const level = gameLogic.getCurrentLevel();
    const isNewPersonalBest = personalBestManager.checkPersonalBest(
      score,
      level,
      0
    );
    bestScore.setText(
      String(personalBestManager.getPersonalBest()),
      isNewPersonalBest
    );
    bestScore.setVisibility(true);
  };

  // Screens UI -----------------------------------------

  // Callback for Sample "Play Again" Button
  const onPlayButtonPress = (): void => onStartGame();

  // Sample Screen One - Main Screen'
  const screenMainMenu = SCREENS.mainMenuLayout({
    onPlayButtonPress,
    spriteSheets,
  });
  SCREENS.controller.addScreenToList(SCREENS.ScreenName.MAIN, screenMainMenu);

  uiContainer.addChild(screenMainMenu.container);

  // Sample Screen Two - Second Screen
  const screenGame = SCREENS.gameLayout({});
  SCREENS.controller.addScreenToList(SCREENS.ScreenName.GAME, screenGame);

  uiContainer.addChild(screenGame.container);

  // Set main screen
  SCREENS.controller.setCurrentScreen({
    name: SCREENS.ScreenName.MAIN,
    isAnimated: true,
  });

  // Audio Option Cycle (just a toggle)
  const onAudioCycleOptions = (): void => {
    audioLayer.muteToggle();
  };

  // Keyboard Listener
  const onKeyDownMain = (event: KeyboardEvent): void => {
    // Using current event.code now that .keycode is deprecated
    switch (event.code) {
      case 'Backquote': // toggle audio
        onAudioCycleOptions();
        break;
      case 'Space': // Start
      case 'Enter': // Start
        screenMainMenu.showPressedButton();
        onStartGame();
        break;
    }
    //console.log(event.code);
  };

  const addOnKeyDown = (): void => {
    window.addEventListener('keydown', onKeyDownMain);
  };
  const removeOnKeyDown = (): void =>
    window.removeEventListener('keydown', onKeyDownMain);

  // Initially start listening for keyboard events
  addOnKeyDown();

  // Game Events

  const onGameOver = (): void => {
    console.log('core: onGameOver');

    SCREENS.controller.setCurrentScreen({
      name: SCREENS.ScreenName.MAIN,
      isAnimated: true,
      onComplete: () => {
        showPersonalBest();
        addOnKeyDown();
        // audioLayer.music.somber();
        // audioLayer.music.menuTheme(true);
        // audioLayer.music.playRandomTrack();
      },
    });
  };

  // Game Logic ----------------------------------------------
  const gameLogic = COMP.gameLogic({
    gameContainer: screenGame.container,
  });

  gameLogic.setRefs({
    spriteSheets,
    uiContainer,
    mainOnAudioCycleOptions: onAudioCycleOptions,
    mainOnGameOver: onGameOver,
  });

  // Start Game
  const onStartGame = (): void => {
    console.log('core: onStartGame');
    removeOnKeyDown();
    pixiSound.play('good', {
      volume: 1 * SFX_VOL_MULT,
    });

    bestScore.setVisibility(false);
    SCREENS.controller.setCurrentScreen({
      name: SCREENS.ScreenName.GAME,
      isAnimated: true,
      onComplete: () => {
        console.log('core: screen transition complete');
        // Defer starting the timer until the fade is complete
        gameLogic.onStartGame();
      },
    });
    audioLayer.music.mainTheme();
    //
    //
  };

  // ------------------------------------
  // Register component UPDATE routines
  // ------------------------------------
  // This is our main render loop running on RAF via PIXI
  // Some components will expose an update function which we wire up here if we want them to run on this main timeline

  pixiApp.ticker.add((delta) => {
    // Update All The Things

    // Animate the CRT filter
    crtFilter.seed = Math.random();
    crtFilter.time += 0.25;

    // Individual components -------------

    // Update game screen only when it is visible
    const currentScreen = SCREENS.controller.getCurrentScreen();
    if (currentScreen.name === SCREENS.ScreenName.GAME) {
      // Logic
      gameLogic.update(delta);
      // The Screen Itself
      currentScreen.ref.update(delta);
    }
  });

  /**
   * This project follows the revealing module pattern wherein a function
   * returns its revealed internals serving as a public interface.
   *
   *  We are further encapsulating concerns here by having only 2 top-level objects:
   *     1. pixiApp - direct access to PIXI's Application Module for lower level needs
   *     2. coreInterface - an object with additional callbacks typed as any (this could be hardned down the line)
   */
  return {
    pixiApp,
    coreInterface: {
      setSounds,
      setAdditionalSprites,
    },
  };
};

// ----- Preload Assets Here -----

/**
 * onAssetsLoaded
 * @description a callback triggered when preloader completes its work
 */
const onAssetsLoaded = (): void => {
  // Store preloaded spritesheets
  const spriteSheets = {
    main: PIXI.Loader.shared.resources['main'].spritesheet,
    //game: null, // <- game sprites are loaded and set onSecondaryAssetLoad
  };

  // This is the big boi that kicks off the whole DCollage App
  // We are storing the return on the window.APP object
  // for those few instances where we need direct access
  // to the PIXI.Application and any coreInterface functions
  window.APP = bootstrapApp({ spriteSheets });

  preloader.secondaryLoad(onSecondaryAssetsLoaded);
};

/**
 * @description a callback triggered when the secondary assets are loaded
 * These are set to load immediately following the sprites but as a separate
 * load so that they don't block the first render
 */
const onSecondaryAssetsLoaded = (): void => {
  const additionalSprites = {
    //game: PIXI.Loader.shared.resources['game'].spritesheet,
  };
  const sounds: Sounds = {
    MainTheme: PIXI.Loader.shared.resources['MainTheme'] as any,
  };
  window.APP.coreInterface.setSounds(sounds);
  window.APP.coreInterface.setAdditionalSprites(additionalSprites);
};

const preloader = COMP.LIB.preloader({});
preloader.init(onAssetsLoaded);
