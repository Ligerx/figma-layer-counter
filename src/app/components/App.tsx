import * as React from "react";
import { LayerAndTypeCounts } from "../../layerCounter";
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
  const [layerAndTypeCounts, setLayerAndTypeCounts] = React.useState(
    defaultState
  );

  useMessageListenerEffect(setLayerAndTypeCounts);

  return <div>{JSON.stringify(layerAndTypeCounts)}</div>;
};

export default App;
