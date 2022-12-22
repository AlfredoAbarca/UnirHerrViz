//--------------------------Preparando el area del grafico a presentar------------------------------//
const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;
const svg = d3.select("#grafica")
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
    
    });
console.log(slices);
})}
load()