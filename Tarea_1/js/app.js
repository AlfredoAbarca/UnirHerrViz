
var parseDate = d3.timeParse("%m/%d/%Y");

var margin = {left: 50, right: 20, top: 20, bottom: 50 };

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


var max = 0;

var xNudge = 50;
var yNudge = 20;

var minDate = new Date();
var maxDate = new Date();




d3.csv("https://raw.githubusercontent.com/AlfredoAbarca/UnirHerrViz/main/Tarea_1/data/All_MX_Covid_Sumarized.csv");
    .row(function(d) { return { Fecha: parseDate(d.Fecha), Casos_Confirmados: Number(d.Casos_Confirmados.trim().slice(1))}; })
    .get(function(error, rows) {
	    max = d3.max(rows, function(d) { return d.price; });
	    minDate = d3.min(rows, function(d) {return d.month; });
		maxDate = d3.max(rows, function(d) { return d.month; });


		var y = d3.scaleLinear()
					.domain([0,max])
					.range([height,0]);

		var x = d3.scaleTime()
					.domain([minDate,maxDate])
					.range([0,width]);

		var yAxis = d3.axisLeft(y);

		var xAxis = d3.axisBottom(x);

		var line = d3.line()
			.x(function(d){ return x(d.month); })
			.y(function(d){ return y(d.price); })
			.curve(d3.curveCardinal);


		var svg = d3.select("id#grafica").append("svg").attr("id","svg").attr("height","100%").attr("width","100%");
		var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");

		chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(rows); })


		chartGroup.append("g")
			.attr("class","axis x")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

		chartGroup.append("g")
			.attr("class","axis y")
			.call(yAxis);



	});



