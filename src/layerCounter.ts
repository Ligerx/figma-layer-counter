// List of node types can be found at https://github.com/figma/plugin-typings
// Their docs website isn't always up to date.
// Type list sometimes updates, so I won't always have the necessary icons to differentiate.
export type SceneNodeType = SceneNode["type"]; // convert types to string
export type TypeCounts = { [type in SceneNodeType]?: number };

export function countTypesForNodes(nodes: SceneNode[]): TypeCounts {
  const obj: TypeCounts = {};

  const typeCounts = nodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, obj);

  return typeCounts;
}

export function countTypesForNodesAndChildren(nodes: SceneNode[]): TypeCounts {
  const allNodes = nodes.flatMap(getNodeAndAllChildren);
  const obj: TypeCounts = {};

  const typeCounts = allNodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, obj);

  return typeCounts;
}

function getNodeAndAllChildren(node: SceneNode): SceneNode[] {
  if (supportsChildren(node)) {
    const children = node.findAll(() => true);
    return [node, ...children];
  }
  return [node];
}

/**
 * Type guard that checks if a node supports children.
 */
function supportsChildren(
  node: SceneNode
): node is FrameNode | ComponentNode | InstanceNode | BooleanOperationNode {
  return (
    node.type === "FRAME" ||
    node.type === "GROUP" ||
    node.type === "COMPONENT" ||
    node.type === "INSTANCE" ||
    node.type === "BOOLEAN_OPERATION"
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
