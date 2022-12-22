//--------------------------Preparando el area del grafico a presentar------------------------------//
const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;
const svg = d3.select("#grafica")

  
//Read the data
const load = async() => {
data = d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv")
console.log(data);}
load()