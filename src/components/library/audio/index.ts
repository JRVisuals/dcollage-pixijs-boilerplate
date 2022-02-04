import * as PIXISOUND from 'pixi-sound';
import gsap, { Power0 } from 'gsap';
import { APP_NAME, MUSIC_VOL_MULT } from '@src/constants';
import {
  fetchFromLocalStorage,
  sendToLocalStorage,
} from '@src/util/localStorage';
import { getAppVerShort } from '@src/util/appVer';

export interface Sounds {
  MainTheme: PIXI.LoaderResource;
  GameTheme: PIXI.LoaderResource;
}
export interface AudioLayer {
  music: {
    gameTheme: (isPlay: boolean) => void;
    menuTheme: (isPlay: boolean) => void;
    playRandomTrack: () => void;
    playTracklist: () => void;
  };
  muteToggle: (shouldMute?: boolean, isTemporary?: boolean) => void;
  getMutedState: () => boolean;
}

/**
 * Audio component which maps preloaded audio resources to the
 * default PIXISOUND class and returns functions which handle
 * various aspects of the audio for the game.
 *
 * @param sounds - an object containing a number of loader resources
 *
 * @returns Interface object containing methods that can be called on this module
 */
export const audio = (sounds: Sounds): AudioLayer => {
  // Main Music Track
  const audio = PIXISOUND.default;
  audio.add('MainTheme', sounds.MainTheme as any);
  audio.add('GameTheme', sounds.GameTheme as any);

  const trackList = [
    'ç',
    //'Track2',
  ];
  let currentTrack = 0;

  // Fetch and use isMuted state stored in local storage
  const storedMutedState = fetchFromLocalStorage(
    `isMuted_${APP_NAME}_v${getAppVerShort()}`
  );
  let isMuted = storedMutedState === 'true' ? true : false;
  // Initial state
  if (isMuted) {
    audio.muteAll();
  } else {
    audio.unmuteAll();
  }

  const getMutedState = (): boolean => isMuted;

  // Utility Functions
  const fadeSound = ({ sound, time, callback, vol }): void => {
    //console.log('fade sound', sound);
    gsap.to(sound, {
      duration: time,
      volume: vol,
      ease: Power0.easeOut,
      onComplete: () => {
        callback && callback();
      },
    });
  };

  const mainVolume = (): number => 1.0 * MUSIC_VOL_MULT;
  const menuVolume = (): number => 0.5 * MUSIC_VOL_MULT;

  // Called when we've got all the things...
  const stopAllThemes = (): void => {
    audio.stop('MainTheme');
    audio.stop('GameTheme');
    // audio.stop('Track2');
  };
  const mainTheme = (isPlay): void => {
    stopAllThemes();
    if (isPlay) audio.play('GameTheme', { loop: true, volume: mainVolume() });
  };
  const gameTheme = (isPlay): void => {
    stopAllThemes();
    if (isPlay) audio.play('GameTheme', { loop: true, volume: mainVolume() });
  };
  const menuTheme = (isPlay): void => {
    stopAllThemes();
    if (isPlay) audio.play('MainTheme', { loop: true, volume: menuVolume() });
  };

  const playNextTrack = (): void => {
    currentTrack++;
    if (currentTrack > trackList.length - 1) currentTrack = 0;
    audio.play(trackList[currentTrack], {
      loop: false,
      volume: mainVolume(),
      complete: () => {
        playNextTrack();
      },
    });
  };
  const playTracklist = (): void => {
    stopAllThemes();
    currentTrack = -1;
    playNextTrack();
  };

  const playRandomTrack = (): void => {
    currentTrack = Math.floor(Math.random() * trackList.length) - 1;
    stopAllThemes();
    playNextTrack();
  };

  const muteToggle = (shouldMute?: boolean, isTemporary = false): void => {
    if (shouldMute === undefined) {
      isMuted = !isMuted;
    } else {
      isMuted = shouldMute;
    }

    if (isMuted) {
      audio.muteAll();
    } else {
      audio.unmuteAll();
    }

    // Store muted state as long as it isn't a temporary change
    !isTemporary &&
      sendToLocalStorage(
        `isMuted_${APP_NAME}_v${getAppVerShort()}`,
        String(isMuted)
      );
  };

  return {
    music: { gameTheme, menuTheme, playTracklist, playRandomTrack },
    muteToggle,
    getMutedState,
  };
};
