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
  
//Read the data
const load = async() => {
data = d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv")
console.log(data);}
load()