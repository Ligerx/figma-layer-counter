import * as React from "react";
import { SceneNodeType, LayerAndTypeCounts } from "../../layerCounter";
import CountRow from "./CountRow";
import "../styles/figma-plugin-ds.min.css";
import "../styles/ui.css";

function useMessageListenerEffect(setState) {
  React.useEffect(() => {
    window.onmessage = event => {
      setState(event.data.pluginMessage);
    };
  }, []);
}

const defaultState: LayerAndTypeCounts = { layerCount: 0, typeCounts: {} };

const App = ({}) => {
  const [{ layerCount, typeCounts }, setLayerAndTypeCounts] = React.useState(
    defaultState
  );

  useMessageListenerEffect(setLayerAndTypeCounts);

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
            {layerCount}
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
