// set the dimensions and margins of the graph

var margin = {top: 10, right: 100, bottom: 50, left: 80},
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#grafica")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);




d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/test.csv",
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
   .html("<p>Defunciones:" + formato(selectedData.Muertes) + "<br />" + "Fecha:" + formatTime(selectedData.Fecha) + "</p>")
   .attr("x", x(selectedData.Fecha)+15)
   .attr("y", y(selectedData.Muertes))
 }
function mouseout() {
 focus.style("opacity", 0)
 focusText.style("opacity", 0)
}

 

})