const graf = d3.select("#grafica")


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var parseDate = d3.timeParse("%Y-%m-%d");

// append the svg object to the body of the page
var svg = d3.select("#grafica")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear().range([0,width])
const y = d3.scaleLinear().range([height,0])

// function for the y grid lines
function make_y_axis() {
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        //.ticks(5)
  }
  
//Read the data
const load = async() => {
data = d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/All_MX_Covid.csv")
    console.log(data);

  
    //using imported data to define extent of x and y domains
    x.domain([0,d3.max(data, (d) => d.Last_Update)]);
    y.domain([0,d3.max(data, (d) => d.Deaths)]);

    render(data)
  
  // Draw the y Grid lines
      svg.append("g")            
          .attr("class", "grid")
          .call(make_y_axis()
              .tickSize(-width, 0, 0)
              .tickFormat("")
          )
    
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}

const render = (data) => {
    svg
    .data
    .enter()
    .append("line")
    .attr("cx", (d) => x(d.Last_Update))
    .attr("cy", (d) => y(d.Deaths))

}
load()