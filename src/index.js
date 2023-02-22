import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import NodeChart from "./NodeChart";
import MapChart from "./MapChart";
import ControlString from "./ControlString";

function App() {
  const [selectedState, setSelecetedState] = React.useState("AK");
  const [year, selectYear] = React.useState("05")
  const [metric, selectMetric] = React.useState("between");
  const [weighted, setWeighted] = React.useState(true);
  console.log(selectedState);
  return (
    <div>
      {/* viewing data for {selectedState} */}
      <ControlString
        selectedState={selectedState}
        selectYear={selectYear}
        year={year}
        selectMetric={selectMetric}
        metric={metric}
        weighted={weighted}
        setWeighted={setWeighted}
      />
      <NodeChart
        selectedState={selectedState}
        selectHandler={setSelecetedState}
        year={year}
        metric={metric}
        weighted={weighted}
      />
      {/* <MapChart
        selectedState={selectedState}
        selectHandler={setSelecetedState}
        year={year}
        metric={metric}
        weighted={weighted}
      /> */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
