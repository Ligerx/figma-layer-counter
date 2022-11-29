import * as React from "react";
import { SceneNodeType, TypeCounts } from "../../layerCounter";
import CountRow from "./CountRow";
import "../styles/figma-plugin-ds.min.css";
import "../styles/ui.css";

function typeCountsTotal(typeCounts: TypeCounts): number {
  return Object.values(typeCounts).reduce((a, b) => a + b, 0);
}

const App = ({}) => {
  const [typeCounts, setTypeCounts] = React.useState<TypeCounts>({});
  const [shouldCountChildren, setShouldCountChildren] = React.useState(false);

  // Initialize plugin message listeners
  React.useEffect(() => {
    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;
      if (type === "shouldCountChildren") {
        setShouldCountChildren(message);
      } else if (type === "updateCounts") {
        setTypeCounts(message);
      }
    };
  }, []);

  const onCheckboxClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "toggleCountChildren",
          message: !shouldCountChildren
        }
      },
      "*"
    );

    // Eagerly updating the checkbox state
    setShouldCountChildren(!shouldCountChildren);
  };

  const sortedCounts = Object.entries(typeCounts).sort(
    ([aKey, aValue], [bKey, bValue]) => {
      // Sort by layer count descending
      if (bValue !== aValue) {
        return bValue - aValue;
      }

      // Fall back on sorting alphabetically
      return aKey.localeCompare(bKey);
    }
  ) as [SceneNodeType, number][];

  return (
    <div className="app">
      <div className="nested-layers-checkbox checkbox">
        <input
          className="checkbox__box"
          type="checkbox"
          id="include-children-checkbox"
          onChange={onCheckboxClick}
          checked={shouldCountChildren}
        />
        <label className="checkbox__label" htmlFor="include-children-checkbox">
          Include nested layers
        </label>
      </div>

      <div className="counts-container">
        <div className="count-row layer-count">
          <p className="count-row-type type type--pos-large-bold">
            Selected Layers
          </p>
          <p className="count-row-count type type--pos-large-bold">
            {typeCountsTotal(typeCounts)}
          </p>
        </div>

        <div>
          {sortedCounts.map(([type, count]) => (
            <CountRow key={type} type={type} count={count} />
          ))}
        </div>
      </div>

      <div className="github">
        <a href="https://github.com/Ligerx/figma-layer-counter" target="_blank">
          GitHub
        </a>
      </div>
    </div>
  );
};

export default App;
