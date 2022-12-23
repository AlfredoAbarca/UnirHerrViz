// set the dimensions and margins of the graph

var margin = {top: 10, right: 100, bottom: 50, left: 80},
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;


function Carga_Grafico_Defunciones(){
// append the svg object to the body of the page
var svg = d3.select("#grafica_def")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);




d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv",
   // When reading the csv, I must format variables:
   function(d){
    return { Fecha : d3.timeParse("%Y-%m-%d")(d.Fecha), Muertes : d.Muertes }
  }).then(

  // Now I can use this dataset:
  function(data) {



    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.Fecha; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

      svg.append("text")      // text label for the x axis
      .attr("x", 400 )
      .attr("y",  330 )
      .style("text-anchor", "middle")
      .text("Fecha");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 400000])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Defunciones");


  // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function(d) { return d.Fecha; }).left;

  // Create the circle that travels along the curve of chart
  var focus = svg
    .append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "black")
      .attr('r', 8.5)
      .style("opacity", 50)

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
      .style("font-size", "10px")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Fecha) })
        .y(function(d) { return y(d.Muertes) })
        )
 // Create a rect on top of the svg area: this rectangle recovers mouse position
 svg
 .append('rect')
 .style("fill", "none")
 .style("pointer-events", "all")
 .attr('width', width)
 .attr('height', height)
 .on('mouseover', mouseover)
 .on('mousemove', mousemove)
 .on('mouseout', mouseout);


// What happens when the mouse move -> show the annotations at the right positions.
function mouseover() {
 focus.style("opacity", 1)
 focusText.style("opacity",1)
}

function mousemove() {
 // recover coordinate we need
 var x0 = x.invert(d3.pointer(event, this)[0]);
 var i = bisect(data, x0, 1);
 const formato = d3.format(",");
 const formatTime = d3.timeFormat("%B %d, %Y");
 selectedData = data[i]
 focus
   .attr("cx", x(selectedData.Fecha))
   .attr("cy", y(selectedData.Muertes))
focusText
    .html("")
focusText.append("tspan")
   .text("Defunciones:" + formato(selectedData.Muertes))
   .attr("x", x(selectedData.Fecha)+15)
   .attr("y", y(selectedData.Muertes))
focusText.append("tspan")
   .text("Fecha:" + formatTime(selectedData.Fecha))
   .attr("x", x(selectedData.Fecha)+15)
   .attr("y", y(selectedData.Muertes)+10)
 }
function mouseout() {
 focus.style("opacity", 0)
 focusText.style("opacity", 0)
}

 

})}

function Carga_Grafico_Contagios(){
    // append the svg object to the body of the page
const svg = d3.select("#grafica_contagios")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

// get the data
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv",   function(d){
    return { Fecha : d3.timeParse("%Y-%m-%d")(d.Fecha), Casos_Confirmados : d.Tasa_de_Contagio }
  }).then( 
function(data) {

// X axis: scale and draw:
const x = d3.scaleTime()
.domain(d3.extent(data, function(d) { return d.Fecha; }))
.range([ 0, width ]);
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

// set the parameters for the histogram
const histogram = d3.histogram()
    .value(function(d) { return d.Casos_Confirmados; })   // I need to give the vector of value
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(400)); // then the numbers of bins

// And apply this function to data to get the bins
const bins = histogram(data);

// Y axis: scale and draw:
const y = d3.scaleLinear()
    .range([height, 0]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
svg.append("g")
    .call(d3.axisLeft(y));

// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
const tooltip = d3.select("#grafica_contagios")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "black")
  .style("color", "white")
  .style("border-radius", "5px")
  .style("padding", "10px")

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
const showTooltip = function(event,d) {
  tooltip
    .transition()
    .duration(100)
    .style("opacity", 1)
  tooltip
    .html("Range: " + d.x0 + " - " + d.x1)
    .style("left", (event.x)/2-100 + "px")
    .style("top", (event.y)/2 + "px")
}
const moveTooltip = function(event,d) {
  tooltip
  .style("left", (event.x)/2-100 + "px")
  .style("top", (event.y)/2 + "px")
}
// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
const hideTooltip = function(event,d) {
  tooltip
    .transition()
    .duration(100)
    .style("opacity", 0)
}

// append the bar rectangles to the svg element
svg.selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length)})`})
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); })
      .style("fill", "#69b3a2")
      // Show tooltip on hover
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )

});
}
Carga_Grafico_Contagios()
Carga_Grafico_Defunciones()