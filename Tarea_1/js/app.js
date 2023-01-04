//**********************************************************************************************/
//
//
//                                      App.js
//
// Descripcion: 
//              El siguiente codigo fuente se desarrollo para mostrar las capacidades de la 
//              libreria de D3. Los graficos generados, toman como su fuente de datos 
//              los dataset publicados referentes a datos historicos y estadisticos del 
//              COVID-19 en Mexico. 
// Lenguaje de Programacion:
//                          Javascript
// Version de D3:
//               La version de D3 empleada para desarrollar los graficos es la 7.8
//
// Autores: 
//          Alfredo Abarca Barajas
//          Mario de Lara Loyola
//          Daniel Perez Flores
// Fecha:
//       20-12-2022
//
// Institucion: 
//              Unir Mexico 
//
//**********************************************************************************************/


//===============================VARIABLES GLOBALES=============================================/

//A fin de mantener los graficos con un margen homogeneo y pudiera mantenerse un formato estandar, se definen las dimensiones del area que ocuparan todas las graficas.
var margin = {top: 10, right: 100, bottom: 80, left: 80},
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;


//==========================DEFINICION DE FUNCIONES PRINCIPALES=================================/
//
//
// Las funciones que inician con la palabra "Carga", se encargaran de leer el contenido de los datasets de los cuales obtienen los datos para cada grafico. 
// El procedimiento basicamente es el mismo para cada uno de las funciones: 
//      * Lectura del dataset en formato de CSV
//      * Formato de los datos en el dataset en caso de ser necesario
//      * Generar los ejes X y Y con base en los datos leidos previamente 
//      * Dibujar el grafico generado con base a las caracteristicas particulares de cada grafico (Barras, Area, Linea de Tendencia, etc...)
//      * Agregar los elementos de interaccion en el caso de cada grafico (Resaltar la barra, evento del mouse, etc..)
//
// Se opto por generar una funcion por cada grafico generado, ya que, a pesar de las similitudes en el proceso de generacion, las particularidades del tanto del rendering como 
// de los elementos de interaccion se vuelven complejos si se trata de generar en un solo bloque. 
//
//===============================================================================================/

function Carga_Grafico_Defunciones() {
  //===============================================================================================
  //
  // Esta funcion se encargara de dibujar el grafico de la linea de tendencia que refleja como han ido 
  // evolucionando las defunciones en Mexico a lo largo del tiempo que ha durado la pandemia.
  //
  //===============================================================================================

  // Añade el area de dibujo SVG al contenedor de la pagina web (Elemento DIV)
  var svg = d3.select("#grafica_def")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);




  d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv",
    // Lectura del dataset que contiene los datos para este grafico
    function(d){
    return { Fecha : d3.timeParse("%Y-%m-%d")(d.Fecha), Muertes : d.Muertes }
  }).then(

    //Ya con los datos se realizara la definicion de los limites del grafico.
    function(data) {
      //Se genera la escala del eje de las X de este grafico
      const x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.Fecha; }))
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
      //Se agrega una etiqueta con el nombre de la representacion de los datos del eje
        svg.append("text")     
        .attr("x", 400 )
        .attr("y",  330 )
        .style("text-anchor", "middle")
        .text("Fecha");

      //Se genera ahora la escala del eje de las Y de este grafico
      const y = d3.scaleLinear()
        .domain([0, 400000])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
      //Se genera la etiqueta de la representacion del la escala del eje de las Y.
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Defunciones");


    //Esta funcion permite definir el valor mas cercano al eje de las X de la posicion del mouse
    var bisect = d3.bisector(function(d) { return d.Fecha; }).left;

    //Este segmento genera el circulo que se dibijara al desplazar el mouse a traves de la linea de tendencia generada
    //este circulo servira para mostrar la etiqueta o tooltip con el valor a lo largo del tiempo.
    var focus = svg
      .append('g')
      .append('circle')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr('r', 8.5)
        .style("opacity", 50)

    //Se genera el texto que viajara a lo largo de la curva tan pronto se genere el tooltip 
    var focusText = svg
      .append('g')
      .append('text')
        .style("font-size", "10px")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")

      //Se genera la linea de tendencia principal del grafico 
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { return x(d.Fecha) })
          .y(function(d) { return y(d.Muertes) })
          )
  // Genera un objeto de tipo rect que cubrira el area del grafico y mismo que obtendra los eventos de movimiento del mouse. 
  // lo anterior para poder generar el tooltip que se desplazara a lo largo de la linea del grafico
  svg.append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


  // Eventos del mouse al pasar sobre el grafico. 

  function mouseover() {
  focus.style("opacity", 1)
  focusText.style("opacity",1)
  }

  function mousemove() {
  //Cuando el mouse se desplaza por el grafico, se obtienen las coordenadas X y Y del grafico para tratar de ubicar el tooltip mostrado a lo largo de la linea de grafico principal.
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

  //Cuando el mouse de desplaza fuera del area del grafico el texto desaparece
  function mouseout() {
  focus.style("opacity", 0)
  focusText.style("opacity", 0)
  }

  // Al finalizar la carga del grafico, se generara tambien la carga del dataset en formato de tabla, mismo que se mostrara en un tab separado
  // dentro de la pagina web.
  Create_Html_Table_2("Grafica2_Tabla", data, ['Fecha','Muertes']);
  })
}

function Carga_Grafico_Contagios() {
  //===============================================================================================
  //
  // Esta funcion se encargara de dibujar el grafico de area mostrando la evolucion de la tendencia de las olas
  // de contagio presentadas en Mexico durante la pandemia de COVID-19, en esta grafica se agrega la funcionalidad
  // de poder realizar un zoom a las facciones de tiempo para tener un mayor detalle en el tiempo de como se fueron
  // comportando cada una de las Olas de la pandemia.
  //
  //===============================================================================================

  //Agrega el objeto de tipo SVG al contenedor destinado para este grafico. 
  const svg = d3.select("#grafica_contagios")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);


  d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv",   
  // Realiza la lectura del archivo CSV del repositorio de GitHub
  d => {
      return { Fecha : d3.timeParse("%Y-%m-%d")(d.Fecha), Casos_Confirmados : d.Tasa_de_Contagio }
    }).then(

    //Ya con la informacion obtenida y con el formato correcto, procederemos a generar los ejes del grafico
    function(data) {
      //Se genera la escala del eje X que es basado en las fechas del dataset
      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Fecha))
        .range([ 0, width ]);
      xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      //Se agrega la etiqueta del eje de las X correspondiente a las diferentes fechas contenidas en el dataset
        svg.append("text")     
        .attr("x", 400 )
        .attr("y",  330 )
        .style("text-anchor", "middle")
        .text("Fecha");

      //Se agrega el eje de las Y en el grafico con el dato de Casos Confirmados
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Casos_Confirmados)])
        .range([ height, 0 ]);
      yAxis = svg.append("g")
        .call(d3.axisLeft(y));
      // Se agrega la etiqueta del eje de las Y referente a la escala del numero e casos confirmados
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Casos Confirmados");

      // Se agrega un area de ClipPath en la cual podremos hacer el Zoom del grafico, esta area es la misma de las dimensiones del grafico original
      // lo que sobre pase las dimensiones de este grafico, no podran dibujarse. 
      const clip = svg.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", width )
          .attr("height", height )
          .attr("x", 0)
          .attr("y", 0);

      //Se agrega la funcionalidad de brushing que es el rectangulo que dibujaremos al seleccionar el area a la cual realizaremos el Zoom. 
      const brush = d3.brushX()                   
          .extent( [ [0,0], [width,height] ] )  // Se inicializa el pbjeto de brush con los parametros 0,0 que significa que podremos seleccionar el area completa. 
          .on("end", updateChart)               // Cada vez que se termine de seleccionar el area, se ejecutara el evento de "Actualizar el grafico"

    
      const area = svg.append('g')
        .attr("clip-path", "url(#clip)")

    
      const areaGenerator = d3.area()
        .x(d => x(d.Fecha))
        .y0(y(0))
        .y1(d => y(d.Casos_Confirmados))

      // Se agregan los elementos del objeto de brushing al area del grafico.
      area.append("path")
        .datum(data)
        .attr("class", "myArea") 
        .attr("fill", "#69b3a2")
        .attr("fill-opacity", .3)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("d", areaGenerator )

      area
        .append("g")
          .attr("class", "brush")
          .call(brush);

      let idleTimeout
      function idled() { idleTimeout = null; }

      // Esta es la funcion que actualizara tanto la escala de la grafica como los datos presentados, tan pronto se termine de seleccionar el area a la 
      //cual se realizara el Zoom de los datos. 
      function updateChart(event) {

        // Obtiene las coordenadas y espacio de tiempo seleccionados.
        extent = event.selection

        // Si no se selecciono un gran area, entonces no se realizara un zoom, de otra forma, se llevara a cabo la actualizacion de los datos de la grafica.
        if(!extent){
          if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // Tiempo de espera de la transicion durante la actualizacion.
          x.domain([ 4,8])
        }else{
          x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
          area.select(".brush").call(brush.move, null) // Este codigo, remueve el cuadro de seleccion del grafico tan pronto se llevo a cabo la actualizacion del grafico.
        }

        // Se actualiza la escala del eje de los X con base a la region seleccionada
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        area
            .select('.myArea')
            .transition()
            .duration(1000)
            .attr("d", areaGenerator)
      }

      // Se añade la funcionalidad de reiniciar el grafico con el doble click del mouse. 
      svg.on("dblclick",function(){
        x.domain(d3.extent(data, d => d.Fecha))
        xAxis.transition().call(d3.axisBottom(x))
        area
          .select('.myArea')
          .transition()
          .attr("d", areaGenerator)
      });
      
      //Se realiza la carga de los datos utilizados en este grafico en una tabla a ser desplegados en un objetivo de tipo tab en la pagina de los graficos.
      Create_Html_Table_2("Grafica1_Tabla", data, ['Fecha','Casos_Confirmados']);
  })
}

function Carga_Grafico_Estados_Anio(){

//===============================================================================================
//
// Esta funcion se encargara de dibujar el grafico de barras que mostrara el nivel de Casos confirmados por estado y por año
// El año lo podremos seleccionara a traves de una lista desplegable con los años que comprende de informacion en el dataset
// En este caso nuestro dataset comprende desde el año 2020 al presente 2022.
//
//===============================================================================================
    
//Se agrega el elemento de grafica a nuestro contenedor tipo DIV donde se realizara el graficado.
var svg = d3.select("#grafica_anio_edo_contagios")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


//Se realiza la lectura de nuestro dataset que reside en el Github
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_x_AnioEstado.csv").then( function(data) {


const temp_data = data
//En la varriable allGroup se obtienen de forma unica todos los años que podremos filtrar en la grafica, en nuestro caso solo seran 3 (2020-2022)
const allGroup = new Set(data.map(d => d.Year))

//Se cargan los datos de este dataset en una tabla en un tab separado para mostrar los datos empleados para este grafico.
Create_Html_Table_2("Grafica4_Tabla", data, ['Year','Estado','Casos_Confirmados']);

//Se agregan las opciones de los diversos años al boton de lista desplegable
d3.select("#select_year_Button")
  .selectAll('myOptions')
     .data(allGroup)
  .enter()
    .append('option')
  .text(function (d) { return d; }) //Se muestra la opcion de defecto 
  .attr("value", function (d) { return d; }) // El atributo de valor, almacenara el valor seleccionado en la caja desplegable 

// A cada grupo de datos por cada año se le asignara un color distinto para diferenciar y denotar el cambio de los datos visualizados
const myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);

//Se inicializa el eje de las X con las diferentes categorias en que este caso se trata de los nombres de los estados de la republica. 
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
//Se añade la etiqueta del eje de las X.
  svg.append("text")    
  .attr("x", 400 )
  .attr("y",  330 )
  .style("text-anchor", "middle")
  .text("Estado");

// Se añade el eje de las Y con los valores de los casos confirmados por estado. 
const y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.Casos_Confirmados;})])
  .range([ height, 0 ]);
var yAxis=svg.append("g")
  .call(d3.axisLeft(y));
//Se agrega la etiqueta del eje de las Y donde se menciona la unidad de medida en este caso los casos confirmados por estado.
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Casos Confirmados");

//Se genera el tooltip que se mostrara al colocar el mouse sobre cada una de las barras de datos mostradas. 
  const tooltip = d3.selectAll("#grafica_anio_edo_contagios")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")


  // Estas son las funciones que se ejecutaran tras cualquiera de las acciones del mouse dentro del area del grafico. 
  const mouseover = function(event, d) {
    //Cuando el mouse se coloque sobre una columna determinada el tooltip se generara y mostrara la informacion de los datos confirmados en el estado seleccionado 
    // asi mismo la barra se resaltara de color negro 
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
    //Al salir el mouse de la barra seleccionada, el tooltip desaparecera y la barra volvera a su color original
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
  // Se inicializa el grafico con el valor inicial de los años en el dataset, en esta caso el primer año mostrado sera el 2020.
  update(selectedOption)

// Esta funcion se ejecutara tras seleccionar cada una de las opciones de la lista desplegable, lo que realiza basicamente es 
// * Actualizar la escala del eje de las Y para ajustarse a los nuevos datos mostrados
// * Cambiar el color de las barras del grafico 
// * Añadir los eventos del mouse a este nuevo conjunto de barras generadas.

function update(selectedGroup) {
data=temp_data;
  // Genera un nuevo dataset con el año seleccionado en la caja de seleccion.
  const dataFilter = data.filter(function(d){return d.Year==selectedGroup});
  data=dataFilter;
  // Genera el eje de las X con base a la informacion del nuevo dataset
  x.domain(data.map(d => d.Estado));
  //svg.call(d3.axisBottom(x))
 
  //Genera el eje de las Y con la nueva escala con base a los valores del nuevo dataset
    y.domain([0, d3.max(dataFilter, function(d) { return +d.Casos_Confirmados;})]);
    y.range([ height, 0 ]);
    yAxis.call(d3.axisLeft(y));
  //Dibuja las barras con la informacion del nuevo dataset 
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

//Añade los eventos del mouse a este nuevo conjunto de barras generadas.
const rect = svg
        .selectAll('.bar')
        .data(data)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
//Establece el color de las barras de acuerdo al año seleccionado en nuestro dataset. 
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

// Cuando el valor del boton de la lista desplegable se ejecuta la funcion 
d3.select("#select_year_Button").on("change", function(event,d) {
    //Se obtiene el valor seleccionado
    const selectedOption = d3.select(this).property("value")
    //Se ejecuta la funcion de actualizacion con el valor del año seleccionado como parametro.
    update(selectedOption)
})



})}

function Carga_Grafico_Estados_Def(){
//===============================================================================================
//
// Esta funcion se encargara de dibujar el grafico de barras que mostrara el nivel de defunciones por estado y por año
// El año lo podremos seleccionara a traves de una lista desplegable con los años que comprende de informacion en el dataset
// En este caso nuestro dataset comprende desde el año 2020 al presente 2022.
//
//===============================================================================================
    
//Se agrega el elemento de grafica a nuestro contenedor tipo DIV donde se realizara el graficado.
var svg = d3.select("#grafica_anio_edo_def")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


//Se obtienen los datos del dataset contenido en el repositorio de GitHub
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_x_AnioEstado.csv").then( function(data) {


const temp_data = data
// Se enlistan cada uno de los años de forma unica en el boton de lista desplegable
const allGroup = new Set(data.map(d => d.Year))

//Se genera una tabla en una pestaña aparte de la pagina web para mostrar los datos del dataset empleados para este nuevo grafico.
Create_Html_Table_2("Grafica6_Tabla", data, ['Year','Estado','Defunciones']);

//Se añaden los valos de los años obtenidos al boton de lista desplegable.
d3.select("#select_year_Button2")
  .selectAll('myOptions')
     .data(allGroup)
  .enter()
    .append('option')
  .text(function (d) { return d; }) 
  .attr("value", function (d) { return d; })

// Se añade un color para cada uno de los grupos de datos a mostrar para resaltar el cambio de datos tras la seleccion de un nuevo valor. 
const myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);

//Se genera el eje de las X con base en los valores obtenidos del dataset, en este caso cada uno de los estados de la republica. 
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
//Se añade la etiqueta del eje de las X 
  svg.append("text")     
  .attr("x", 400 )
  .attr("y",  330 )
  .style("text-anchor", "middle")
  .text("Estado");

//Se genera el eje de las Y con la escala de los valores obtenidos del dataset 
const y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.Defunciones;})])
  .range([ height, 0 ]);
var yAxis=svg.append("g")
  .call(d3.axisLeft(y));
//Se agrega la etiqueta del eje de las Y que en este caso es referente al numero de defunciones 
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Defunciones");

//Se define el objeto del tooltip que se mostrara al pasar el mouse sobre cada una de las barras seleccionadas 
  const tooltip = d3.selectAll("#grafica_anio_edo_def")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")


  // Se definen cada una de las funciones que realizaran los diferentes eventos del mouse 
  const mouseover = function(event, d) {
    //Al posicionarse el mouse sobre cada barra, se resaltara con color Cyan y se mostrara el tooltip con el detalle de las defunciones del estado que se selecciono.
    tooltip
    .html('Defunciones: ' + d3.format(",")(d.Defunciones))
    .style('opacity', 100);
    d3.select(this).transition().attr('fill', "Cyan")
  }
  const mousemove = function(event, d) {
    tooltip
           .style("left",((event.x)+50) + "px")
           .style("top",((event.y)+30) + "px")
  }
  const mouseleave = function(event, d) {
    //Cuando el mouse se sale del area de seleccion, la barra vuelve a su color original y se desaparece el tooltip.
    tooltip
      .style("opacity", 0)
      const selectedGroup=d3.select("#select_year_Button2").property("value")
      if (selectedGroup==2020){
        d3.select(this).transition().attr("fill", 'orange');}
        if (selectedGroup==2021){
        d3.select(this).transition().attr("fill", 'purple');}
        if (selectedGroup==2022){
        d3.select(this).transition().attr("fill", 'brown');}
  }



  const selectedOption = 2020
  //Se inicializa el grafico con la primer opcion de nuestro dataset que en este caso es el 2020
  update(selectedOption)

// Esta funcion se ejecutara tras seleccionar cada una de las opciones de la lista desplegable, lo que realiza basicamente es 
// * Actualizar la escala del eje de las Y para ajustarse a los nuevos datos mostrados
// * Cambiar el color de las barras del grafico 
// * Añadir los eventos del mouse a este nuevo conjunto de barras generadas.

function update(selectedGroup) {
data=temp_data;
  //Genera un nuevo dataset con los datos seleccionados de acuerdo al valor elegido en la lista desplegable.
  const dataFilter = data.filter(function(d){return d.Year==selectedGroup});
  data=dataFilter;
//Se inicializa el eje de las X con los datos del nuevo dataset, en este caso cada uno de los estados.
  x.domain(data.map(d => d.Estado));
  //svg.call(d3.axisBottom(x))

//Se inicializa el eje de las Y con el rango de valores del nuevo dataset filtrado con base en el año seleccionado 
  y.domain([0, d3.max(data, function(d) { return +d.Defunciones;})]);
  yAxis.call(d3.axisLeft(y));
  //Se dibujan las barras con base en los valores del nuevo dataset
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .transition().duration(1000)
      .attr("x", function(d) { return x(d.Estado); })
      .attr("y", function(d) { return y(d.Defunciones); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.Defunciones); });


svg.selectAll(".bar")
      .data(data)
        .attr("class", "bar")
        .transition().duration(1000)
        .attr("x", function(d) { return x(d.Estado); })
        .attr("y", function(d) { return y(d.Defunciones); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.Defunciones); });
//Se agregan los eventos del mouse a este nuevo conjunto de barras generados. 
const rect = svg
        .selectAll('.bar')
        .data(data)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

//Se asigna un color al nuevo dataset de barras basado en el valor seleccionado de la lista desplegable. 
    bars=svg.selectAll(".bar").data(data)
    if (selectedGroup==2020){
    bars
        .attr("fill", 'orange');
    }
    if (selectedGroup==2021){
    bars
        .attr("fill", 'purple');}
    if (selectedGroup==2022){
    bars
        .attr("fill", 'brown');}
        
}

// Cuando el valor del boton de la lista desplegable cambia, se ejecuta la funcion de actualizar el grafico. 
d3.select("#select_year_Button2").on("change", function(event,d) {
    //Se obtiene el valor del año seleccionado de la lista desplegable.
    const selectedOption = d3.select(this).property("value")
    // Se ejecuta la funcion de actualizar la grafica con base al nuevo valor seleccionado.
    update(selectedOption)
})



})}

function Carga_Grafico_Vacunas(){

//===============================================================================================
//
// Esta funcion se encargara de dibujar el grafico de area que mostrara la tendencia de la cantidad de vacunas aplicadas
// a nivel nacional, se mostrara de forma simple (sin interaccion) la cantidad de vacunas aplicadas a lo largo 
// de toda la duracion de la pandemia del COVID-19 en Mexico.
//
//===============================================================================================

//Se añade el objeto SVG al contenedor de DIV destinado para este graficos
const svg = d3.select("#grafica_vacunas")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

//Se leen los datos del dataset que reside en el repositorio de github
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/Covid_vaccinations_MX.csv",

// When reading the csv, I must format variables:
d => {
  return {
        Fecha: d3.timeParse("%Y-%m-%d")(d.Fecha),
        Personas_1_Vacuna : d.Personas_1_Vacuna
      }
    }).then(

function(data) {

// Se genera el eje de las X con las fechas obtenidas del dataset
const x = d3.scaleTime()
  .domain(d3.extent(data, d => d.Fecha))
  .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
//Se agrega la etiqueta del eje de las X en la grafica. 
svg.append("text")      
    .attr("x", 400 )
    .attr("y",  330 )
    .style("text-anchor", "middle")
    .text("Mes");

//Se inicializa la escala del eje de las Y, partiendo de la informacion del dataset
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => +d.Personas_1_Vacuna)])
  .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
//Se agrega la etiqueta del eje de las Y.
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Personas Vacunadas");

//Se dibuja la grafica de area en el objeto de SVG 
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

  //Se genera la tabla con la informacion del dataset empleado para esta grafica en una pestaña aparte dentro de la pagina. 
  Create_Html_Table_2("Grafica3_Tabla", data, ['Fecha','Personas_1_Vacuna']);
  })
}

function Carga_Grafico_Vacunas_3dosis(){
//===============================================================================================
//
// Esta funcion se encargara de dibujar el grafico de area que mostrara la tendencia de la cantidad de vacunas aplicadas
// a nivel nacional (3era dosis), se mostrara de forma simple (sin interaccion) la cantidad de las 3ra dosis aplicadas a lo largo 
// de toda la duracion de la pandemia del COVID-19 en Mexico.
//
//===============================================================================================

// Se agrega el objeto de dibujo de la grafica al objeto DIV para este fin dentro del HTML
const svg = d3.select("#grafica_vacunas_3Dosis")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

//Se obtiene los datos del dataset del repositorio del Github
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/Covid_vaccinations_MX.csv",

// Se realiza el formato de los datos de acuerdo a lo que necesitamos mostrar en nuestro grafico.
d => {
  return {
        Fecha: d3.timeParse("%Y-%m-%d")(d.Fecha),
        Personas_3_Dosis : d.Personas_3_Dosis
      }
    }).then(


function(data) {

//Se inicializa el vector de las X con las fechas contenidas en el dataset.
const x = d3.scaleTime()
  .domain(d3.extent(data, d => d.Fecha))
  .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
// Se agrega la etiqueta del eje de las X 
svg.append("text")      
    .attr("x", 400 )
    .attr("y",  330 )
    .style("text-anchor", "middle")
    .text("Mes");

// Se inicializa el eje de las Y con los valores obtenidos del dataset
const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => +d.Personas_3_Dosis)])
  .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
//Se genera la etiqueta del eje de las Y reflejando las personas vacunadas con la 3er dosis.
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Personas Vacunadas");

//Se dibuja el area del grafico con los datos contenidos en el dataset. 
svg.append("path")
  .datum(data)
  .attr("fill", "#cce5d")
  .attr("stroke", "#69b3a2")
  .attr("stroke-width", 1.5)
  .attr("d", d3.area()
    .x(d => x(d.Fecha))
    .y0(y(0))
    .y1(d => y(d.Personas_3_Dosis))
      )

  //Se agregan los datos del dataset empleados, para mostrarse en una tabla dentro de una pestaña a parte dentro de la misma pagina. 
  Create_Html_Table_2("Grafica5_Tabla", data, ['Fecha','Personas_3_Dosis']);
  })
}

function Carga_Grafico_Movilidad(){
//===============================================================================================
//
// Esta funcion se encargara de dibujar multiples graficos de tendencia en la misma region destinada para este 
// Este conjunto de graficos sirve para comparar diversas tendencias dentro de nuestro dataset y que 
// suceden en el mismo intervalo de tiempo y valores. Mismos que, de tratarse de visualizar todos con 
// series en un solo grafico pudiera ser complicado y restaria comprension a nuestro grafico. 
//
//===============================================================================================
// Se agrega el grafico SVG al area destinada para esta visualizacion.
const margin = {top: 30, right: 0, bottom: 40, left: 50},
    width = 300 - margin.left - margin.right,
    height = 310 - margin.top - margin.bottom;


    const svg = d3.select("#grafica_movilidad")


//Se realiza la lectura del dataset desde el repositorio de GitHub.
d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/MX_Region_Mobility_Report.csv",
//Se realiza el formato de los datos para poder mostrarlos en el grafico.
d => {
    return { Fecha : d3.timeParse("%Y-%m-%d")(d.Fecha), Lugar : d.Lugar, Porcentaje: d.Porcentaje }
  }).then( function(data) {

  //Se realiza la agrupacion de datos de acuerdo a las categorias contenidas en el dataset, en este caso las categorias las dictan los lugares de desplazamiento de Google.
  const sumstat = d3.group(data, d => d.Lugar) 


  //Se realiza un listado unico de los lugares obtenidos del dataset (6 lugares distintos.)
  allKeys = new Set(data.map(d=>d.Lugar))

  // Se añade un sub elemento SVG por cada uno de los grupos obtenidos del dataset, es decir, se generaran 6 graficos distintos, uno por cada categoria obtenida
  const svg = d3.select("#grafica_movilidad")
    .selectAll("uniqueChart")
    .data(sumstat)
    .enter()
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left},${margin.top})`);

            //Add X Axis
            const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Fecha))
            .range([ 0, width ]);
            svg.append("g")
              .attr("transform", `translate(0,${height})`)
              .call(d3.axisBottom(x))
              .selectAll("text")
              .attr("transform", "translate(-10,0)rotate(-45)")
              .style("text-anchor", "end");


  //Por cada grafica se inicializa el eje de las X
  const y = d3.scaleLinear()
    .domain([-80, d3.max(data, function(d) { return +d.Porcentaje; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5));

  // Se asigna un color a cada uno de los graficos obtenidos 
  const color = d3.scaleOrdinal()
    //.domain(allKeys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ffaf01','#a65628'])

  // Se dibuja la linea de tendencia principal de cada uno de los graficos obtenidos.
  svg
    .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){ return color(d[0]) })
      .attr("stroke-width", 1.9)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.Fecha); })
          .y(function(d) { return y(+d.Porcentaje); })
          (d[1])
      })

  //Se añade el titulo de cada grafico con base a la categoria del dataset 
  svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(function(d){ return(d[0])})
    .style("fill", function(d){ return color(d[0]) })

    // Se genera una tabla con el dataset empleado en este grafico a fin de mostrarlo en una pestaña separada.
    Create_Html_Table_2("Grafica7_Tabla", data, ['Fecha','Lugar','Porcentaje']);

})}


function openTab(evt,ParentObject, TabName) {
    //==============================================================================
    //
    // Esta funcion mostrara la pestaña seleccionada en la pagina web y ocultara el resto
    //
    // Recibe: 
    //          evt: El evento que genero el cambio de pestaña
    //          ParentObject: El id del objeto que contiene al conjunto de pestañas con las que se esta interactuando. 
    //          TabName: El nombre de la pestaña seleccionada y que se desea mostrar 
    //
    //==============================================================================
    //Varaibles locales.
    var i, tabcontent, tablinks;
  
    // Obtiene los elementos de clase "tabcontent" contenidos en el objeto padre obtenido como parametro de la funcion.
    tabcontent = document.getElementById(ParentObject).getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Obtiene los elementos de clase "tablink" contenidos en el objeto padre obtenido como parametro de la funcion.
    tablinks = document.getElementById(ParentObject).getElementsByClassName("tablinks");
  
    for (i = 0; i < tablinks.length; i++) {
        //Oculta las pestañas no seleccionadas para mostrar la que se selecciona
      tablinks[i].className = tablinks[i].className.replace("active", "");
    }
  
      //Muestra la pestaña seleccionada como activa 
    document.getElementById(TabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

function Create_Html_Table(HtmlDiv_id, temp_data, columns) {
//======================================================================
//
// Esta funcion, generara una tabla con los datos del dataset que recibe como parametro
//
// Recibe:
//          HtmlDiv_id : El nombre del objeto de tipo DIV donde se creara esta tabla 
//          data: El objeto del dataset que contiene toda la informacion que se mostrara en la tabla. 
//          columns: Arreglo de cadenas de caracteres que indican las columnas a mostrarse en la tabla. 
//
//======================================================================
	console.log(HtmlDiv_id, temp_data);
  var parseDate = d3.timeParse("%Y-%m-%d");
  var table = d3.select(HtmlDiv_id).append('table');
	var thead = table.append('thead');
	var	tbody = table.append('tbody');
	// Genera los titulos de las columnas de la tabla con base al dataset pasado como parametro.
	thead.append('tr')
	  .selectAll('th')
	  .data(columns).enter()
	  .append('th')
	    .text(function (column) { return column.replaceAll('_', ' '); })
        .style("border", "1px black solid")
        .style("padding", "5px")
        .style("background-color", "lightgray")
        .style("font-weight", "bold")
        .style("text-transform", "uppercase");

	// Genera las filas con cada uno de los registros del dataset
	var rows = tbody.selectAll('tr')
	  .data(temp_data)
	  .enter()
	  .append('tr');

	// Genera cada una de las celdas para los registros del dataset y los llena con los datos del dataset.
	var cells = rows.selectAll('td')
	  .data(function (row) {
	    return columns.map(function (column) {
        // if(column == 'Fecha') {
        //   row[column] = formatDate(row[column]);
        // } 
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

/**
 * Esta funcion, generara una tabla con los datos del dataset que recibe como parametro
 * 
 * @param {*} HtmlDiv_id El nombre del objeto de tipo DIV donde se creara esta tabla 
 * @param {*} data El objeto del dataset que contiene toda la informacion que se mostrara en la tabla. 
 * @param {*} columns Arreglo de cadenas de caracteres que indican las columnas a mostrarse en la tabla. 
 */
function Create_Html_Table_2(HtmlDiv_id, data, columns) {
    // Se inicia creando la tabla con su clase
    var tbl = '<table class="tabla">';
    // Se agrega el thead
    tbl += '<thead>';
    tbl += '<tr>';
    // Se hace un recorrido de las columnas para agregarlas al thead
    columns.forEach( item => {
      tbl += '<th>' + item.replaceAll('_', ' ') + '</th>';
    });
    tbl += '</tr>';
    tbl += '</thead>';

    // Se inicia el tbody
    tbl += '<tbody>';
    // Se realiza el recorrido de los datos
    data.forEach( item => {
      tbl += '<tr>';
      // Se insertan los datos de manera dinámica segun las columnas que se hayan mandado por parámetro
      for(var i = 0; i < columns.length; i++) {
        if(columns[i] == 'Fecha'){
          tbl += '<td>' + formatDate(item[columns[i]]) + '</td>';
        } else {
          tbl += '<td>' + item[columns[i]] + '</td>';
        }
        
      }
      tbl += '</tr>';
    })

    tbl += '</tbody>';
    tbl += '</table>';

    // Se agrega al html todo el contenido en el div que se envía por parámetro
    document.getElementById(HtmlDiv_id).innerHTML = tbl;
  }

/**
 * Esta función da formato a la fecha
 * 
 * @param {*} date El objeto de la fecha en javascript
 * @returns El formato de la fecha d/M/Y
 */
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('/');
}



//Seleccion de las tabs por defecto de las graficas
document.getElementById("Grafica1_btn1").click();
document.getElementById("Grafica2_btn1").click();
document.getElementById("Grafica3_btn1").click();
document.getElementById("Grafica4_btn1").click();
document.getElementById("Grafica5_btn1").click();
document.getElementById("Grafica6_btn1").click();
document.getElementById("Grafica7_btn1").click();

//Carga la informacion de cada uno de los graficos
Carga_Grafico_Contagios();
Carga_Grafico_Defunciones();
Carga_Grafico_Estados_Anio();
Carga_Grafico_Vacunas();
Carga_Grafico_Vacunas_3dosis();
Carga_Grafico_Estados_Def();
Carga_Grafico_Movilidad();