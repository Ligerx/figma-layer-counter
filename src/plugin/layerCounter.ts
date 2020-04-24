// List of node types from the figma plugin api
// https://www.figma.com/plugin-docs/api/nodes/
type SceneNodeType = Exclude<NodeType, "DOCUMENT" | "PAGE">;

type TypeCounts = { [type in SceneNodeType]?: number };

/**
 * Counts the number of layer types of the given nodes.
 * @param nodes
 * @returns TypeCounts object
 */
export function countLayerTypesForNodes(nodes: SceneNode[]): TypeCounts {
  const obj: TypeCounts = {};

  const layerTypeCounts = nodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, obj);

  return layerTypeCounts;
}

/**
 * Counts the number of layer types of the given nodes. This includes all children of nodes.
 * @param nodes
 * @returns TypeCounts object
 */
export function countLayerTypesForNodesAndChildren(
  nodes: SceneNode[]
): TypeCounts {
  const allNodes = nodes.flatMap(getNodeAndAllChildren);
  const obj: TypeCounts = {};

  const layerTypeCounts = allNodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, obj);

  return layerTypeCounts;
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
 * @param node The node to check if it supports children.
 * @returns If `node` supports children or not.
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
 * @param string
 * @returns Title case string
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
