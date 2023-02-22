import * as d3 from "d3";
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-chart
export default function BubbleChart(
  data,
  {
    name = ([x]) => x, // alias for label
    label = name, // given d in data, returns text to display on the bubble
    value = ([, y]) => y, // given d in data, returns a quantitative size
    // group, // given d in data, returns a categorical value for color
    title, // given d in data, returns text to show on hover
    link, // given a node d, its link (if any)
    linkTarget = "_blank", // the target attribute for links, if any
    width = 640, // outer width, in pixels
    height = width, // outer height, in pixels
    padding = 3, // padding between circles
    margin = 1, // default margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    // groups, // array of group names (the domain of the color scale)
    // colors = d3.schemeTableau10, // an array of colors (for groups)
    fill = "#ccc", // a static fill color, if no group channel is specified
    fillOpacity = 0.7, // the fill opacity of the bubbles
    stroke, // a static stroke around the bubbles
    strokeWidth, // the stroke width around the bubbles, if any
    strokeOpacity, // the stroke opacity around the bubbles, if any
  } = {}
) {
  // Compute the values.
  const D = d3.map(data, (d) => d)
  const V = d3.map(data, value)
  // const G = group == null ? null : d3.map(data, group)
  const I = d3.range(V.length)
  // console.log({ D, V, G, I })

  // Unique the groups.
  // if (G && groups === undefined) groups = I.map((i) => G[i])
  // groups = G && new d3.InternSet(groups)

  // Construct scales.
  // const color = G && d3.scaleOrdinal(groups, colors)

  // Compute labels and titles.
  const L = label == null ? null : d3.map(data, label)
  const T = title === undefined ? L : title == null ? null : d3.map(data, title)

  // Compute layout: create a 1-deep hierarchy, and pack it.
  const root = d3
    .pack()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .padding(padding)(d3.hierarchy({ children: I }).sum((i) => Math.abs(V[i])))

  const svg = d3
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-marginLeft, -marginTop, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("fill", "currentColor")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")

  // console.log(78, root.leaves())
  const sortedData = root
    .leaves()
    .map((d, i) => ({
      ...d,
      l: L[d.data],
    }))
    .sort((a, b) => b.r - a.r)

  const leafs = svg
    .selectAll(".cirx")
    .data(root.leaves(), (d, i) => (i < 3 && console.log(71, d, i)) || d.data)
    // .join("g")
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "cirx")
          .attr("transform", (d, i) => `translate(${d.x},${d.y})`),
      (update) =>
        update
          .transition()
          .delay((d, i) => i * 20)
          .duration(1000)
          .attr("transform", (d, i) => `translate(${d.x},${d.y})`)
          .attr("stroke", "blue"),
      (exit) => exit.remove()
    )

  const circles = leafs
    .selectAll("circle")
    .data((d, i) => (i < 3 && console.log(97, d, i)) || d)
    // .join("circle")
    .join(
      (enter) =>
        enter
          .append("circle")
          .attr("stroke-width", strokeWidth)
          .attr("stroke-opacity", 0.1)
          .attr(
            "fill",
            "aqua"
            // G ? (d) => color(G[d.data]) : fill == null ? "none" : fill
          )
          .attr("fill-opacity", 0.2)
          .attr("r", (d) => Math.abs(d.r)),
      (update) =>
        update
          .transition()
          .delay((d, i) => i * 20)
          .duration(1000)
          .attr("r", (d) => Math.abs(d.r))
          .attr("stroke", "red"),
      (exit) => exit.remove()
    )

  const labels = leafs
    .selectAll("text")
    .data((d) => d)
    // .join("text")
    .join(
      (enter) =>
        enter
          .append("text")
          .text((d) => L[d.data])
          .attr("font-size", 18),
      (update) => update.text((d) => L[d.data]),
      (exit) => exit.remove()
    )
  // .join(
  //   (enter) =>
  //     console.log(73, enter) ||
  //     enter
  //       .append("g")
  //       // .append("circle")
  //       .attr("class", "cirx")
  //       .attr("transform", (d, i) => `translate(${d.x},${d.y})`),

  //   // .append("text")
  //   // .text((d) => L[d.data]),
  //   (update) =>
  //     console.log(82, update) ||
  //     update
  //       // .transition()
  // /delay       // .duration((d, i) => i * 20)
  // 1000)
  //       .attr("transform", (d) => `translate(${d.x},${d.y})`)
  //       .attr("r", (d) => Math.abs(d.r))
  //       .attr("fill", "yellow"),
  //   (exit) => console.log(88, exit) || exit.remove()
  // )

  // console.log(94, leafs, leafs.selectAll("circle"), root.leaves())

  // leaf
  //   .selectAll("circle")
  //   // .data([{ r: 2 }])
  //   // .enter()
  //   .append("circle")
  //   .attr("stroke", "red")
  //   .attr("stroke-width", strokeWidth)
  //   .attr("stroke-opacity", strokeOpacity)
  //   .attr(
  //     "fill",
  //     "aqua"
  //     // G ? (d) => color(G[d.data]) : fill == null ? "none" : fill
  //   )
  //   .attr("fill-opacity", fillOpacity)
  //   .attr(
  //     "r",
  //     (d, i) =>
  //       console.log(
  //         111,
  //         d,
  //         Math.abs(root.leaves()[i].r) || Math.abs(root.leaves()[i].r)
  //       ) || 17
  //   )
  //   .attr(
  //     "xlink:href",
  //     link == null ? null : (d, i) => link(D[d.data], i, data)
  //   )
  //   .attr("target", link == null ? null : linkTarget)
  //   .attr("transform", (d) => `translate(${d.x},${d.y})`);

  // leaf
  //   .append("circle")
  //   .attr("stroke", "red")
  //   .attr("stroke-width", strokeWidth)
  //   .attr("stroke-opacity", strokeOpacity)
  //   .attr("fill", G ? (d) => color(G[d.data]) : fill == null ? "none" : fill)
  //   .attr("fill-opacity", fillOpacity)
  //   .attr("r", (d) => Math.abs(d.r));

  // if (T) leaf.append("title").text((d) => T[d.data]);

  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`

    // leaf
    //   .append("clipPath")
    //   .attr("id", (d) => `${uid}-clip-${d.data}`)
    //   .append("circle")
    //   .attr("r", (d) => d.r);

    // leaf
    //   .append("text")
    //   .attr(
    //     "clip-path",
    //     (d) => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`
    //   )
    //   .selectAll("tspan")
    //   .data((d) => `${L[d.data]}`.split(/\n/g))
    //   .join("tspan")
    //   .attr("font-size", 24)
    //   .attr("x", 0)
    //   .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
    //   .attr("fill-opacity", (d, i, D) => (i === D.length - 1 ? 0.7 : null))
    //   .text((d) => d);
  }

  window.x = {
    D,
    V,
    // G,
    I,
    L,
    T,
    root,
    data,
  }
  console.log(220, data)
  // return Object.assign(svg.node(), { scales: { color } });
}
