/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + 
        ", " + margin.top + ")");

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
// For tooltip
var bisectDate = d3.bisector(function(d) { return d.year; }).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Y-Axis tick format
var formatSi = d3.format(".2s");
function formatAbbreviation(x) {
    var s = formatSi(x);
    switch (s[s.length - 1]) {
        case "G": return s.slice(0, -1) + "B";
        case "k": return s.slice(0, -1) + "K";
    }
    return s;
}

// Axis generators
var xAxisCall = d3.axisBottom()
    .ticks(4)
var yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(function(d) { return formatAbbreviation(d); });

// Axis groups
var xAxis = g.append("g")
    .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
    .attr("class", "y axis")

// Y-Axis label
let xLabel = g.append("text")
    .attr('x', width / 2)
    .attr("y", height + 50)
    .attr('text-anchor', 'middle')
    .attr('font-size', '20px')
    .attr("fill", "#5D6971")
    .text("Time");

// Y-Axis label
let yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr('x', -(height / 2))
    .attr("y", -50)
    .attr('text-anchor', 'middle')
    .attr('font-size', '20px')
    .attr("fill", "#5D6971")
    .text("Price (USD))");


let filteredData = {};

d3.json("data/coins.json").then(function(data) {
    // Data cleaning
    for (let coin in data) {
        filteredData[coin] = data[coin].filter(d => {
            return d['24h_vol'] != null && 
                d.market_cap != null && 
                d.price_usd != null;
        })
        filteredData[coin].forEach(d => {
            d['24h_vol'] = +d['24h_vol'];
            d.date = parseTime(d.date);
            d.market_cap = +d.market_cap;
            d.price_usd = +d.price_usd; 
        })
    }

    // Using only Bitcoin data
    filteredData = filteredData['bitcoin']
    // console.log(filteredData)
    
    // Set scale domains
    x.domain(d3.extent(filteredData, function(d) { return d.date; }));
    y.domain([
        d3.min(filteredData, function(d) { return d.price_usd; }) / 1.005, 
        d3.max(filteredData, function(d) { return d.price_usd; }) * 1.005
    ]);

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x))
    yAxis.call(yAxisCall.scale(y))

    // Line path generator
    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.price_usd); });

    // Add line to chart
    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-with", "3px")
        .attr("d", line(filteredData));

    /******************************** Tooltip Code ********************************/

    // var focus = g.append("g")
    //     .attr("class", "focus")
    //     .style("display", "none");

    // focus.append("line")
    //     .attr("class", "x-hover-line hover-line")
    //     .attr("y1", 0)
    //     .attr("y2", height);

    // focus.append("line")
    //     .attr("class", "y-hover-line hover-line")
    //     .attr("x1", 0)
    //     .attr("x2", width);

    // focus.append("circle")
    //     .attr("r", 7.5);

    // focus.append("text")
    //     .attr("x", 15)
    //     .attr("dy", ".31em");

    // g.append("rect")
    //     .attr("class", "overlay")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("mouseover", function() { focus.style("display", null); })
    //     .on("mouseout", function() { focus.style("display", "none"); })
    //     .on("mousemove", mousemove);

    // function mousemove() {
    //     var x0 = x.invert(d3.mouse(this)[0]),
    //         i = bisectDate(data, x0, 1),
    //         d0 = data[i - 1],
    //         d1 = data[i],
    //         d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    //     focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
    //     focus.select("text").text(d.value);
    //     focus.select(".x-hover-line").attr("y2", height - y(d.value));
    //     focus.select(".y-hover-line").attr("x2", -x(d.year));
    // }


    /******************************** Tooltip Code ********************************/

});

function update() {
    
}

