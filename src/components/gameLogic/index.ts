import * as PIXI from 'pixi.js';
import { BloomFilter } from '@pixi/filter-bloom';
import { CRTFilter } from '@pixi/filter-crt';
import * as PIXISOUND from 'pixi-sound';
import gsap, { Power0, Bounce } from 'gsap';
import {
  APP_WIDTH,
  APP_HEIGHT,
  SFX_VOL_MULT,
  POINTS_GOLD,
  START_LEVEL,
  PLAYER_CONTINOUS_MOVEMENT,
  IS_SCORE_INCREMENTY,
  MUSIC_VOL_MULT,
  MAP_DATA,
  SPRITE_MARGIN,
  ROOM_ITEM_TYPES,
  TEXT_STYLE,
} from '@src/constants';
import * as COMP from '..';
import { PlayerCharacter } from '../playerCharacter';
import { RunTime } from '../library/runtime';
import { Spritesheets } from '@src/core';
import { scoreDisplay, ScoreDisplay } from '../library/scoreDisplay';
import { goldSpawner } from './goldSpawner';
import { burpDrop } from '../burpDrop';
import * as Rooms from './rooms';

type Refs = {
  scoreDisplay?: ScoreDisplay;
  spriteSheets?: Spritesheets;
  playerCharacter?: PlayerCharacter;
  uiContainer?: PIXI.Container;
  mainOnAudioCycleOptions?: () => void;
  mainOnGameOver?: () => void;
  audioLayer?: any;
};

export interface GameLogic {
  update: (delta: number) => boolean;
  reset: () => void;
  //
  setRefs: (refs: Refs) => void;
  //
  getPlayerScore: () => number;
  getCurrentLevel: () => number;
  getIsGameOver: () => boolean;
  //
  onStartGame: () => void;
  onGameOver: () => void;
}

interface Props {
  gameContainer: PIXI.Container;
  gameContainerTop: PIXI.Container;
  pos?: { x: number; y: number };
}

/**
 * Game Logic as a component style module
 *
 * @param props - Component properties to be set on instantiation
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const gameLogic = (props: Props): GameLogic => {
  let state = {
    keysDown: {},
    currentLevel: 0,
    isGameOver: true,
    isGamePaused: false,
    playerScore: 0,
    currentRoom: 1,
  };
  const initialState = { ...state };

  // Specific textures can be pulled out once the spritesheet ref is set
  // let targetTextures = { open: null, lock: null };

  // Passed in references set by setRefs function
  // The game logic component maintains references and serves as the hub for communication between all other game components
  // This is something that could likely be better served by a simple event bus but for now we live in callback hell
  let scoreDisplay: ScoreDisplay = null;
  let spriteSheetsRef: Spritesheets = null;
  let uiContainerRef: PIXI.Container;
  let audioLayerRef: any;
  let runtime: RunTime = null;
  let mainOnGameOver: () => void = null;
  let mainOnAudioCycleOptions: () => void = null;

  const { gameContainer, gameContainerTop } = props;

  const roomContainer = gameContainer.addChild(new PIXI.Container());

  // Level Message Text
  const messageText = new PIXI.BitmapText('LEVEL UP!', {
    fontName: 'Atari-32',
    fontSize: 32,
    align: 'center',
  });
  messageText.position.x = APP_WIDTH / 2;
  messageText.position.y = 120;
  messageText.anchor.set(0.5, 0);
  messageText.alpha = 0;

  gameContainerTop.addChild(messageText);

  // Sound bits
  const pixiSound = PIXISOUND.default;

  // Reset called by play again and also on init
  const reset = (): void => {
    state = { ...initialState, keysDown: {} };
  };

  // References of components created in core are set here
  const setRefs = (refs: Refs): void => {
    if (refs.spriteSheets) spriteSheetsRef = refs.spriteSheets;

    if (refs.mainOnGameOver) mainOnGameOver = refs.mainOnGameOver;
    if (refs.mainOnAudioCycleOptions)
      mainOnAudioCycleOptions = refs.mainOnAudioCycleOptions;
    if (refs.audioLayer) audioLayerRef = refs.audioLayer;

    if (refs.uiContainer) {
      uiContainerRef = refs.uiContainer;
      // Run Time is a simple clock that runs up
      runtime = COMP.LIB.runtime({
        pos: { x: 25, y: 25 },
        timeOverCallback: () => {
          onTimeOver();
        },
      });
      uiContainerRef.addChild(runtime.container);

      // Score Display
      scoreDisplay = COMP.LIB.scoreDisplay({
        pos: { x: APP_WIDTH - 100, y: 25 },
      });
      uiContainerRef.addChild(scoreDisplay.container);
    }

    // Player Animations now that we have spritesheet ref
    playerCharacter.initAnimations(spriteSheetsRef.main.animations); // <-- example anims are pulled from `.main` but will usually be in `.game`
    goldSpawnerRef.initAnimations(spriteSheetsRef.main.animations);
  };

  const getIsGameOver = (): boolean => {
    return state.isGameOver;
  };
  const getPlayerScore = (): number => {
    state.playerScore = scoreDisplay.getScore();
    return state.playerScore;
  };

  const getCurrentLevel = (): number => state.currentLevel;

  const toggleGamePaused = (forceTo?: boolean): boolean => {
    state.isGamePaused = forceTo != undefined ? forceTo : !state.isGamePaused;

    if (state.isGamePaused) {
      messageText.text = '* GAME PAUSED *';
      messageText.alpha = 1;

      // force a render before we stop the whole app
      window.APP.pixiApp.render();
      window.APP.pixiApp.stop();
    } else {
      window.APP.pixiApp.start();
      gsap.to(messageText, {
        duration: 0.1,
        alpha: 0,
        ease: Power0.easeOut,
      });
    }

    return state.isGamePaused;
  };

  const onStartGame = (): void => {
    console.log('gameLogic: onStartGame');
    //
    state.isGameOver = false;
    state.currentLevel = START_LEVEL;
    state.playerScore = 0;
    //
    scoreDisplay.reset();
    runtime.reset();
    runtime.start();
    playerCharacter.reset();
    //
    state.currentLevel = 0;
    state.currentRoom = 1;
    Rooms.roomTransition(
      state,
      {
        itemContainer,
        transitionSprite,
        playerCharacter,
        bloodContainer,
        goldSpawnerRef,
        burpContainer,
        roomContainer,
        cleanUpGold,
      },
      'ew'
    );

    // Start listening for keyboard events
    addOnKeyUp();
    addOnKeyDown();
  };

  const onTimeOver = (): void => {
    onGameOver();
  };

  const onGameOver = (): void => {
    console.log('gameLogic: onGameOver');
    state.isGameOver = true; // should stop updates

    // Immediately stop timer if a timed game
    // runtimeRef.pause();

    // Keyboard Events
    // remove game specific key listeners if there are any
    state.keysDown = [];
    removeOnKeyUp();
    removeOnKeyDown();

    // Clean Up Component Logic and Sprites
    goldSpawnerRef.reset();
    cleanUpGold();

    // Clean Up Game Logic Remaining
    //...anything within game logic component...
    audioLayerRef.music.menuTheme(true);
    pixiSound.play('lose', { volume: 1.0 * MUSIC_VOL_MULT });
    playerCharacter.wither(mainOnGameOver);
  };

  // Keyboard Listener
  const onKeyUpGame = (event: KeyboardEvent): void => {
    // Store the fact that this key is up
    state.keysDown[event.code] = 0;
  };
  const onKeyDownGame = (event: KeyboardEvent): void => {
    // Store the fact that this key is down
    state.keysDown[event.code] = 1;
  };

  const checkDownKeys = (keysDown): void => {
    // If nothing is held, stop and bail
    //  console.log('checkDownKeys', Object.values(keysDown));
    if (
      Object.values(keysDown).indexOf(1) === -1 &&
      !PLAYER_CONTINOUS_MOVEMENT
    ) {
      playerCharacter.moveStop();
      return;
    }
    // Single cardinal directions

    keysDown['KeyW'] && playerCharacter.moveUp();
    keysDown['KeyS'] && playerCharacter.moveDown();
    keysDown['KeyA'] && playerCharacter.moveLeft();
    keysDown['KeyD'] && playerCharacter.moveRight();

    if (
      !keysDown['KeyW'] &&
      keysDown['KeyS'] &&
      keysDown['KeyA'] &&
      keysDown['KeyD']
    )
      playerCharacter.moveStop();
  };

  const addOnKeyUp = (): void => {
    window.addEventListener('keyup', onKeyUpGame);
  };
  const removeOnKeyUp = (): void =>
    window.removeEventListener('keyup', onKeyUpGame);

  const addOnKeyDown = (): void => {
    window.addEventListener('keydown', onKeyDownGame);
  };
  const removeOnKeyDown = (): void =>
    window.removeEventListener('keydown', onKeyDownGame);

  // Blood trail
  const bloodContainer = new PIXI.Container();
  gameContainerTop.addChild(bloodContainer);

  // Item Container (keeps items in rooms above the blood)
  const itemContainer = new PIXI.Container();
  gameContainerTop.addChild(itemContainer);

  // Gold Spawner
  const goldSpawnerRef = goldSpawner();
  const goldContainer = new PIXI.Container();
  gameContainerTop.addChild(goldContainer);

  // Simple Player Component

  const playerCharacter = COMP.playerCharacter({
    pos: { x: APP_WIDTH / 2, y: APP_HEIGHT / 2 },
    bloodContainer,
  });
  gameContainerTop.addChild(playerCharacter.container);

  //gameContainer.filters = [new BloomFilter(4)];

  // Burp trail
  const burpContainer = new PIXI.Container();
  gameContainerTop.addChild(burpContainer);

  // Top most should be the transition layer
  // Transition
  const transitionContainer = new PIXI.Container();
  gameContainerTop.addChild(transitionContainer);
  const trTexture = PIXI.Texture.from('./assets/miri-game/transition.png');
  const transitionSprite = new PIXI.Sprite(trTexture);
  transitionContainer.addChild(transitionSprite);
  transitionSprite.x = 1200;

  const updateGold = (): void => {
    const maybeGold = goldSpawnerRef.spawn();
    maybeGold && goldContainer.addChild(maybeGold.container);
  };
  const cleanUpGold = (): void => {
    goldContainer.removeChildren();
  };

  // Signage
  const signContainer = new PIXI.Container();
  signContainer.alpha = 0;
  gameContainerTop.addChild(signContainer);
  const signBackTexture = PIXI.Texture.from(
    './assets/miri-game/textWindow-small.png'
  );
  const signBackSprite = new PIXI.Sprite(signBackTexture);
  signContainer.addChild(signBackSprite);
  signBackSprite.x = 300;
  signBackSprite.y = 300;
  signBackSprite.anchor.set(0.5);
  const signTextTitle = new PIXI.Text('', TEXT_STYLE.SIGN_TITLE);
  signTextTitle.x = 300;
  signTextTitle.y = 260;
  signTextTitle.anchor.set(0.5);
  signContainer.addChild(signTextTitle);
  const signTextBody = new PIXI.Text('', TEXT_STYLE.SIGN_BODY);
  signTextBody.x = 300;
  signTextBody.y = 315;
  signTextBody.anchor.set(0.5);
  signContainer.addChild(signTextBody);

  const displaySign = (signProp): void => {
    const signAlpha = signProp.collided ? 0.9 : 0;

    if (signProp.collided) {
      signTextTitle.text = `${signProp.title}`;
      signTextBody.text = `${signProp.body}`;
    }

    signContainer.alpha = signAlpha;

    // gsap.to(signContainer, {
    //   duration: 0.1,
    //   alpha: signAlpha,
    //   ease: Power0.easeOut,
    // });
  };

  // Collision Detection -------------------------------
  const simpleCollision = (nX, nY, hitBox): boolean => {
    const pX = playerCharacter.container.x;
    const pY = playerCharacter.container.y;
    // check collision by x/y locations with a hitbox buffer

    return (
      pX > nX - hitBox.x &&
      pX < nX + hitBox.x &&
      pY > nY - hitBox.y &&
      pY < nY + hitBox.y
    );
  };

  const checkCollision = (): void => {
    if (state.isGameOver) return;

    const gold = goldSpawnerRef.getNuggets();

    // Room Items
    const roomItems: Rooms.RoomItems = Rooms.getItemsInRoom(state);

    displaySign({ collided: false });

    roomItems?.forEach((item) => {
      if (item.itemType === ROOM_ITEM_TYPES.SIGN) {
        const collided = simpleCollision(item.pos.x, item.pos.y, {
          x: 50,
          y: 30,
        });

        collided &&
          displaySign({ collided, title: item.title, body: item.body });
      }
    });

    // Collectable Collision
    gold.map((n, i) => {
      const nX = n.container.x;
      const nY = n.container.y;

      const hitBox = SPRITE_MARGIN * playerCharacter.getSize();
      const collided = simpleCollision(nX, nY, {
        x: hitBox,
        y: hitBox,
      });

      //  collided && playerCharacter.grow();

      if (collided) {
        goldSpawnerRef.removeNuggetByIndex(i);
        goldContainer.removeChildAt(i);
        scoreDisplay.addToScore(POINTS_GOLD);
        const rsnd = `chom${Math.round(Math.random() * 2)}`;
        pixiSound.play(rsnd, {
          volume: 1 * SFX_VOL_MULT,
        });

        if (Math.random() > 0.75) {
          setTimeout(() => {
            pixiSound.play('burp', { volume: 0.5 * SFX_VOL_MULT });
            burpContainer.addChild(
              burpDrop({
                pos: {
                  x: playerCharacter.container.x,
                  y: playerCharacter.container.y - 20,
                },
              }).container
            );
          }, 750);
        }

        runtime.setLimit(runtime.getLimit() + 1);
      }
    });

    // Check Exits
    Rooms.checkExit(state, {
      itemContainer,
      transitionSprite,
      playerCharacter,
      bloodContainer,
      goldSpawnerRef,
      burpContainer,
      roomContainer,
      cleanUpGold,
    });
  };

  const update = (delta): boolean => {
    let updateRan = false;

    if (state.isGameOver) return;
    if (state.isGamePaused) return;

    // Update individual controller refs here
    runtime.update(delta);
    checkDownKeys(state.keysDown);
    updateGold();
    playerCharacter.update(delta, state.keysDown);
    checkCollision();
    IS_SCORE_INCREMENTY && scoreDisplay.update(delta);
    updateRan = true;

    return updateRan;
  };

  return {
    update,
    reset,
    setRefs,
    //
    getPlayerScore,
    getCurrentLevel,
    getIsGameOver,
    //
    onStartGame,
    onGameOver,
  };
};
