import { _THEMES } from './themes';

// Theming
// Note Colors are handled in theme.ts
export const THEME = _THEMES.BALLSTHERAT;

// Ignoring this to suppress an error with __VERSION__ which will be rewritten with the version number on build.
// @ts-ignore
export const APP_VERSION = __VERSION__; // <- populated by rollup replace
// @ts-ignore
export const DCO_VERSION = __DCOVERSION__; // <- populated by rollup replace
export const APP_NAME = 'miri-game-balls';
export const APP_HEIGHT = 600;
export const APP_WIDTH = 600;
export const APP_BGCOLOR = THEME.BG_HEX;

// Layer Depths
// MC = mainContainer
export const Z_MC_UI = 1;
export const Z_MC_BASE = 0;

// Audio
export const MUSIC_VOL_MULT = 0.0;
export const SFX_VOL_MULT = 1.0;
