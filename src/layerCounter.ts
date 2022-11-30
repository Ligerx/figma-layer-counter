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
    _nodes = [..._nodes, ...nodes.flatMap(getAllChildrenNodes)];
  }

  // TODO Should this happen before counting children?
  //      Probably right, so that you include variant children too?
  // TODO Should variant ... only happen for remote ComponentSetNodes?
  // Is not currently including the ComponentSetNode in the count unless it's being directly selected.
  if (shouldIncludeVariants) {
    // Multiple components/instances could belong to the same ComponentSetNode
    // Currently, I'm choosing to dedupe ComponentSetNodes.

    // TODO I think there's going to be a bug of dupes when variant and children are enabled
    //      Simple test would be enable both and then select a ComponentSetNode
    //      Solution would be to dedupe all _nodes. It's easy too.

    // TODO also an issue of including variants of nested layers

    // So I think the play is
    // include all children first, then handle variant checking
    // then dedupe variants, EXCEPT FOR when the user is directly selecting a variant?

    const uniqueCompenentSetNodes = new Set();

    _nodes = [
      ..._nodes,
      ...nodes.flatMap(node => {
        let componentSetNode: ComponentSetNode;

        if (
          node.type === "INSTANCE" &&
          node.mainComponent.parent.type === "COMPONENT_SET"
        ) {
          componentSetNode = node.mainComponent.parent;
        } else if (
          node.type === "COMPONENT" &&
          node.parent.type === "COMPONENT_SET"
        ) {
          componentSetNode = node.parent;
        } else if (node.type === "COMPONENT_SET") {
          componentSetNode = node;
        } else {
          return []; // early return
        }

        if (uniqueCompenentSetNodes.has(componentSetNode)) {
          return [];
        } else {
          uniqueCompenentSetNodes.add(componentSetNode);
          //.children returns readonly, so copying to remove that
          return [...componentSetNode.children];
        }
      })
    ];
  }

  const typeCounts = _nodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, {} as TypeCounts);

  return typeCounts;
}

function getAllChildrenNodes(node: SceneNode): SceneNode[] {
  if (supportsChildren(node)) {
    const children = node.findAll(() => true);
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
