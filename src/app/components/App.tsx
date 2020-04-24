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

  const blah = Object.entries(typeCounts).sort(
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
    <div>
      <div>Selected Layers: {layerCount}</div>

      <div>
        {blah.map(([type, count]) => (
          <CountRow key={type} type={type} count={count} />
        ))}
      </div>

      <div className="checkbox">
        <input
          className="checkbox__box"
          type="checkbox"
          id="include-children-checkbox"
        />
        <label className="checkbox__label" htmlFor="include-children-checkbox">
          Include nested layers
        </label>
      </div>
    </div>
  );
};

export default App;
