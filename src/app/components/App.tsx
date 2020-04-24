import * as React from "react";
import "../styles/figma-plugin-ds.min.css";
import "../styles/ui.css";

const App = ({}) => {
  React.useEffect(() => {
    window.onmessage = event => {
      const { type, message } = event.data.pluginMessage;
      if (type === "create-rectangles") {
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return <div></div>;
};

export default App;
