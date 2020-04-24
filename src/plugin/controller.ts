import {
  countLayersAndTypesForNodes,
  countLayersAndTypesForNodesAndChildren
} from "./layerCounter";

// figma.notify("Layer Counter is working");

// const nodes = figma.currentPage.selection;

// const num = nodes.length;
// const

// figma.closePlugin();

// Send counts on init. This occurs before any selectionchange or currentpagechange events fire.
// postCountsMessage(figma.currentPage.selection);

figma.on("selectionchange", () => {
  // postCountsMessage(figma.currentPage.selection);
  const typeCounts = countLayersAndTypesForNodes([
    ...figma.currentPage.selection
  ]);
  const typeCounts2 = countLayersAndTypesForNodesAndChildren([
    ...figma.currentPage.selection
  ]);

  console.log(JSON.stringify(typeCounts));
  console.log(JSON.stringify(typeCounts2));
  figma.notify(JSON.stringify(typeCounts));
});

figma.on("currentpagechange", () => {
  // postCountsMessage(figma.currentPage.selection);
});
