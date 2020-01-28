/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

const canvas = { height: 400, width: 600 }
const margin = { left: 100, right: 10, top: 10, bottom: 100 }
const group = { 
    width: canvas.width - margin.left - margin.right,
    height: canvas.height - margin.top - margin.bottom
}

// Canvas
let svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', canvas.width)
    .attr('height', canvas.height)

// Visualization group (plot area)
let g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

// x-scale
let scaleX = d3.scaleBand()
    .range([0, group.width])
    .paddingInner(0.3)
    .paddingOuter(0.3)

// y-scale
let scaleY = d3.scaleLinear()
    .range([group.height, 0])

// x-axis group
let xAxisGroup = g.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${group.height})`)

// y-axis group
let yAxisGroup = g.append('g')
    .attr('id', 'y-axis')

// x-axis label
g.append('text')
    .attr('x', (group.width / 2))
    .attr('y', group.height + 50)
    .attr('text-anchor', 'middle')
    .text('Month')

// y-axis label
g.append('text')
    .attr('x', -(group.height / 2))
    .attr('y', -(margin.left / 2 + 20))
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Revenue') 

d3.json('../data/revenues.json').then( data => {
    // Transform revenue data
    data.forEach(d => d.revenue = +d.revenue)

    d3.interval( () => {
        update(data);
        console.log('update')
    }, 1000)

    update(data)
})

function update(data) {
    // update domains
    scaleX.domain(data.map(d => d.month))
    scaleY.domain([0, d3.max(data, d => d.revenue)])

    // update axes
    let xAxis = d3.axisBottom(scaleX)
    xAxisGroup.call(xAxis)

    let yAxis = d3.axisLeft(scaleY)
        .tickFormat(d => `$ ${d.toLocaleString()}`)
    yAxisGroup.call(yAxis)

    // JOIN new data with old elements
    let rects = g.selectAll('rect')
        .data(data)
    
    // EXIT (remove) old elements not present in new data
    rects.exit().remove()

    // UPDATE old elements present in new data
    rects.attr('x', d => scaleX(d.month))
        .attr('y', d => scaleY(d.revenue))
        .attr('width', scaleX.bandwidth)
        .attr('height', d => group.height - scaleY(d.revenue))
    
    // ENTER new elements present in new data
    rects.enter()
        .append('rect')
        .attr('x', d => scaleX(d.month))
        .attr('y', d => scaleY(d.revenue))
        .attr('width', scaleX.bandwidth)
        .attr('height', d => group.height - scaleY(d.revenue))
        .attr('fill', 'orange')

    console.log(rects)

}
