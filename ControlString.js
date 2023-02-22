import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import MapChart from "./MapChart";

function App() {
  const [selectedState, setSelecetedState] = React.useState("CA");
  console.log(selectedState);
  return <div>viewing data for {selectedState}</div>;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
