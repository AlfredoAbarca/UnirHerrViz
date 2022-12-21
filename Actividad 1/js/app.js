const body=d3.select('body')
const numero=d3.select("#numero")

//body.style('background-color','#F00')
const menos = d3.select("#menos")
const mas = d3.select("#mas")
var n = 0

const cambio = (color) => {
    body.style('background-color',color)
}

const delta = (i) => {
    n += i
    numero.html(n)
    if (n=>5){
        mas.classed("text-success", true)
    }
    if (n<=5){
        mas.classed("text-success", false)
    }
}

menos.on("click", () => delta(-1))
mas.on("click", () => delta(1))