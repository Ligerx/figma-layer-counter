import * as React from "react";
import { SceneNodeType, macroCaseToTitleCase } from "../../layerCounter";

type Props = {
  type: SceneNodeType;
  count: number;
};

const CountRow = ({ type, count, ...otherProps }: Props) => {
  return (
    <div className="count-row" {...otherProps}>
      <div className="icon icon--adjust"></div>
      <p className="count-row-type type type--pos-medium-normal">
        {macroCaseToTitleCase(type)}
      </p>
      <p className="count-row-count type type--pos-medium-normal">{count}</p>
    </div>
  );
};

export default CountRow;
