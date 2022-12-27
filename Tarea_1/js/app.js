// set the dimensions and margins of the graph

var margin = {top: 10, right: 100, bottom: 80, left: 80},
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

 
Create_Html_Table("#Grafica2_Tabla",data,['Fecha','Muertes']);
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
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv",   
// When reading the csv, I must format variables:
d => {
    return { Fecha : d3.timeParse("%Y-%m-%d")(d.Fecha), Casos_Confirmados : d.Tasa_de_Contagio }
  }).then(

  // Now I can use this dataset:
  function(data) {
    
    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.Fecha))
      .range([ 0, width ]);
    xAxis = svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

      svg.append("text")      // text label for the x axis
      .attr("x", 400 )
      .attr("y",  330 )
      .style("text-anchor", "middle")
      .text("Fecha");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d.Casos_Confirmados)])
      .range([ height, 0 ]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Casos Confirmados");

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the area variable: where both the area and the brush take place
    const area = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Create an area generator
    const areaGenerator = d3.area()
      .x(d => x(d.Fecha))
      .y0(y(0))
      .y1(d => y(d.Casos_Confirmados))

    // Add the area
    area.append("path")
      .datum(data)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("fill", "#69b3a2")
      .attr("fill-opacity", .3)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", areaGenerator )

    // Add the brushing
    area
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    let idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event) {

      // What are the selected boundaries?
      extent = event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      area
          .select('.myArea')
          .transition()
          .duration(1000)
          .attr("d", areaGenerator)
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(data, d => d.Fecha))
      xAxis.transition().call(d3.axisBottom(x))
      area
        .select('.myArea')
        .transition()
        .attr("d", areaGenerator)
    });
    Create_Html_Table("#Grafica1_Tabla",data,['Fecha','Casos_Confirmados']);
})}

function Carga_Grafico_Estados_Anio(){
    // append the svg object to the body of the page

var svg = d3.select("#grafica_anio_edo_contagios")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


//Read the data
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_x_AnioEstado.csv").then( function(data) {


const temp_data = data
// List of groups (here I have one group per column)
const allGroup = new Set(data.map(d => d.Year))
Create_Html_Table("#Grafica4_Tabla",temp_data,['Year','Estado','Casos_Confirmados']);

// add the options to the button
d3.select("#select_year_Button")
  .selectAll('myOptions')
     .data(allGroup)
  .enter()
    .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

// A color scale: one color for each group
const myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);

// Add X axis --> it is a date format
const x = d3.scaleBand()
.range([ 0, width ])
.domain(data.map(d => d.Estado))
.padding(0.2);
svg.append("g")
.attr("transform", `translate(0, ${height})`)
.call(d3.axisBottom(x))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  svg.append("text")      // text label for the x axis
  .attr("x", 400 )
  .attr("y",  330 )
  .style("text-anchor", "middle")
  .text("Estado");

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.Casos_Confirmados;})])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Casos Confirmados");

    // ----------------
  // Create a tooltip
  // ----------------
  const tooltip = d3.selectAll("#grafica_anio_edo_contagios")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")


  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    tooltip
    .html('Casos: ' + d3.format(",")(d.Casos_Confirmados))
    .style('opacity', 100);
    d3.select(this).transition().attr('fill', "Black");

  }
  const mousemove = function(event, d) {
    console.log(event.x)
    tooltip
           .style("left",((event.x)+50) + "px")
           .style("top",((event.y)+30) + "px")
  }
  const mouseleave = function(event, d) {
    tooltip
      .style("opacity", 0)
      const selectedGroup=d3.select("#select_year_Button").property("value")
      if (selectedGroup==2020){
        d3.select(this).transition().attr("fill", 'red');}
        if (selectedGroup==2021){
        d3.select(this).transition().attr("fill", 'blue');}
        if (selectedGroup==2022){
        d3.select(this).transition().attr("fill", 'green');}
  }



  const selectedOption = 2020
  // run the updateChart function with this selected option
  update(selectedOption)

// A function that update the chart
function update(selectedGroup) {
data=temp_data;
  // Create new data with the selection?
  const dataFilter = data.filter(function(d){return d.Year==selectedGroup});
  data=dataFilter;
  // Give these new data to update line
  // set the domains of the axes
  x.domain(data.map(d => d.Estado));
  //svg.call(d3.axisBottom(x))

  y.domain([0, d3.max(data, function(d) { return +d.Casos_Confirmados;})]);
  //svg.call(d3.axisLeft(y));
  // create the bars
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .transition().duration(1000)
      .attr("x", function(d) { return x(d.Estado); })
      .attr("y", function(d) { return y(d.Casos_Confirmados); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Casos_Confirmados); });


svg.selectAll(".bar")
      .data(data)
        .attr("class", "bar")
        .transition().duration(1000)
        .attr("x", function(d) { return x(d.Estado); })
        .attr("y", function(d) { return y(d.Casos_Confirmados); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Casos_Confirmados); });

const rect = svg
        .selectAll('.bar')
        .data(data)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    bars=svg.selectAll(".bar").data(data)
    if (selectedGroup==2020){
    bars
        .attr("fill", 'red');
    }

    if (selectedGroup==2021){
    bars
        .attr("fill", 'blue');}
    if (selectedGroup==2022){
    bars
        .attr("fill", 'green');}
        
}

// When the button is changed, run the updateChart function
d3.select("#select_year_Button").on("change", function(event,d) {
    // recover the option that has been chosen
    const selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
})



})}

function Carga_Grafico_Vacunas(){
    // append the svg object to the body of the page
const svg = d3.select("#grafica_vacunas")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/Covid_vaccinations_MX.csv",

// When reading the csv, I must format variables:
d => {
  return {
        Fecha: d3.timeParse("%Y-%m-%d")(d.Fecha),
        Personas_1_Vacuna : d.Personas_1_Vacuna
      }
    }).then(

// Now I can use this dataset:
function(data) {

// Add X axis --> it is a date format
const x = d3.scaleTime()
  .domain(d3.extent(data, d => d.Fecha))
  .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => +d.Personas_1_Vacuna)])
  .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

// Add the area
svg.append("path")
  .datum(data)
  .attr("fill", "#cce5df")
  .attr("stroke", "#69b3a2")
  .attr("stroke-width", 1.5)
  .attr("d", d3.area()
    .x(d => x(d.Fecha))
    .y0(y(0))
    .y1(d => y(d.Personas_1_Vacuna))
      )

 Create_Html_Table("#Grafica3_Tabla",data,['Fecha','Personas_1_Vacuna']);
  })}

function openTab(evt,ParentObject, TabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementById(ParentObject).getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementById(ParentObject).getElementsByClassName("tablinks");
  
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(TabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

function Create_Html_Table(HtmlDiv_id,data, columns) {
	var table = d3.select(HtmlDiv_id)
        .append('table')
	var thead = table.append('thead')
	var	tbody = table.append('tbody');
	// append the header row
	thead.append('tr')
	  .selectAll('th')
	  .data(columns).enter()
	  .append('th')
	    .text(function (column) { return column; })
        .style("border", "1px black solid")
        .style("padding", "5px")
        .style("background-color", "lightgray")
        .style("font-weight", "bold")
        .style("text-transform", "uppercase");

	// create a row for each object in the data
	var rows = tbody.selectAll('tr')
	  .data(data)
	  .enter()
	  .append('tr');

	// create a cell in each row for each column
	var cells = rows.selectAll('td')
	  .data(function (row) {
	    return columns.map(function (column) {
	      return {column: column, value: row[column]};
	    });
	  })
	  .enter()
	  .append('td')
	    .text(function (d) { return d.value; })
        .style("border", "1px black solid")
        .style("padding", "5px");
  return table;
}



//Seleccion de las tabs por defecto de las graficas
document.getElementById("Grafica1_btn1").click();
document.getElementById("Grafica2_btn1").click();
document.getElementById("Grafica3_btn1").click();
document.getElementById("Grafica4_btn1").click();

//Carga la informacion de cada uno de los graficos
Carga_Grafico_Contagios()
Carga_Grafico_Defunciones()
Carga_Grafico_Estados_Anio()
Carga_Grafico_Vacunas()