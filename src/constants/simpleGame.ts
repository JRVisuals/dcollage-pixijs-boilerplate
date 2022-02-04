// Assets
export const PRELOAD_ARRAY = [
  // { name: 'main', url: './assets/example/sprites.json' },
  // { name: 'ui', url: './assets/example/sprites-ui.json' },
  { name: 'main', url: './assets/miri-game/sprites.json' },
  { name: 'Atari-16', url: './assets/font/Atari-16.fnt' },
  { name: 'Atari-32', url: './assets/font/Atari-32.fnt' },
  { name: 'FFFCorp-16', url: './assets/font/FFFCorp-16.fnt' },
  { name: 'FFFCorp-16-bold', url: './assets/font/FFFCorp-16-bold.fnt' },
  { name: 'FFFFuego-16', url: './assets/font/FFFFuego-16.fnt' },
  { name: 'FFFFuego-16-bold', url: './assets/font/FFFFuego-16-bold.fnt' },
];

// Environment
export const TIME_LIMIT_SECONDS = 15;

// Difficulty
export const START_LEVEL = 1;

// Objects
export enum OBJECT_STATUS {
  ACTIVE,
  INACTIVE,
}

// Environment
export const IS_SCORE_INCREMENTY = true;

// Player
export const PLAYER_SPEED = 5;
export const PLAYER_CONTINOUS_MOVEMENT = false;

// Gold
export const POINTS_GOLD = 100;
export const GOLD_SPAWN_RATE = 2000;
export const GOLD_MAX_SPAWNS = 1000;
