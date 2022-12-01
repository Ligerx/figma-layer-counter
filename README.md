![Layer Counter Cover](./CoverArt.png)

# Layer Counter

Figma and FigJam Plugin

Count selected layers, layer types, and nested layers.

The counts automatically update every time you select any layers.

You can also count a component or instance's variants, even if they're not in the same file. _Note that this will only include a variant's layers once, even if you select multiple things from the same variant set._

## Build Instructions

- Run `yarn` to install dependencies.
- Run `yarn build:watch` to start webpack in watch mode.
- Open `Figma` -> `Plugins` -> `Development` -> `New Plugin...` and choose `manifest.json` file from this repo.
