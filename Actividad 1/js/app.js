const body=d3.select('body')
const numero=d3.select("#numero")

//body.style('background-color','#F00')
const menos = d3.select("#menos")
const mas = d3.select("#mas")

const cambio = (color) => {
    body.style('background-color',color)
}

const delta = (i) =>{
    n += i
    numero.html(n)
}

menos.on("click",()=>delta(-1))
mas.on("click",()=>delta(1))