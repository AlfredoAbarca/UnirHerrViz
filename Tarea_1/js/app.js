//--------------------------Preparando el area del grafico a presentar------------------------------//
const width = 600;
const height = 308;
const margin = 5;
const padding = 5;
const adj = 30;
const svg = d3.select("div#grafica").append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "-"
      + adj + " -"
      + adj + " "
      + (width + adj *3) + " "
      + (height + adj*3))
.style("padding", padding)
.style("margin", margin)
.classed("svg-content", true);
//----------------------Preparando la lectura y formato de los datos a presentar------------------------------//
const timeConv = d3.timeParse("%Y-%m-%d")
const load = async() => {
dataset = d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv");
dataset.then(function(data){
    const slices = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d){
                return{
                    Fecha: timeConv(d.Fecha),
                    measurement: +d[id]
                };
            })
        }

})
        //------------------------Preparacion de las escalas del grafico a mostrar----------------------------------//
        const xScale = d3.scaleTime().range([0,width]);
        const yScale = d3.scaleLinear().rangeRound([height, 0]);
        xScale.domain(d3.extent(data, function(d){
            return timeConv(d.Fecha)}));
        yScale.domain([(0), d3.max(slices, function(c) {
            return d3.max(c.values, function(d) {
                return d.measurement + 4; });
                })
            ]);
        
        
        //-------------------------Preparacion de la graduacion de los ejes para nuestra grafica------------------//
        const yaxis = d3.axisLeft()
            .ticks(10)
            .scale(yScale);
        
        const xaxis = d3.axisBottom()
            .ticks(d3.timeDay.every(30))
            .tickFormat(d3.timeFormat('%Y-%m-%d'))
            .scale(xScale);
        
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xaxis);
        
        svg.append("g")
            .attr("class", "axis")
            .call(yaxis);

    //-----------------------Dibujamos la linea de tendencia-------------------------//

    let id = 0;
const ids = function () {
    return "line-"+id++;
}
    const line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.measurement); });

    const lines = svg.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    lines.append("path")
    .attr("d", function(d) { return line(d.values); });

console.log(slices[1]);
})

};


load();