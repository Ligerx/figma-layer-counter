import { countLayerTypesForNodes } from "./layerCounter";

// figma.notify("Layer Counter is working");

// const nodes = figma.currentPage.selection;

// const num = nodes.length;
// const

// figma.closePlugin();

// Send counts on init. This occurs before any selectionchange or currentpagechange events fire.
// postCountsMessage(figma.currentPage.selection);

figma.on("selectionchange", () => {
  // postCountsMessage(figma.currentPage.selection);
  const typeCounts = countLayerTypesForNodes([...figma.currentPage.selection]);
  figma.notify(JSON.stringify(typeCounts));
});

figma.on("currentpagechange", () => {
  // postCountsMessage(figma.currentPage.selection);
});
