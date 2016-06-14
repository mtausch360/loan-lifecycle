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
      let base = scope.lifecycles.base.lifecycle;
      let custom = scope.lifecycles.custom.lifecycle;
      var updateCustom;
      var updateBase;
      var updateAxes;

      create();



      scope.$on('redrawCustom', function(){
        console.log('redraw custom recieved');
          updateCustom()
      });

      scope.$on('redrawAll', function(){
        console.log('redrawAll called');
        updateAxes();
        updateCustom();
        updateBase();
      });

      function timeHelper(num){
        var d = new Date();
        var currMonth = d.getMonth();
        var currYear = d.getFullYear();

        var date = new Date( Math.floor( (currMonth + num)/12) +  currYear, (currMonth + num) % 12, 1);
        return date;
      }

      function create(){
        var width = 600;
        var height = 400;
        var margin = {
          top: 15,
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
        var xScale = d3.time.scale().domain([timeHelper( 0), timeHelper(base.series.length)]).range([0, plotArea.width]);
        var yScale = d3.scale.linear().domain([0, base.series[0].balance]).range([plotArea.height, 0]);

        var xAxis = d3.svg.axis().scale(xScale).orient('bottom')
          .ticks(4)
          // .tickSize(16, 0)
          // .tickFormat(d3.time.format("%B"));
        var yAxis = d3.svg.axis().scale(yScale).orient('left');

        var xAxisEl = chart.append('g')
          .classed('x-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top + plotArea.height) + ')' )
          .attr('width', plotArea.width)
          .call(xAxis);

        var yAxisEl = chart.append('g').classed('y-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')' )
          .call(yAxis);

        plotArea.element = chart.append('g').classed('plot-area', true)
          .attr('width', width - margin.left - margin.right )
          .attr('height', height - margin.top - margin.bottom )
          .attr('transform', 'translate(' + (margin.left) + ', ' + ( margin.top ) + ')');

        var customSeries = plotArea.element.append('g').classed('custom series', true);
        var baseSeries = plotArea.element.append('g').classed('base series', true);

        var line = d3.svg.line()
            .interpolate("cardinal")
            .x(function(d,i) { return xScale( timeHelper(d.monthIndex) ) ; })
            .y(function(d) {
              return yScale(d.balance);
            });
        var basePath;
        var customPath;

        drawBase();
        drawCustom();

        updateCustom = () => {
          customPath.remove();
          drawCustom();
        }

        updateBase = () => {
          basePath.remove();
          drawBase()
        }

        function drawBase(){
          basePath = baseSeries.datum(base.series)
            .append('path')
                .attr('class', 'line base')
                .attr('d', (d) => {
                  return line(d)
                })
                .attr('stroke', 'blue');
        }

        function drawCustom(){
          customPath = customSeries.datum(custom.series)
                    .append('path')
                        .attr('class', 'line custom')
                        .attr('d', (d) => {
                          console.log(d, line(d) );
                          return line(d)
                        })
                        .attr('stroke', 'red')
        }

        updateAxes = () => {
          xScale.domain([timeHelper(0), timeHelper( Math.max( base.series.length, custom.series.length) )  ]);
          yScale.domain([0, base.series[0].balance]);
          xAxisEl.call(xAxis);
          yAxisEl.call(yAxis);
        }
      }


    }
  }
}




export default lifecycleGraph;
