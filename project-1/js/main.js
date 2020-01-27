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

let svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', canvas.width)
    .attr('height', canvas.height)

let g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

d3.json('../data/revenues.json').then( data => {
    // Transform revenue data
    data.forEach(d => d.revenue = +d.revenue)

    // x-scale
    let scaleX = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, group.width])
        .paddingInner(0.3)
        .paddingOuter(0.3)

    // y-scale
    let scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range([group.height, 0])
    
    // x-axis
    let xAxis = d3.axisBottom(scaleX)
    g.append('g')
        .attr('transform', `translate(0, ${group.height})`)
        .call(xAxis)

    // y-axis
    let yAxis = d3.axisLeft(scaleY)
        .tickFormat(d => `$ ${d.toLocaleString()}`)
    g.append('g')
        .call(yAxis)

    g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => scaleX(d.month))
        .attr('y', d => scaleY(d.revenue))
        .attr('width', scaleX.bandwidth)
        .attr('height', d => group.height - scaleY(d.revenue))
        .attr('fill', 'orange')

    console.log(data)
})
