import * as React from "react";
import { SceneNodeType, macroCaseToTitleCase } from "../../layerCounter";

type Props = {
  type: SceneNodeType;
  count: number;
};

const CountRow = ({ type, count }: Props) => {
  return (
    <div>
      <div>icon</div>
      <div>{macroCaseToTitleCase(type)}</div>
      <div>{count}</div>
    </div>
  );
};

export default CountRow;
