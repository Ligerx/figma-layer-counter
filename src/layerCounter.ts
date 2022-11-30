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

    // One  tradeoff to simplify logic is to only include unique variant component references
    // and don't worry about intentionally including dupes when the user selects a variant subcomponent and an instance of it

    // Dedupe repeated ComponentSetNodes.
    // Duplicates could be caused by selecting multiple instances of the same variant,
    // having nested layers (if enabled) with instances of the same variant,
    // or selecting a component in the ComponentSetNode and an instance of a component in the same ComponentSetNode.
    const uniqueComponentSetNodes = [
      ...new Set(
        _nodes
          .map(getComponentSetNodeFromNode)
          .filter(nodeOrNull => nodeOrNull != null)
      )
    ];

    let variantNodes: SceneNode[];
    if (shouldCountChildren) {
      variantNodes = uniqueComponentSetNodes
        .flatMap(node => node.children)
        .flatMap(getChildrenRecursive);
    } else {
      variantNodes = uniqueComponentSetNodes.flatMap(node => node.children);
    }

    _nodes = [..._nodes, ...variantNodes];
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
  if (
    node.type === "INSTANCE" &&
    node.mainComponent.parent.type === "COMPONENT_SET"
  ) {
    return node.mainComponent.parent;
  } else if (
    node.type === "COMPONENT" &&
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
