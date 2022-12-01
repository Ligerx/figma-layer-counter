import * as React from "react";
import { SceneNodeType, macroCaseToTitleCase } from "../../layerCounter";

type Props = {
  type: SceneNodeType;
  count: number;
};

const typeToIcon = {
  // icons included in figma-plugin-ds
  FRAME: "icon--frame",
  GROUP: "icon--group",
  COMPONENT: "icon--component",
  INSTANCE: "icon--instance",
  STAR: "icon--star-off",
  TEXT: "icon--type",

  // icons that had something close enough in figma-plugin-ds
  VECTOR: "icon--vector-handles",
  LINE: "icon--minus",

  // custom icons
  SLICE: "icon--slice",
  ELLIPSE: "icon--ellipse",
  POLYGON: "icon--polygon",
  RECTANGLE: "icon--rectangle",
  BOOLEAN_OPERATION: "icon--boolean-operation"

  // if the type/icon can't be found, it just appears as empty and the layout works fine.
  // unintentional but sufficient behavior.
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
