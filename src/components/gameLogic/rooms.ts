import * as PIXI from 'pixi.js';

import gsap, { Power0 } from 'gsap';

import { MAP_DATA, ROOM_ITEM_TYPES } from '@src/constants';

// Temp Level Data
export type RoomItems = {
  itemType: ROOM_ITEM_TYPES;
  pos: { x: number; y: number };
  isActive: boolean;
  title?: string;
  body?: string;
  score?: number;
  time?: number;
  isAnimated?: boolean;
  assetPath?: string;
  spriteRef?: PIXI.Sprite;
}[];
export type MapRoomData = {
  exits: { n: number; s: number; e: number; w: number };
  items?: RoomItems;
};
export type MapData = MapRoomData[];
const mapData: MapData = MAP_DATA;
let anims;

export const initAnimations = (spriteSheets): void => {
  anims = spriteSheets;
};

export const roomTransition = (state, refs, dir): void => {
  refs.playerCharacter.container.alpha = 0;
  gsap.killTweensOf(refs.transitionSprite);

  let from;
  let to;
  switch (dir) {
    case 'ew':
      refs.transitionSprite.angle = 0;
      from = { x: 1200, y: 0 };
      to = { x: -300 };
      break;
    case 'we':
      refs.transitionSprite.angle = 0;
      from = { x: -1200, y: 0 };
      to = { x: -300 };
      break;
    case 'ns':
      refs.transitionSprite.angle = 90;
      from = { x: 600, y: -1200 };
      to = { y: -300 };
      break;
    case 'sn':
      refs.transitionSprite.angle = 90;
      from = { x: 600, y: 1200 };
      to = { y: -300 };
      break;
  }

  refs.transitionSprite.x = from.x;
  refs.transitionSprite.y = from.y;

  gsap.to(refs.transitionSprite, {
    duration: 0.1,
    pixi: to,
    ease: Power0.easeOut,
    onComplete: () => renderRoom(state, refs, dir),
  });
};

export const roomTransitionFinish = (
  dir,
  playerCharacter,
  transitionSprite
): void => {
  playerCharacter.container.alpha = 1;
  gsap.killTweensOf(transitionSprite);

  let to;
  switch (dir) {
    case 'ew':
      to = { x: -1200 };
      break;
    case 'we':
      to = { x: 1200 };
      break;
    case 'ns':
      to = { y: 1200 };
      break;
    case 'sn':
      to = { y: -1200 };
      break;
  }

  gsap.to(transitionSprite, {
    delay: 0.25,
    duration: 0.25,
    pixi: to,
    ease: Power0.easeIn,
  });
};

const wallType = (dir: string, num: number): string => {
  switch (num) {
    case -1:
      // Regular Wall
      return `./assets/miri-game/${dir}Wall0.png`;
      break;
    case 999:
      // Closed Door
      return `./assets/miri-game/${dir}Wall999.png`;
      break;
    default:
      // Open Doors
      return `./assets/miri-game/${dir}Wall1.png`;
      break;
  }
};

export const getItemsInRoom = (state): RoomItems => {
  const currentRoomData: MapRoomData = mapData[state.currentRoom];

  return currentRoomData.items;
};

export const pickUpItem = (room, index): void => {
  console.log('room pick up item', mapData[room].items[index]);

  mapData[room].items[index].isActive = false;
  gsap.to(mapData[room].items[index].spriteRef, {
    duration: 0.1,
    pixi: { alpha: 0 },
    ease: Power0.easeOut,
  });
};

export const renderRoom = (state, refs, dir): void => {
  console.log('<renderRoom>');
  // Cleanup last room
  refs.itemContainer.removeChildren();
  refs.bloodContainer.removeChildren();
  refs.cleanUpGold();
  refs.goldSpawnerRef.reset();
  refs.burpContainer.removeChildren();
  refs.roomContainer.removeChildren();

  const currentRoomData: MapRoomData = mapData[state.currentRoom];
  const exitN = currentRoomData.exits.n;
  const exitS = currentRoomData.exits.s;
  const exitE = currentRoomData.exits.e;
  const exitW = currentRoomData.exits.w;

  const bgTexture = PIXI.Texture.from('./assets/miri-game/dirtytileshaded.png');
  const bgSprite = new PIXI.Sprite(bgTexture);
  refs.roomContainer.addChildAt(bgSprite, 0);

  currentRoomData.items?.forEach((item) => {
    if (item.itemType === ROOM_ITEM_TYPES.SIGN) {
      const signTexture = PIXI.Texture.from('./assets/miri-game/readme.png');
      const signSprite = new PIXI.Sprite(signTexture);
      signSprite.x = item.pos.x;
      signSprite.y = item.pos.y;
      signSprite.scale.set(2.0);
      signSprite.anchor.set(0.5);
      refs.itemContainer.addChild(signSprite);
    }
    if (item.itemType === ROOM_ITEM_TYPES.COLLECTABLE) {
      if (item.isActive) {
        let itemSprite;
        if (item.isAnimated) {
          itemSprite = new PIXI.AnimatedSprite(anims[item.assetPath]);
          itemSprite.animationSpeed = 0.2;
          itemSprite.play();
        } else {
          const itemTexture = PIXI.Texture.from(item.assetPath);
          itemSprite = new PIXI.Sprite(itemTexture);
        }
        itemSprite.x = item.pos.x;
        itemSprite.y = item.pos.y;
        itemSprite.scale.set(2.0);
        itemSprite.anchor.set(0.5);
        const spriteRef = refs.itemContainer.addChild(itemSprite);
        item.spriteRef = spriteRef;
      }
    }
  });

  const nWallTexture = PIXI.Texture.from(wallType('n', exitN));
  const nWall = new PIXI.Sprite(nWallTexture);
  refs.roomContainer.addChild(nWall);

  const sWallTexture = PIXI.Texture.from(wallType('s', exitS));
  const sWall = new PIXI.Sprite(sWallTexture);
  refs.roomContainer.addChild(sWall);

  const eWallTexture = PIXI.Texture.from(wallType('e', exitE));
  const eWall = new PIXI.Sprite(eWallTexture);
  refs.roomContainer.addChild(eWall);

  const wWallTexture = PIXI.Texture.from(wallType('w', exitW));
  const wWall = new PIXI.Sprite(wWallTexture);
  refs.roomContainer.addChild(wWall);

  roomTransitionFinish(dir, refs.playerCharacter, refs.transitionSprite);
};

export const checkExit = (state, refs): void => {
  const pX = refs.playerCharacter.container.x;
  const pY = refs.playerCharacter.container.y;

  const currentRoomData: MapRoomData = mapData[state.currentRoom];
  const exitN = currentRoomData.exits.n;
  const exitS = currentRoomData.exits.s;
  const exitE = currentRoomData.exits.e;
  const exitW = currentRoomData.exits.w;

  // Exit North
  if (pY < 50 && pX > 250 && pX < 350 && exitN > -1) {
    if (exitN === 999) return;
    state.currentRoom = exitN;
    roomTransition(state, refs, 'sn');
    refs.playerCharacter.container.y = 550;
    return;
  }

  // Exit South
  if (pY > 550 && pX > 250 && pX < 350 && exitS > -1) {
    if (exitS === 999) return;
    state.currentRoom = exitS;
    roomTransition(state, refs, 'ns');
    refs.playerCharacter.container.y = 50;
    return;
  }

  // Exit East

  if (pX > 550 && pY > 250 && pY < 350 && exitE > -1) {
    if (exitE === 999) return;
    state.currentRoom = exitE;
    roomTransition(state, refs, 'we');
    refs.playerCharacter.container.x = 50;
    return;
  }

  // Exit West

  if (pX < 50 && pY > 250 && pY < 350 && exitW > -1) {
    if (exitW === 999) return;
    state.currentRoom = exitW;
    roomTransition(state, refs, 'ew');
    refs.playerCharacter.container.x = 550;
    return;
  }
};
