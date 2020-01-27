// const circleData = [25, 20, 10, 12, 15];

d3.json('../data/buildings.json')
    .then( (data) => {
        data.forEach( b => b.height = +b.height);
        console.log(data)

        let svg = d3.select('#canvas');

        let bars = svg.selectAll('rect')
            .data(data);

        let scaleY = d3.scaleLinear()
            .domain([0, 350])
            .range([0, 200])

        bars.enter()
            .append('rect')
                .attr('width', 20)
                .attr('height', d => scaleY(d.height))
                .attr('x', (d,i) => (i*28)+5)
                .attr('y', 5)
                .attr('fill', 'orange')
    })
    .catch( (err) => {
        console.log(err)
    })



// circles.enter()
//     .append('circle')
//         .attr('cx', (d,i) => (i*50)+25)
//         .attr('cy', 100)
//         .attr('r', (d,i) => d)
//         .attr('fill', 'orange')

