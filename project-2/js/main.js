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

// SVG canvas element
let svg = d3.select('#chart-area')
	.append('svg')
	.attr('height', canvas.height)
	.attr('width', canvas.width)

// Visualization group (plot area)
let vis = svg.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`)

// X-scale
let xScale = d3.scaleLog()
	.domain([300, 150000])
	.range([0, plot.width])
	.base(10)

// Y-scale
let yScale = d3.scaleLinear()
	.domain([0,90])
	.range([0, plot.height])

// X-axis
let xAxis = d3.axisBottom(xScale)
	.tickValues([400, 4000, 40000])
vis.append('g')
	.attr('id', 'x-axis')
	.attr('transform', `translate(0, ${plot.height})`)
	.call(xAxis)

// Y-axis
let yAxis = d3.axisLeft(yScale)
vis.append('g')
	.attr('id', 'y-axis')
	.call(yAxis)

d3.json("data/data.json").then(function(data){	
	// Filter null values
	// data.forEach( year => {
	// 	year.countries = year.countries.filter(country => {
	// 		return country.income != null && country.life_exp != null
	// 	})
	// })

	// Grab first year in data set
	let firstYear = data.shift()
	let newData = firstYear.countries.filter(country => {
		return country.income != null && country.life_exp != null
	})

	// Year 1800, GDP: min = 350, max = 4235
	// Year 1800, Life exp: min = 23.39, max = 42.85
	
	console.log(newData);
})