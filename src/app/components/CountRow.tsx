import * as React from "react";
import { SceneNodeType, macroCaseToTitleCase } from "../../layerCounter";

type Props = {
  type: SceneNodeType;
  count: number;
};

const typeToIcon = {
  SLICE: "icon--", //TODO
  FRAME: "icon--frame",
  GROUP: "icon--group",
  COMPONENT: "icon--component",
  INSTANCE: "icon--instance",
  BOOLEAN_OPERATION: "icon--",
  VECTOR: "icon--vector-handles", // close enough icon
  STAR: "icon--star-off",
  LINE: "icon--minus", // close enough icon
  ELLIPSE: "icon--", // TODO
  POLYGON: "icon--", // TODO
  RECTANGLE: "icon--", // TODO
  TEXT: "icon--type"
};

const CountRow = ({ type, count, ...otherProps }: Props) => {
  return (
    <div className="count-row" {...otherProps}>
      <div className={`count-icon icon ${typeToIcon[type]}`}></div>
      <p className="count-row-type type type--pos-medium-normal">
        {macroCaseToTitleCase(type)}
      </p>
      <p className="count-row-count type type--pos-medium-normal">{count}</p>
    </div>
  );
};

export default CountRow;
