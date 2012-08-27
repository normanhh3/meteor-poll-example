Polls = new Meteor.Collection('polls');

Meteor.subscribe('polls', function() {
  var query = Polls.find({});

  query.observe({
    changed: function(poll) {
      drawChart(poll);
    }
  });

  drawChart(query.fetch()[0]);
});


var drawChart = function(poll) {
  var options  = poll.options,
    margin = {top: 25, right: 5, bottom: 5, left: 5},
    width = 550 - margin.left - margin.right,
    height = 220 - margin.top - margin.bottom;
    barsWidth = 400,
    barWidth = barsWidth / options.length,
    offset = 30,
    bulletOffset = 30,
    labelOffset = 20,
    colorScale = d3.scale.category10();

  var sum = d3.sum(options, function(d) { return d.value; });
  options.forEach(function(d){
    d.percent = d.value * 100 / sum;
  });

  var x = d3.scale.linear()
    .domain([0, options.length])
    .range([0, barsWidth]);

  var y = d3.scale.linear()
    .domain([0, 100])
    .rangeRound([0, height]);

  // Event handlers
  var optionMouseOver = function(d, i) {
    var color = 'Black';
    
    d3.select('.bar-' + i).style('fill', color);
    d3.select('.bullet-' + i).style('fill', color);
    d3.select('.label-' + i).style('fill', color);
  };

  var optionMouseOut = function(d, i) {
    var bar = d3.select('.bar-' + i);
    var color = bar.attr('color');

    bar.style('fill', color);
    d3.select('.bullet-' + i).style('fill', color);
    d3.select('.label-' + i).style('fill', 'Blue');
  };

  var optionClick = function(d, i) {
    Polls.update({ _id: poll._id, 'options.name': d.name }, { $inc: { 'options.$.value': 1 } });
  }

  
  // Draw main canvas
  var svg = d3.select('#poll').select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .select('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Draw bars
  var bar = svg.selectAll('rect')
  .data(options)
    .attr('y', function(d) { return height - y(d.percent); })
    .attr('height', function(d, i) { return y(d.percent); });
  bar.enter()
  .append('rect')
    .attr('x', function(d, i) { return x(i); })
    .attr('y', function(d) { return height - y(d.percent); })
    .attr('width', barWidth)
    .attr('height', function(d) { return y(d.percent); })
    .attr('class', function(d, i) { return 'option bar-' + i; })
    .attr('color', function(d, i) { return colorScale(i); })
    .style('fill', 'White')
    .style('stroke', 'White')
    .on('mouseover', optionMouseOver)
    .on('mouseout', optionMouseOut)
    .on('click', optionClick)
  .transition()
    .duration(150)
    .delay(function(d, i) { return i * 100; })
    .style('fill', function(d, i) { return colorScale(i); })
    .style('stroke', 'White');

  // Draw bar values
  var barValue = svg.selectAll('.value')
  .data(options)
    .text(function(d) { return d.value; })
    .attr('y', function(d) { return height - y(d.percent) - 15; })
  barValue.enter()
  .append('text')
    .attr('x', function(d, i) { return x(i) + barWidth / 2; })
    .attr('y', function(d) { return height - y(d.percent) - 15; })
    .attr('dy', '1em')
    .attr('class', 'value')
    .attr('text-anchor', 'middle')
    .text(function(d) { return d.value; });
  
  // Draw bullets
  svg.selectAll('circle').data(options).enter()
  .append('circle')
    .attr('cx', barsWidth + bulletOffset)
    .attr('cy', function(d, i) { return offset + i * 20; })
    .attr('stroke-width', '.5')
    .attr('r', 5)
    .attr('class', function(d, i) { return 'option bullet-' + i; })
    .attr('color', function(d, i) { return colorScale(i); }) 
    .style('fill', function(d, i) { return colorScale(i); })
    .on('mouseover', optionMouseOver)
    .on('mouseout', optionMouseOut)
    .on('click', optionClick);

  // Draw labels
  svg.selectAll('.label').data(options).enter()
  .append('text')
    .attr('x', barsWidth + bulletOffset + labelOffset)
    .attr('y', function(d, i) { return offset + i * 20 - 10; })
    .attr('dx', 0)
    .attr('dy', '1em')
    .attr('text-anchor', 'left')
    .attr('class', function(d, i) { return 'option label label-' + i; })
    .style('fill', 'Blue')
    .text(function(d) { return d.name; })
    .on('mouseover', optionMouseOver)
    .on('mouseout', optionMouseOut)
    .on('click', optionClick);
};
