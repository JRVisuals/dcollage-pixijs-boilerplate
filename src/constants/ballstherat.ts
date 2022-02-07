export enum ROOM_ITEM_TYPES {
  SIGN,
}
export const MAP_DATA = [
  // 0 ---------
  { exits: { n: -1, s: -1, e: 1, w: -1 } },
  // 1 ---------
  {
    exits: { n: -1, s: 2, e: -1, w: 999 },
    items: [
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 300, y: 300 },
        title: 'TO MOVE:',
        body: 'Press the  W, A, S, D\n keys on your keyboard.',
      },
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 90, y: 230 },
        title: 'LOCKED',
        body: 'Find the key that\nopens this door.',
      },
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 400, y: 500 },
        title: 'EXIT',
        body: 'This door is open,\nstep on through.',
      },
    ],
  },
  // 2 ---------
  {
    exits: { n: 1, s: -1, e: -1, w: 3 },
    items: [
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 300, y: 300 },
        title: 'CHEESE',
        body: 'Cheese is Life.\n Life is Time.\n Time is Cheese.',
      },
    ],
  },
  { exits: { n: -1, s: 4, e: 2, w: -1 } }, // 3
  { exits: { n: 3, s: 5, e: -1, w: -1 } }, // 4
  {
    exits: { n: 4, s: -1, e: 6, w: -1 },
    items: [
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 300, y: 300 },
        title: 'A MAZE ING',
        body: 'Feel like a rat in a maze?\n Me too.',
      },
    ],
  }, // 5
  {
    exits: { n: -1, s: 8, e: 7, w: 5 },
    items: [
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 300, y: 300 },
        title: 'KEY LIME',
        body: 'What would really be nice is if you could find a key. Or a pie.',
      },
    ],
  }, // 6
  {
    exits: { n: -1, s: -1, e: -1, w: 6 },
    items: [
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 300, y: 300 },
        title: 'DEAD END',
        body: 'These signs are kinda dumb.\nSo is this room.',
      },
    ],
  }, // 7
  { exits: { n: 6, s: 9, e: -1, w: -1 } }, // 8
  {
    exits: { n: 8, s: -1, e: -1, w: -1 },
    items: [
      {
        itemType: ROOM_ITEM_TYPES.SIGN,
        pos: { x: 300, y: 300 },
        title: 'DOOR KEY',
        body: "Future home of a key.\n Sorry, you're a stuck for now.",
      },
    ],
  }, // 9
];

/*
    
      N
   W< ^ >E
      S
    
      [ 0 ] <-> [ 1*]
                  |    
      [ 3 ] <-> [ 2 ]
        |      
      [ 4 ]
        |      
      [ 5 ] <-> [ 6 ] <-> [ 7 ]
                  |    
                [ 8 ]
                  |    
                [ 9 ]

  */
