import {
  APP_HEIGHT,
  APP_WIDTH,
  GOLD_MAX_SPAWNS,
  GOLD_SPAWN_RATE,
} from '@src/constants';
import * as PIXI from 'pixi.js';
import { GoldNugget, goldNugget } from '../goldNugget';

export interface GoldSpawner {
  initAnimations: (anims?: { [key: string]: Array<PIXI.Texture> }) => void;
  spawn: () => GoldNugget | null;
  getNuggets: () => GoldNugget[];
  removeNuggetByIndex: (index: number) => void;
  reset: () => void;
}

export const goldSpawner = (): GoldSpawner => {
  let state = {
    lastSpawnTime: Date.now(),
    nuggetList: [],
  };
  const initialState = { ...state };
  let animsRef;
  const texture = PIXI.Texture.from('./assets/miri-game/cheese.png');

  const nuggetBuffer = 50;

  const spawn = (): GoldNugget | null => {
    if (state.lastSpawnTime + GOLD_SPAWN_RATE > Date.now()) return;

    state.lastSpawnTime = Date.now();
    if (state.nuggetList.length > GOLD_MAX_SPAWNS - 1) return;

    const rX =
      nuggetBuffer / 2 + Math.floor(Math.random() * (APP_WIDTH - nuggetBuffer));
    const rY =
      nuggetBuffer / 2 +
      Math.floor(Math.random() * (APP_HEIGHT - nuggetBuffer));

    const nugget = goldNugget({
      pos: { x: rX, y: rY },
      textures: { nuggetTexture: texture },
      anims: animsRef,
    });

    state.nuggetList.push(nugget);

    return nugget;
  };

  const initAnimations = (anims): void => {
    console.log('spanwer initAnimations', anims);
    animsRef = anims;
  };

  const getNuggets = (): GoldNugget[] => state.nuggetList;

  const removeNuggetByIndex = (index: number): void => {
    state.nuggetList.splice(index, 1);
  };

  // Reset called by play again and also on init
  const reset = (): void => {
    console.log('gold spawner reset');

    state = { ...initialState, nuggetList: [] };
  };
  //reset();

  return {
    initAnimations,
    spawn,
    getNuggets,
    removeNuggetByIndex,
    reset,
  };
};
