// List of node types from the figma plugin api
// https://www.figma.com/plugin-docs/api/nodes/
type SceneNodeType = Exclude<NodeType, "DOCUMENT" | "PAGE">;

type TypeCounts = { [type in SceneNodeType]?: number };
export type LayerAndTypeCounts = { layerCount: number; typeCounts: TypeCounts };

/**
 * Counts the number of layers and layer types of the given nodes.
 * @param nodes
 * @returns TypeCounts object
 */
export function countLayersAndTypesForNodes(
  nodes: SceneNode[]
): LayerAndTypeCounts {
  const obj: TypeCounts = {};

  const typeCounts = nodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, obj);

  const layerCount = nodes.length;

  return { layerCount, typeCounts };
}

/**
 * Counts the number of layers and layer types of the given nodes. This includes all children of nodes.
 * @param nodes
 * @returns TypeCounts object
 */
export function countLayersAndTypesForNodesAndChildren(
  nodes: SceneNode[]
): LayerAndTypeCounts {
  const allNodes = nodes.flatMap(getNodeAndAllChildren);
  const obj: TypeCounts = {};

  const typeCounts = allNodes.reduce((accumulator, node) => {
    accumulator[node.type] = (accumulator[node.type] ?? 0) + 1;
    return accumulator;
  }, obj);

  const layerCount = allNodes.length;

  return { layerCount, typeCounts };
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
