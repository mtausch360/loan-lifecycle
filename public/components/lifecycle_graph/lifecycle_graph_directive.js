import tpl from './lifecycle_graph.html';

/**
 * This vis shows current balance as a function of time, and compares two lifecycles to oneanother
 * @return {[type]} [description]
 */
function lifecycleGraph(lifecycleService, $timeout) {

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
      var area;
      var basePath;
      var customPath;
      var zoom;

      window.addEventListener('resize', render);
      scope.$on('render', render);

      scope.$on('redrawCustom', function () {
        updateCustom();
      });

      scope.$on('redrawAll', function () {
        updateAxes();
        updateCustom();
        updateBase();
      });

      //shouldn't be necessary
      function timeHelper(month, day) {
        var d = new Date();
        var currMonth = d.getMonth();
        var currYear = d.getFullYear();

        var date = new Date(Math.floor((currMonth + month) / 12) + currYear, (currMonth + month) % 12, day);
        return date;
      }

      var parseDate = d3.time.format("%m/%d/%Y").parse;

      create();

      /**
       * [create description]
       * @return {[type]} [description]
       */
      function create() {

        chart = d3.select('.lifecycle-graph-container').append('svg');

        //remember to update
        xScale = d3.time.scale().domain([base.lifecycle.series.startDate, base.lifecycle.series.endDate]);

        //need to search for highest balance
        yScale = d3.scale.linear().domain([0,
          d3.max(base.lifecycle.series, (d)=>{
            return d.balance;
          });
          ]);

        xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4);

        yAxis = d3.svg.axis().scale(yScale).orient('left');

        xAxisEl = chart.append('g').classed('x-axis', true);

        yAxisEl = chart.append('g').classed('y-axis', true);

        clipPath = chart
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect');

        plotAreaEl = chart.append('g').classed('plot-area', true).attr('clip-path', 'url(#clip)');

        customSeries = plotAreaEl.append('g').classed('custom series', true).append('path').attr('class', 'line custom');

        baseSeries = plotAreaEl.append('g').classed('base series', true).append('path').attr('class', 'line base');

        line = d3.svg.line()
          // .interpolate("cardinal")
          .x((d, i)=>{
            return xScale(d.date);
          })
          .y((d)=>{
            // console.log('d y ', d, d.balance, yScale.domain(), yScale(d.balance));
            if(!yScale(d.balance))
              console.log("D>BALANCE", d.balance, yScale.domain(), yScale(d.balance));
            return yScale(d.balance);
          });

        // var area = d3.svg.area()
        //     .interpolate("step-after")
        //     .x(function(d) { return xScale(timeHelper(d.monthIndex)); })
        //     .y0(yScale(0))
        //     .y1(function(d) { return yScale(d.balance); });

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
          let yScaleMax = d3.max(base.lifecycle.series, (d)=>{
            return d.balance;
          });

          //remember to cahnge
          xScale.domain([(base.lifecycle.startDate),(base.lifecycle.endDate)]);
          yScale.domain([0, yScaleMax]);
          xAxisEl.call(xAxis);
          yAxisEl.call(yAxis);
          zoomendCb();
        };

        render();

        zoom = d3.behavior.zoom()
          .x(xScale)
          .on('zoom', zoomCb)
          .on('zoomend', zoomendCb)

        chart.call(zoom);
      }

      /**
       * [render description]
       * @return {[type]} [description]
       */
      function render() {
        width = document.getElementById('lifecycle-panel').offsetWidth || 800;
        height = Math.max(document.documentElement.clientHeight - document.getElementById('nav-bar'), 400) * .7;
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

      /**
       * [takeData description]
       * @return {[type]} [description]
       */
      function takeData() {
        drawBase();
        drawCustom();
      }

      /**
       * [drawBase description]
       * @return {[type]} [description]
       */
      function drawBase() {
        basePath = baseSeries.data([base.lifecycle.series])
          .attr('d', (d) => {
            return line(d)
          })
          .attr('stroke', 'blue');
      }

      /**
       * [drawCustom description]
       * @return {[type]} [description]
       */
      function drawCustom() {
        customPath = customSeries.data([custom.lifecycle.series])
          .attr('d', (d) => {
            return line(d)
          })
          .attr('stroke', 'red')
      }

      /**
       * [zoomCb description]
       * @return {[type]} [description]
       */
      function zoomCb() {
        render();

        let minDate = xScale.domain()[0]
        let maxDate = xScale.domain()[1];
        let max = 500; //min scale

        //update y scale max based on what's in selection
        _.each(base.lifecycle.series, function (el, i) {
          if (el.date >= minDate && el.date <= maxDate) {
            if (el.balance > max)
              max = el.balance;
          }
        });

        yScale.domain([0, max]);
      }

      /**
       * [zoomendCb description]
       * @return {[type]} [description]
       */
      function zoomendCb(){
        lifecycleService.setCurrentSelection(xScale.domain());
        $timeout();
      }

    }
  }
}




export default lifecycleGraph;
