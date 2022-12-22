const graf = d3.select("#grafica")

  
//Read the data
const load = async() => {
data = d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv")
console.log(data);}
load()