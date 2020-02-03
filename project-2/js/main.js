/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const canvas = { height: 400, width: 600 }
const margin = { left: 100, right: 10, top: 10, bottom: 100 }
const plot = { 
	height: canvas.height - margin.top - margin.bottom,
	width: canvas.width - margin.left - margin.right
}

// SVG canvas and visualization group elements
let g = d3.select('#chart-area')
	.append('svg')
		.attr('height', canvas.height)
		.attr('width', canvas.width)
	.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)

// Scales
let x = d3.scaleLog()
	.base(10)	
	.domain([300, 150000])
	.range([0, plot.width])
let y = d3.scaleLinear()
	.domain([0,90])
	.range([plot.height, 0])

// Axis
let xAxis = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d => `$ ${d.toLocaleString()}`) // Have to use tickFormat() when using log scale (if tick values are not base 10)
g.append('g')
	.attr('id', 'x-axis')
	.attr('transform', `translate(0, ${plot.height})`)
	.call(xAxis)
let yAxis = d3.axisLeft(y)
g.append('g')
	.attr('id', 'y-axis')
	.call(yAxis)

// Labels
let xLabel = g.append('text')
	.attr('x', plot.width / 2)
	.attr('y', plot.height + 50)
	.attr('text-anchor', 'middle')
	.text('GDP Per Capita ($)')
let yLabel = g.append('text')
	.attr('x', -(plot.height / 2))
	.attr('y', -50)
	.attr('transform', 'rotate(-90)')
	.attr('text-anchor', 'middle')
	.text('Life Expectancy (Years)')
let timeLabel = g.append("text")
	.attr("y", plot.height - 10)
	.attr("x", plot.width - 40)
	.attr("font-size", "40px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text("1800");

d3.json("data/data.json").then(function(data){	
	// Filter null values
	// data.forEach( year => {
	// 	year.countries = year.countries.filter(country => {
	// 		return country.income != null && country.life_exp != null
	// 	})
	// })

	// Get data for first year (1800) in data set
	// Year 1800, GDP: min = 350, max = 4235
	// Year 1800, Life exp: min = 23.39, max = 42.85	
	let firstYr = data.shift()
	let firstYrData = firstYr.countries.filter(country => {
		return country.income != null && country.life_exp != null
	})

	let circles = g.selectAll('circle')
		.data(firstYrData, d => d.country)
		.enter()
		.append('circle')
		.attr('fill', 'grey')
		.attr('r', 5)
		.attr('cx', d => x(d.income))
		.attr('cy', d => y(d.life_exp))
	
	console.log(firstYrData);
})