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

// Show 'revenue' data if true, else show 'profit' data
let flag = true;

// Smooth transition switching between 'revenue' and 'profit' data
let t = d3.transition().duration(750)

// Canvas
let svg = d3.select('#chart-area')
    .append('svg')
    .attr('width', canvas.width)
    .attr('height', canvas.height)

// Visualization group (plot area)
let g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

// x-scale
let xScale = d3.scaleBand()
    .range([0, group.width])
    .paddingInner(0.3)
    .paddingOuter(0.3)

// y-scale
let yScale = d3.scaleLinear()
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
let yLabel = g.append('text')
    .attr('x', -(group.height / 2))
    .attr('y', -(margin.left / 2 + 20))
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Revenue') 

d3.json('../data/revenues.json').then( data => {
    // Transform revenue data
    data.forEach(d => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
    })

    d3.interval( () => {
        let newData = flag ? data : data.slice(1)
        update(newData)
        flag = !flag
    }, 1000)

    update(data)
})

function update(data) {
    let val = flag ? 'revenue' : 'profit'
    
    // update domains
    xScale.domain(data.map(d => d.month))
    yScale.domain([0, d3.max(data, d => d[val])])

    // update axes
    let xAxis = d3.axisBottom(xScale)
    xAxisGroup.transition(t).call(xAxis)

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d => `$ ${d.toLocaleString()}`)
    yAxisGroup.transition(t).call(yAxis)
    let label = flag ? 'Revenue' : 'Profit'
    yLabel.transition(t).text(label)

    // JOIN new data with old elements
    let rects = g.selectAll('circle')
        .data(data, d => d.month)
    
    // EXIT (remove) old elements not present in new data
    rects.exit()
        .attr('fill', 'red')
        .transition(t)
            .attr('cy', yScale(0))
            .attr('height', 0)
            .remove()
        
    // ENTER new elements present in new data
    rects.enter()
        .append('circle')
        .attr('fill', 'grey')
        .attr('cy', yScale(0))
        .attr('cx', d => xScale(d.month) )
        .attr('r', 5)
        // AND UPDATE old elements present in new data
        .merge(rects)
        .transition(t)
            .attr('cx', d => xScale(d.month))
            .attr('cy', d => yScale(d[val]))

    console.log(rects)

}
