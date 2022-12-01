import { countTypesForNodes, CountSettings } from "../layerCounter";

// =============================================
// Initialize state and first load
// =============================================
let shouldCountChildren = true;
let shouldIncludeVariants = false;

Promise.all([
  figma.clientStorage.getAsync("shouldCountChildren"),
  figma.clientStorage.getAsync("shouldIncludeVariants")
]).then(([storedShouldCountChildren, storedShouldIncludeVariants]) => {
  shouldCountChildren = storedShouldCountChildren ?? shouldCountChildren;
  shouldIncludeVariants = storedShouldIncludeVariants ?? shouldIncludeVariants;

  // Send initial setting settings and counts after fetching clientStorage data.
  // This should happen quickly, before any selectionchange or currentpagechange events fire.
  postShouldCountChildrenMessage(shouldCountChildren);
  postShouldIncludeVariantsMessage(shouldIncludeVariants);
  postCountsMessage(figma.currentPage.selection, {
    shouldCountChildren,
    shouldIncludeVariants
  });
});

// =============================================
// Show the UI
// =============================================
figma.showUI(__html__, { width: 230, height: 322 });

// =============================================
// Set up event and message listeners
// =============================================
figma.on("selectionchange", () => {
  postCountsMessage(figma.currentPage.selection, {
    shouldCountChildren,
    shouldIncludeVariants
  });
});

figma.on("currentpagechange", () => {
  postCountsMessage(figma.currentPage.selection, {
    shouldCountChildren,
    shouldIncludeVariants
  });
});

figma.ui.onmessage = ({ type, message }) => {
  if (type === "toggleCountChildren") {
    figma.clientStorage.setAsync("shouldCountChildren", message);
    shouldCountChildren = message;
    postCountsMessage(figma.currentPage.selection, {
      shouldCountChildren,
      shouldIncludeVariants
    });
  } else if (type === "toggleIncludeVariants") {
    figma.clientStorage.setAsync("shouldIncludeVariants", message);
    shouldIncludeVariants = message;
    postCountsMessage(figma.currentPage.selection, {
      shouldCountChildren,
      shouldIncludeVariants
    });
  }
};

// ------------------------------------

/**
 * Post message to UI with the most up to date layer and layer type counts.
 */
function postCountsMessage(
  nodes: readonly SceneNode[],
  { shouldCountChildren, shouldIncludeVariants }: CountSettings
) {
  // figma.currentPage.selection returns `readonly SceneNode[]`,
  // so we manually copy the array to create a mutable version of it.
  const counts = countTypesForNodes([...nodes], {
    shouldCountChildren,
    shouldIncludeVariants
  });

  figma.ui.postMessage({ type: "updateCounts", message: counts });
}

/**
 * UI is handling it's own eager state update, so this only needs to be called once on initialization.
 */
function postShouldCountChildrenMessage(initValue: boolean) {
  figma.ui.postMessage({ type: "shouldCountChildren", message: initValue });
}

/**
 * UI is handling it's own eager state update, so this only needs to be called once on initialization.
 */
function postShouldIncludeVariantsMessage(initValue: boolean) {
  figma.ui.postMessage({ type: "shouldIncludeVariants", message: initValue });
}
