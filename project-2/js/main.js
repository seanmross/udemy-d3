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
	.domain([142, 150000])
	.range([0, plot.width])
let y = d3.scaleLinear()
	.domain([0,90])
	.range([plot.height, 0])
let area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25*Math.PI, 1500*Math.PI])
let fill = d3.scaleOrdinal(d3.schemeSet2)

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

// Legend
const continents = ["africa", "americas", "asia", "europe"]
let legend = g.append('g')
	.attr('transform', `translate(${plot.width - 10}, ${plot.height - 125})`)
continents.forEach( (continent, i) => {
	let row = legend.append('g')
		.attr('transform', `translate(0, ${i * 20})`)
	row.append('rect')
		.attr('height', 10)
		.attr('width', 10)
		.attr('fill', fill(continent))
	
	row.append('text')
		.attr('x', -10)	
		.attr('y', 10)
		.attr('text-anchor', 'end')
		.style('text-transform', 'capitalize')
		.text(continent)
})

// Tooltip
let tip = d3.tip()
	.attr('class', 'd3-tip')
	.html( d => {
		return `<strong>Country:</strong> <span style='color:red'>${d.country}</span><br>
			<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>${d.continent}</span><br>
			<strong>Life Expectancy:</strong> <span style='color:red'>${d3.format('.0f')(d.life_exp)}</span><br>
			<strong>GDP Per Capita:</strong> <span style='color:red'>${d3.format('$,.0f')(d.income)}</span><br>
			<strong>Population:</strong> <span style='color:red'>${d3.format(',')(d.population)}</span><br>`
	})
g.call(tip);

let time = 0;
let _data, interval;

d3.json("data/data.json").then((data) => {	
	// Filter null values
	_data = data.map( year => {
		year.countries = year.countries.filter(country => {
			return country.income != null && country.life_exp != null
		})
		return year;
	})

	// Show first year data on page load
	update(_data[time]['countries'])
})

$('#play-btn')
	.on('click', function(){
		let btn = $(this);
		if (btn.text() == 'Play') {
			btn.text('Pause');
			interval = setInterval(step, 100);
		} else {
			btn.text('Play');
			clearInterval(interval);
		}
	});

$('#reset-btn')
	.on('click', function(){
		time = 0;
		update(_data[time]['countries'])
	})

$('#continent-select')
	.on('change', function(){
		update(_data[time]['countries'])
	})

$('#slider').slider({
	min: 1800,
	max: 2014,
	step: 1,
	value: 50,
	slide: function(event, ui) {
		time = ui.value - 1800;
		update(_data[time]['countries'])
	}
})

function step() {
	// Play on loop
	if (!_data[time]) {
		time = 0;
	}
	update(_data[time]['countries']);
	time++;
}

function update(data) {
	// Transition for updating elements
	const t = d3.transition().duration(100)

	// Filter by continent selected
	let continent = $('#continent-select').val()
	data = data.filter( data => {
		if (continent == 'all') {
			return true;
		} else {
			return data.continent == continent;
		}
	})

	// JOIN new data with old elements
	let circles = g.selectAll('circle')
		.data(data, d => d.country)

	// EXIT (remove) old elements not present in new data
	circles.exit()
		.transition(t)
			.attr('r', 0)
			.remove()

	// ENTER new elements present in new data
	circles
		.enter()
		.append('circle')
		.attr('fill', d => fill(d.continent))
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)
		.attr('cx', d => x(d.income))
		.attr('cy', d => y(d.life_exp))
		.attr('r',  0)
		// AND UPDATE old elements present in new data
		.merge(circles)
		.transition(t)
			.attr('r', d => Math.sqrt(area(d.population) / Math.PI))
			.attr('cx', d => x(d.income))
			.attr('cy', d => y(d.life_exp))
	
	// Update year label
	timeLabel.text(_data[time]['year']);

	// Update slider year label
	$('#year')[0].innerHTML = +(time + 1800)

	// Update slider position while playing
	$('#slider').slider('value', +(time + 1800))
}
