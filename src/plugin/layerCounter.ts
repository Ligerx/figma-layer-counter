// List of node types from the figma plugin api
// https://www.figma.com/plugin-docs/api/nodes/
type SceneNodeType = Exclude<NodeType, "DOCUMENT" | "PAGE">;

// const nodeTypes: SceneNodeType[] = [
//   "FRAME",
//   "GROUP",
//   "SLICE",
//   "RECTANGLE",
//   "LINE",
//   "ELLIPSE",
//   "POLYGON",
//   "STAR",
//   "VECTOR",
//   "TEXT",
//   "COMPONENT",
//   "INSTANCE",
//   "BOOLEAN_OPERATION",
// ];

type TypeCounts = { [type in SceneNodeType]?: number };

// TODO: might want a toggle for "Include all nested layers"
/**
 *
 * @param nodes
 * @returns
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
 * Takes a macro case formatted string and returns a title case formatted string.
 *
 * eg. `BOOLEAN_OPERATION` becomes `Boolean Operation`.
 * @param string
 * @returns Title case string
 */
// function macroCaseToTitleCase(string: string): string {
//   return string
//       .split("_")
//       .map(capitalizeFirstLetter)
//       .join(" ");
// }

// function capitalizeFirstLetter(string: string): string {
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// }
