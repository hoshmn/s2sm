import { range } from "lodash";
import React from "react";
// import { Slider } from "@mui/material";
export default function ControlString({
  year,
  metric,
  weighted,
  selectedState,
  selectYear,
  selectMetric,
  setWeighted
}) {
  // const [selectedState, setSelecetedState] = React.useState("CA");
  // console.log(selectedState);
  const metricSelect = (
    <select value={metric} onChange={(e) => selectMetric(e.target.value)}>
      <option value="from">to</option>
      <option value="to">from</option>
      <option value="between">between</option>
    </select>
  );

  const yearSelect = (
    <select value={year} onChange={(e) => selectYear(e.target.value)}>
      {range(5, 20)
        .map((n) => String(n).padStart(2, 0))
        .map((y) => (
          <option key={y} value={y}>
            20{y}
          </option>
        ))}
    </select>
  );

  const weightedSet = (
    <>
      <input
        checked={weighted}
        type="checkbox"
        id="weighted"
        name="weighted"
        value="weighted"
        onChange={() => setWeighted(!weighted)}
      />
      <label for="weighted">weighted</label>(pp 100,000)
    </>
  );

  return (
    <div>
      How many people moved {metricSelect} {selectedState}{" "}
      {metric === "between" ? "net" : metric} in {yearSelect}? {weightedSet}
      {/* <Slider /> */}
    </div>
  );
}
