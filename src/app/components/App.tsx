import * as React from "react";
import { LayerAndTypeCounts, macroCaseToTitleCase } from "../../layerCounter";
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
  );

  return (
    <div>
      <div>Selected Layers: {layerCount}</div>
      <div>
        {blah.map(([type, count]) => (
          <div key={type}>
            {macroCaseToTitleCase(type)}: {count}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
