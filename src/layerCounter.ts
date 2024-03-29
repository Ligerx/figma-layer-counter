// List of node types can be found at https://github.com/figma/plugin-typings
// Their docs website isn't always up to date.
// Type list sometimes updates, so I won't always have the necessary icons to differentiate.
export type SceneNodeType = SceneNode["type"]; // convert types to string
export type TypeCounts = { [type in SceneNodeType]?: number };

export type CountSettings = {
  shouldCountChildren: boolean;
  shouldIncludeVariants: boolean;
};

export function countTypesForNodes(
  nodes: SceneNode[],
  { shouldCountChildren, shouldIncludeVariants }: CountSettings
): TypeCounts {
  let _nodes: SceneNode[] = nodes;

  if (shouldCountChildren) {
    _nodes = [..._nodes, ...nodes.flatMap(getChildrenRecursive)];
  }

  if (shouldIncludeVariants) {
    // Theoretically should work with both remote and local components/variants

    // Dedupe repeated ComponentSetNodes.
    // Duplicates could be caused by selecting multiple instances of the same variant,
    // having nested layers (if enabled) with instances of the same variant,
    // or selecting a component in the ComponentSetNode and a component or instance in the same ComponentSetNode.
    const uniqueComponentSetNodes = [
      ...new Set(
        _nodes
          .map(getComponentSetNodeFromNode)
          .filter(nodeOrNull => nodeOrNull != null)
      )
    ];

    let variantNodes: SceneNode[] = uniqueComponentSetNodes.flatMap(
      node => node.children
    );
    if (shouldCountChildren) {
      variantNodes = [
        ...variantNodes,
        ...variantNodes.flatMap(getChildrenRecursive)
      ];
    }

    // combine variants and other nodes, then dedupe
    // Duplication can occur when selecting an instance and also a component in the set, or selecting the ComponentSetNode itself.
    //
    // One tradeoff of this dedupe logic is it only includes unique variant component references
    // and doesn't worry about intentionally including dupes when the user selects a variant subcomponent and an instance variant in the same set.
    _nodes = [...new Set([..._nodes, ...variantNodes])];
  }

  const typeCounts = _nodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, {} as TypeCounts);

  return typeCounts;
}

function getChildrenRecursive(node: SceneNode): SceneNode[] {
  if (supportsChildren(node)) {
    const children = node.findAll(() => true); // traverses the full layer tree under `node`
    return children;
  }
  return [];
}

/**
 * Type guard that checks if a node supports children.
 * Based on types from https://www.figma.com/plugin-docs/api/properties/nodes-children,
 * but no guarantees it's always accurate or up to date.
 * Unsure if there's a more elegant way to handle this.
 */
function supportsChildren(
  node: SceneNode
): node is
  | FrameNode
  | GroupNode
  | ComponentNode
  | InstanceNode
  | BooleanOperationNode
  | ComponentSetNode
  | SectionNode {
  return (
    node.type === "FRAME" ||
    node.type === "GROUP" ||
    node.type === "COMPONENT" ||
    node.type === "INSTANCE" ||
    node.type === "BOOLEAN_OPERATION" ||
    node.type === "COMPONENT_SET" ||
    node.type === "SECTION"
  );
}

function getComponentSetNodeFromNode(node): ComponentSetNode | null {
  // FigJam doesn't have a top level PageNode, so you need to double check that a component's parent isn't null
  // Can't rely on it just going up to PageNode.
  if (
    node.type === "INSTANCE" &&
    node.mainComponent.parent != null &&
    node.mainComponent.parent.type === "COMPONENT_SET"
  ) {
    return node.mainComponent.parent;
  } else if (
    node.type === "COMPONENT" &&
    node.parent != null &&
    node.parent.type === "COMPONENT_SET"
  ) {
    return node.parent;
  }
  // I think that selecting a ComponentSetNode should not include its sub-components
  // since the set contains variants but is not a variant itself.
  //
  // else if (node.type === "COMPONENT_SET") {
  //   return node;
  // }
  else {
    return null;
  }
}

/**
 * Takes a macro case formatted string and returns a title case formatted string.
 *
 * eg. `BOOLEAN_OPERATION` becomes `Boolean Operation`.
 */
export function macroCaseToTitleCase(string: string): string {
  return string
    .split("_")
    .map(capitalizeFirstLetter)
    .join(" ");
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
