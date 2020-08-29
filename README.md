### Bootstrapped with DCollage (Digital Collage Boilerplate w/ PIXIJS)

![dC logo](http://content.jrvhost.com/github/dc-logo.png)

DCollage is a lightly opinionated PIXIJS based digital collage boilerplate with game dev aspirations and a component driven paradigm written in TypeScript.
The goal of DCollage is to facilitate the creation of multi-layered, interactive, collages similar to those I created back in the days of Flash. Surprise it works for simple games too!

[See the repo WIKI for additional information.](https://github.com/jrod-disco/dcollage-pixijs-boilerplate/wiki)

# Your Project Title

Your project description may appear here.

# Getting Started

DCollage is meant to get you up and running with a PIXI app in minutes. While there are a lot of nuances that can be tweaked and you are not forced to follow the patterns this boilerplate includes it should be a matter of clone, install, run.

## Clone or Template

- Clone or spin up a new repo using the github template `https://github.com/jrod-disco/dcollage-pixijs-boilerplate.git`

## Install and Run

- Run `yarn install` at the project root to install all of the `node_modules`
- Run `yarn start` to begin developing locally `http://localhost:10001/`

## Have Fun!

- Set the `APP_HEIGHT` and `APP_WIDTH` in `constants/index.ts`
- Edit `main.ts` to add or remove components from the main container
- There is a `components/library` included to help you get started (please contribute yours back to the repo and namespace their directory E.g. `components/library/yourGithubUsername`)
- Put your assets in `./src/assets` and add anything you want to preload to the `preloader` at the bottom of `main.ts`
- Use any of the `components/library` components, or make your own

# Build Scripts

- `yarn start` to go into development mode with live reload
- `yarn clean` to clean the `/dist` directory
- `yarn build` to create a distributable bundle in `/dist`
- `yarn docs` to generate markdown documentation in `/docs`

# Dev Tools for PIXI

- [Pixi.js devtools Chrome Extension](https://chrome.google.com/webstore/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon?hl=en) shows up in your Chrome Dev Tools Panel and can be super helpful - this is why we will usually name our containers w/ `container.name='foo'`

## Concept and Mechanics

TBD

## Roadmap

- [ ] Bootstrap DCollage Boilerplate for PIXI.JS

  - [ ] clone this repo or spin up a repo via github template
  - [ ] yarn install
  - [ ] yarn start

- [ ] Learn how to use it

  - [ ] Peep the [wiki](https://github.com/jrod-disco/dcollage-pixijs-boilerplate/wiki)
  - [ ] Especially the [Patterns and Cookbook page](https://github.com/jrod-disco/dcollage-pixijs-boilerplate/wiki/Patterns-and-Cookbook)
  - [ ] Cruise through the example code

- [ ] Make cool stuff
  - [ ] Have fun doing it

### Completed!

- [ ] Discover DCollage Boilerplate for PIXI.JS

  - [ ] Read the readme

## Libraries Used

- DCollage Boilerplate [https://github.com/jrod-disco/dcollage-pixijs-boilerplate](https://github.com/jrod-disco/dcollage-pixijs-boilerplate)
- PIXIJS - WebGL renderer with Canvas fallback and so much more [https://github.com/pixijs/pixi.js](https://github.com/pixijs/pixi.js)
- GSAP - tween animation library [https://greensock.com/docs/v2/Plugins/PixiPlugin](https://greensock.com/docs/v2/Plugins/PixiPlugin)
- pixi-filters - Collection of community-authored custom display filters for PixiJS [https://github.com/pixijs/pixi-filters](https://github.com/pixijs/pixi-filters) Currently yarn linked to a local version of the repo in order to use the as of yet un-merged changes to the godray filter which add alpha functionality.

## Tools Used

- Visual Studio Code
- Sublime Text
- Aesprite
- Audacity
- Reason

# The Stack

- Pixi.JS
- TypeScript
- Prettier
- Rollup
- TSDoc / TypeDoc
