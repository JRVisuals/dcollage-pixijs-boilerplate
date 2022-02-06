import { _THEMES } from './themes';

// Theming
// Note Colors are handled in theme.ts
export const THEME = _THEMES.SOLARIZED;

// @ts-ignore
// Ignoring this to suppress an error with __VERSION__ which will be rewritten with the version number on build.
export const APP_VERSION = __VERSION__; // <- populated by rollup replace
// @ts-ignore
export const DCO_VERSION = __DCOVERSION__; // <- populated by rollup replace
export const APP_NAME = 'dcollage-boilerplate';
export const APP_HEIGHT = 600;
export const APP_WIDTH = 600;
export const APP_BGCOLOR = THEME.BG_HEX;

// Layer Depths
// MC = mainContainer
export const Z_MC_UI = 1;
export const Z_MC_BASE = 0;

// Audio
export const MUSIC_VOL_MULT = 0.5;
export const SFX_VOL_MULT = 0.5;

// Loader
// Assets
export const PRELOAD_ARRAY = [
  { name: 'main', url: './assets/example/sprites.json' },
  { name: 'ui', url: './assets/example/sprites-ui.json' },

  { name: 'Atari-16', url: './assets/font/Atari-16.fnt' },
  { name: 'Atari-32', url: './assets/font/Atari-32.fnt' },
  { name: 'FFFCorp-16', url: './assets/font/FFFCorp-16.fnt' },
  { name: 'FFFCorp-16-bold', url: './assets/font/FFFCorp-16-bold.fnt' },
  { name: 'FFFFuego-16', url: './assets/font/FFFFuego-16.fnt' },
  { name: 'FFFFuego-16-bold', url: './assets/font/FFFFuego-16-bold.fnt' },
];
