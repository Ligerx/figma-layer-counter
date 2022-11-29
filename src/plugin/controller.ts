import {
  countTypesForNodes,
  countTypesForNodesAndChildren
} from "../layerCounter";

// =============================================
// Initialize shouldCountChildren and first load
// =============================================
let shouldCountChildren = false;

figma.clientStorage
  .getAsync("shouldCountChildren")
  .then(storedShouldCountChildren => {
    shouldCountChildren = storedShouldCountChildren ?? false;

    // Send initial value for shouldCounttChildren and counts after fetching shouldCountChildren.
    // This should occur before any selectionchange or currentpagechange events fire.
    postShouldCountChildrenMessage(shouldCountChildren);
    postCountsMessage(figma.currentPage.selection, shouldCountChildren);
  });

// =============================================
// Show the UI
// =============================================
figma.showUI(__html__, { width: 230, height: 322 });

// =============================================
// Set up event and message listeners
// =============================================
figma.on("selectionchange", () => {
  postCountsMessage(figma.currentPage.selection, shouldCountChildren);
});

figma.on("currentpagechange", () => {
  postCountsMessage(figma.currentPage.selection, shouldCountChildren);
});

figma.ui.onmessage = ({ type, message }) => {
  if (type === "toggleCountChildren") {
    figma.clientStorage.setAsync("shouldCountChildren", message);
    shouldCountChildren = message;
    postCountsMessage(figma.currentPage.selection, shouldCountChildren);
  }
};

/**
 * Post message to UI with the most up to date layer and layer type counts.
 */
function postCountsMessage(
  nodes: readonly SceneNode[],
  shouldCountChildren: boolean
) {
  // Figma returns `readonly SceneNode[]` from figma.currentPage.selection,
  // so we manually copy the array to create a mutable version of it.
  let counts;

  if (shouldCountChildren) {
    counts = countTypesForNodesAndChildren([...nodes]);
  } else {
    counts = countTypesForNodes([...nodes]);
  }

  figma.ui.postMessage({ type: "updateCounts", message: counts });
}

/**
 * Post message to UI with the shouldCountChildren setting.
 * UI is handling it's own eager state update, so this only needs to be called once on initialization.
 */
function postShouldCountChildrenMessage(initValue: boolean) {
  figma.ui.postMessage({ type: "shouldCountChildren", message: initValue });
}
