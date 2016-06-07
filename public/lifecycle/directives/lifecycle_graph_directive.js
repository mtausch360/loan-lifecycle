import tpl from './lifecycle_graph.html';

/**
 * This vis shows current balance as a function of time, and compares two lifecycles to oneanother
 * @return {[type]} [description]
 */
function lifecycleGraph() {

  return {
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs)=>{
      let base;
      let custom;
      scope.$watch('lifecycles.date', function(s, newValue, oldValue) {
          if (newValue){
            custom = scope.lifecycles.custom.lifecycle;
            base = scope.lifecycles.base.lifecycle;
            create();
          }
      });

      function create(){
        var width = 600;
        var height = 300;
        var margin = {
          top: 0,
          left: 75,
          bottom: 50,
          right: 10
        };

        var plotArea = {
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom
        };

        //create chart
        var chart = d3.select('.lifecycle-graph-container').append('svg')
          .attr('width', width)
          .attr('height', height);

        //create scales
        var xScale = d3.scale.linear().domain([0, base.series.length]).range([0, plotArea.width]);
        var yScale = d3.scale.linear().domain([0, base.series[0].balance]).range([plotArea.height, 0]);

        var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        var yAxis = d3.svg.axis().scale(yScale).orient('left');

        var xAxisEl = chart.append('g')
          .classed('x-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top + plotArea.height) + ')' )
          .attr('width', plotArea.width)
          .call(xAxis);

        var yAxisEl = chart.append('g').classed('y-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')' )
          .call(yAxis);

        var plotArea = chart.append('g').classed('plot-area', true)
          .attr('width', width - margin.left - margin.right )
          .attr('height', height - margin.top - margin.bottom )
          .attr('transform', 'translate(' + (margin.left) + ', ' + ( margin.top ) + ')');

        var customSeries = plotArea.append('g').classed('custom series', true);
        var baseSeries = plotArea.append('g').classed('base series', true);

        var line = d3.svg.line()
            .x(function(d,i) { return xScale(d.monthIndex); })
            .y(function(d) {
              return yScale(d.balance);
            })
            .interpolate("basis");


        baseSeries
            .append('path')
            .datum(base.series)
            .attr('class', 'line')
            .attr('d', function(d){
              return line(d)
            });

        customSeries
            .append('path')
            .datum(custom.series)
            .attr('class', 'line')
            .attr('d', function(d){
              return line(d)
            })
            .attr('stroke-color', 'red');
      }
    }
  }
}




export default lifecycleGraph;
