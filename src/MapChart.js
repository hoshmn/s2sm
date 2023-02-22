import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";

import allStates from "./data/allstates.json";
import statesMeta from "./data/statemeta.json";
import where_from from "./data/where_from.json";
import where_to from "./data/where_to.json";
// import { get, memoize } from "lodash";
import _ from "lodash";
import { scaleSequential, scaleDiverging } from "d3-scale";
import {
  max,
  extent,
  interpolatePuBu,
  interpolateOrRd,
  interpolateRdYlBu,
  min
} from "d3";
import * as d3 from "d3";

const weightedPop = 100000;

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

console.log(statesMeta["AL"], 12234);
const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

const getPopOf100k = (id) => {
  const p = statesMeta[id]?.pop.replace(/,/g, "");
  if (!p) return 0;
  return p / weightedPop;
};

const getD = ({ selectedState, s2, metric, year, weighted }) => {
  let d;
  if (metric === "from") {
    d = where_from[selectedState][year][s2];
  } else if (metric === "to") {
    d = where_to[selectedState][year][s2];
  } else if (metric === "between") {
    d =
      (where_from[selectedState][year][s2] || 0) -
      (where_to[selectedState][year][s2] || 0);
  }
  return !weighted ? d : d / getPopOf100k(s2);
  // console.log(get(where_from, 'AL.19'))
};

const format = ({ d, weighted }) => (!weighted ? d : Math.round(d * 10) / 10);

const MapChart = ({ selectHandler, selectedState, year, metric, weighted }) => {
  const colorScale = React.useMemo(() => {
    const dataSet = metric === "to" ? where_to : where_from;
    const data = { ...dataSet[selectedState][year] };
    delete data[selectedState];
    delete data["FC"]; // TODO: delete from data set?
    if (metric === "between") {
      _.forEach(
        data,
        (v, id) => (data[id] = v - where_to[selectedState][year][id])
      );
    }
    // console.log('cs')
    // console.log(data[selectedState], selectedState, data)
    const values = !weighted
      ? Object.values(data)
      : _.map(data, (n, id) => {
          const pop = getPopOf100k(id);
          // console.log(id, n, pop, "@@@@")
          return pop && n / Number(pop);
        });
    const extents = extent(values);
    console.log(
      [extents[0], 0, extents[1]],
      "?",
      max(values),
      min(values),
      values
    );
    const isDiverging = metric === "between";
    if (isDiverging)
      return scaleDiverging()
        .domain([extents[0], 0, extents[1]])
        .interpolator(interpolateRdYlBu);
    // .interpolator(interpolateBuPu);

    return (
      scaleSequential()
        .domain(extents)
        // .interpolator(interpolateViridis);
        .interpolator(metric === "from" ? interpolatePuBu : interpolateOrRd)
    );
  }, [year, metric, weighted, selectedState]);
  const getFill = (d, isSelected) => (isSelected ? "#000" : colorScale(d));
  // const dScale = scalePow()
  //   .exponent(.7)
  //   .domain(extents)
  //   .range([16,255])
  // // console.log(dScale(3002))

  // const getFill = (d, isSelected) => isSelected ? "#badbadFF" :
  //   colorScale(d)

  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map((geo) => {
              const cur = allStates[geo.id];
              !!cur || console.log({ cur, geo, allStates });
              const selectState = () => {
                selectHandler(cur.id);
              };

              const d = getD({
                selectedState,
                s2: cur.id,
                metric,
                year,
                weighted
              });
              // console.log(cur.id, d, "!");
              const isSelected = cur.id === selectedState;
              const fill = getFill(d, isSelected);
              // console.log(d, isSelected, fill)
              //  "#badbad" + String(Math.round(dScale(d)).toString(16))
              return (
                <Geography
                  onClick={selectState}
                  key={geo.rsmKey}
                  stroke={isSelected ? "red" : "#abc"}
                  strokeWidth={isSelected ? 5 : 1}
                  geography={geo}
                  fill={fill}
                />
              );
            })}
            {geographies.map((geo) => {
              const centroid = geoCentroid(geo);
              const cur = allStates[geo.id];
              // return null
              // const data = metric === "from" ?  where_from : where_to;
              const d = getD({
                selectedState,
                s2: cur.id,
                metric,
                year,
                weighted
              });
              const v = format({ d, weighted });
              // const pop = _.get(where_from, [cur.id, year, cur.id])

              // const weighted = pop && (Math.round(d*10000/pop))/10000
              // console.log(pop)
              // console.log(dScale(d))
              const isSelected = cur.id === selectedState;
              // const stroke = hsl(getFill(d, isSelected)).l > 0.5 ? "#000" : "#fff"
              return (
                <g key={geo.rsmKey + "-name"}>
                  {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <text
                          y="2"
                          pointerEvents="none"
                          stroke="white"
                          strokeWidth="2"
                          fontSize={14}
                          textAnchor="middle"
                        >
                          {cur.id}
                        </text>
                        <text
                          y="2"
                          pointerEvents="none"
                          stroke="black"
                          strokeWidth="1"
                          fontSize={14}
                          textAnchor="middle"
                        >
                          {cur.id}
                        </text>
                        <text
                          y="16"
                          strokeWidth="2"
                          stroke={"white"}
                          pointerEvents="none"
                          fontSize={12}
                          textAnchor="middle"
                        >
                          {!!v && v}
                          {""}
                          {/* {!!weighted && weighted} */}
                        </text>
                        <text
                          y="16"
                          strokeWidth="1"
                          stroke={"black"}
                          pointerEvents="none"
                          fontSize={12}
                          textAnchor="middle"
                        >
                          {!!v && v}
                          {""}
                          {/* {!!weighted && weighted} */}
                        </text>
                      </Marker>
                    ) : (
                      <Annotation
                        subject={centroid}
                        dx={offsets[cur.id][0]}
                        dy={offsets[cur.id][1]}
                      >
                        <text x={4} fontSize={14} alignmentBaseline="middle">
                          {cur.id}
                        </text>
                        <text x={26} fontSize={14} alignmentBaseline="middle">
                          {!!v && v}
                        </text>
                      </Annotation>
                    ))}
                </g>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
