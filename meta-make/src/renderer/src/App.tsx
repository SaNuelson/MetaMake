import React from "react";
import { Navigation } from "./components/Navigation";
import DataPreview from "./components/windows/DataPreview";

function App(): React.JSX.Element {
  return (
    <div>
      <Navigation></Navigation>
      <DataPreview></DataPreview>
    </div>
  );
}

export default App
