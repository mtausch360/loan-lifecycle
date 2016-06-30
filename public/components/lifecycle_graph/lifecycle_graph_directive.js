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
      let customEl;
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

      var svg;
      var background;
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

      var parseDate = d3.time.format("%m/%d/%Y");

      create();

      /**
       * [create description]
       * @return {[type]} [description]
       */
      function create() {

        svg = d3.select('.lifecycle-graph-container').append('svg');

        //remember to update
        xScale = d3.time.scale().domain([base.lifecycle.startDate, base.lifecycle.endDate]);

        //need to search for highest balance
        yScale = d3.scale.linear().domain([0,
          d3.max(base.lifecycle.series, (d)=>{
            return d.balance;
          })
          ]);

        xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4);

        yAxis = d3.svg.axis().scale(yScale).orient('left');

        xAxisEl = svg.append('g').classed('x-axis', true);

        yAxisEl = svg.append('g').classed('y-axis', true);

        clipPath = svg
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect');

        background = svg.append('rect').classed('background', true);

        plotAreaEl = svg.append('g').classed('plot-area', true).attr('clip-path', 'url(#clip)');
        customEl = plotAreaEl.append('g').classed('custom series', true)
        customSeries = customEl.append('path').attr('class', 'line custom');

        baseSeries = plotAreaEl.append('g').classed('base series', true).append('path').attr('class', 'line base');

        line = d3.svg.line()
          .interpolate("cardinal")
          .x((d, i)=>{

            return xScale( d.date );
          })
          .y((d, i)=>{
            return yScale(d.balance);
          });

        render();

        zoom = d3.behavior.zoom()
          .x(xScale)
          .on('zoom', zoomCb)
          .on('zoomend', zoomendCb)

        background.call(zoom);
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

        //create svg
        svg
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

        background
          .attr('width', width - margin.left - margin.right)
          .attr('height', height - margin.top - margin.bottom)
          .attr('transform', 'translate(' + (margin.left) + ', ' + (margin.top) + ')');



        drawBase();
        drawCustom();

        drawPayments();

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


      /**
       * [updateCustom description]
       * @return {[type]} [description]
       */
      function updateCustom (){
        customPath.remove();
        drawCustom();
      }

      /**
       * [updateBase description]
       * @return {[type]} [description]
       */
      function updateBase (){
        basePath.remove();
        drawBase()
      }

      /**
       * [updateAxes description]
       * @return {[type]} [description]
       */
      function updateAxes (){
        let yScaleMax = d3.max(base.lifecycle.series, (d)=>{
          return d.balance;
        });

        xScale.domain([(base.lifecycle.startDate),(base.lifecycle.endDate)]);
        yScale.domain([0, yScaleMax]);
        xAxisEl.call(xAxis);
        yAxisEl.call(yAxis);
        zoomendCb();
      }

      const SIX_MONTHS_MILLI = 1000 * 60 * 60 * 24 * 7 * 4.5 * 6;
      function drawPayments(){
        // let [min, max] = xScale.domain();

        // if( max.getTime() - min.getTime() <  SIX_MONTHS_MILLI ){
        //   d3.selectAll('custom-payment-circle').remove();
        //   let customFrame = custom.search([min, max], true);
        //   console.log('custom Frame', customFrame, [min, max]);
        //   let customPayments = plotAreaEl.select('.custom').data(customFrame)
        //       .append('circle')
        //         .classed('custom-payment-circle', true)
        //         .attr('cx', (d)=>{
        //           console.log('here', d);
        //           return xScale(d.date)
        //         })
        //         .attr('cy', (d)=>{
        //           return yScale(d.balance)
        //         })
        //         .attr('r', 5)
        // }
      };


    }
  }
}




export default lifecycleGraph;
