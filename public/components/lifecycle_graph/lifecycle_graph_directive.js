import tpl from './lifecycle_graph.html';

/**
 * This vis shows current balance as a function of time, and compares two lifecycles to oneanother
 * @return {[type]} [description]
 */
function lifecycleGraph(lifecycleService) {

  return {
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs) => {
      let base = scope.lifecycles.base.lifecycle;
      let custom = scope.lifecycles.custom.lifecycle;
      var updateCustom;
      var updateBase;
      var updateAxes;
      var width;
      var height;
      var margin;
      var plotArea;
      var plotAreaEl;

      var defs; //not used
      var clipPath;

      var chart;
      var xScale;
      var yScale;
      var xAxis;
      var yAxis;
      var xAxisEl;
      var yAxisEl;
      var customSeries;
      var baseSeries;
      var line;
      var basePath;
      var customPath;
      var zoom;

      create();

      window.addEventListener('resize', render);
      scope.$on('render', render);

      scope.$on('redrawCustom', function () {
        console.log('redraw custom recieved');
        updateCustom()
      });

      scope.$on('redrawAll', function () {
        console.log('redrawAll called');
        updateAxes();
        updateCustom();
        updateBase();
      });

      function timeHelper(month, day = 1) {
        var d = new Date();
        var currMonth = d.getMonth();
        var currYear = d.getFullYear();

        var date = new Date(Math.floor((currMonth + month) / 12) + currYear, (currMonth + month) % 12, day);
        return date;
      }

      function render() {
        width = document.getElementById('lifecycle-panel').offsetWidth || 800;
        height = width * .5;
        margin = {
          top: 15,
          left: 75,
          bottom: 50,
          right: 10
        };

        plotArea = {
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom
        };

        //create chart
        chart
          .attr('width', width)
          .attr('height', height);

        xScale.range([0, plotArea.width]);
        yScale.range([plotArea.height, 0]);

        xAxisEl
          .classed('x-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top + plotArea.height) + ')')
          .attr('width', plotArea.width)
          .call(xAxis);

        yAxisEl
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          .call(yAxis);

        clipPath
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width - margin.left - margin.right)
          .attr('height', height - margin.top - margin.bottom)
          // .attr('transform', 'translate(' + (margin.left) + ', ' + (margin.top) + ')');

        plotAreaEl
          .attr("clip-path", "url(#clip)")
          .attr('width', width - margin.left - margin.right)
          .attr('height', height - margin.top - margin.bottom)
          .attr('transform', 'translate(' + (margin.left) + ', ' + (margin.top) + ')');


        drawBase();
        drawCustom();
      }

      function create() {

        //create chart
        chart = d3.select('.lifecycle-graph-container').append('svg');

        //create scales
        xScale = d3.time.scale().domain([timeHelper(0), timeHelper(base.series.length)]);

        //need to search for highest balance
        yScale = d3.scale.linear().domain([0, base.series[0].balance]);

        xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4);

        yAxis = d3.svg.axis().scale(yScale).orient('left');

        xAxisEl = chart.append('g').classed('x-axis', true);

        yAxisEl = chart.append('g').classed('y-axis', true);

        clipPath = chart
          .append('clipPath')
            .attr('id', 'clip')
            .append('rect');

        plotAreaEl = chart.append('g').classed('plot-area', true).attr('clip-path', 'url(#clip)');

        customSeries = plotAreaEl.append('g').classed('custom series', true);
        baseSeries = plotAreaEl.append('g').classed('base series', true);

        line = d3.svg.line()
          .interpolate("cardinal")
          .x(function (d, i) {
            return xScale(timeHelper(d.monthIndex)); })
          .y(function (d) {
            return yScale(d.balance);
          });

        //should be moved
        updateCustom = () => {
          customPath.remove();
          drawCustom();
        };

        updateBase = () => {
          basePath.remove();
          drawBase()
        };

        updateAxes = () => {
          xScale.domain([timeHelper(0), timeHelper(Math.max(base.series.length, custom.series.length))]);
          yScale.domain([0, base.series[0].balance]);
          xAxisEl.call(xAxis);
          yAxisEl.call(yAxis);
        };

        render();

        zoom = d3.behavior.zoom()
          .x(xScale)
          // .scaleExtent(xScale.range())
          // .translate([plotArea.width / 2, plotArea.height / 2])
          .on('zoom', zoomed);

        chart.call(zoom);


      }

      function drawBase() {
        if (basePath) basePath.remove()
        basePath = baseSeries.datum(base.series)
          .append('path')
            .attr('class', 'line base')
            .attr('d', (d) => {
              return line(d)
            })
            .attr('stroke', 'blue');
      }

      function drawCustom() {
        if (customPath) customPath.remove()
        customPath = customSeries.datum(custom.series)
          .append('path')
            .attr('class', 'line custom')
            .attr('d', (d) => {
              return line(d)
            })
            .attr('stroke', 'red')
      }

      function zoomed(){
        render();

        let minDate = xScale.domain()[0]
        let maxDate = xScale.domain()[1];
        let max = 500; //min scale

        //update y scale max based on what's in selection
        _.each(base.series, function(el, i){
          let elDate = timeHelper( el.monthIndex );
          if(  elDate >= minDate && elDate <= maxDate ){
            if( el.balance > max)
              max = el.balance;
          }
        });

        yScale.domain([0, max]);
      }


    }
  }
}




export default lifecycleGraph;
