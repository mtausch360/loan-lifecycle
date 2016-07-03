import tpl from './lifecycle_graph.html';

/**
 * This vis shows current balance as a function of time, and compares two lifecycles to oneanother
 * @return {[type]} [description]
 */
function lifecycleGraph(lifecycleService, $timeout, $filter) {

  return {
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs) => {
      let dateFilter = $filter('date');
      let numberFilter = $filter('number');

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

      var svg;
      var background;
      var xScale;
      var yScale;
      var pointScale;
      var xAxis;
      var yAxis;
      var xAxisEl;
      var yAxisEl;
      var customContainer;
      var baseContainer;
      var customSeries;
      var baseSeries;
      var line;
      var area;
      var basePath;
      var customPath;
      var zoom;
      var tooltip;

      var totalXLengthMs;
      var currentSelectionLengthMs;
      const THREE_MONTHS_MILLI = 1000 * 60 * 60 * 24 * 7 * 4.5 * 3;


      window.addEventListener('resize', render);
      scope.$on('render', render);

      scope.$on('redrawCustom', function () {
        removePaymentCircles('custom')
        drawCustom();
        drawPayments();
        setCurrentSelection();
      });

      scope.$on('redrawAll', function () {

      });

      var parseDate = d3.time.format("%m/%d/%Y");

      create();

      function redrawAll(){
        updateAxes();
        updateCustom();
        updateBase();
      }

      /**
       * [create description]
       * @return {[type]} [description]
       */
      function create() {

        svg = d3.select('.lifecycle-graph-container').append('svg');

        xScale = d3.time.scale().domain([base.lifecycle.startDate, base.lifecycle.endDate]);
        yScale = d3.scale.linear().domain([0,
          d3.max(base.lifecycle.series, (d)=>{
            return d.balance;
          })
          ]);

        totalXLengthMs = base.lifecycle.endDate.getTime() - base.lifecycle.startDate.getTime();

        pointScale = d3.scale.linear().domain([ totalXLengthMs ,THREE_MONTHS_MILLI/2]).range([-50, 8]);

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

        customContainer = plotAreaEl.append('g').classed('custom series', true);
        customSeries = customContainer.append('path').attr('class', 'line custom');

        baseContainer = plotAreaEl.append('g').classed('base series', true);
        baseSeries = baseContainer.append('path').attr('class', 'line base');

        tooltip = d3.select("body").append("div")
            .attr("class", "lifecycle-graph-tooltip lifecycle-tooltip")
            .style("display", "none");

        line = d3.svg.line()
          .interpolate("step-after")
          .x((d, i)=>{

            return xScale( d.date );
          })
          .y((d, i)=>{
            return yScale(d.balance);
          });

        render();


        zoom = d3.behavior.zoom()
          .x(xScale)
          // .scaleExtent([1, 40])
          .on('zoom', zoomCb)
          .on('zoomend', zoomendCb)

        background.call(zoom);

        //not exactly sure why this works
        setTimeout(setCurrentSelection, 1);
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

        xScale.range([0, plotArea.width]);
        yScale.range([plotArea.height, 0]);

        svg
          .attr('width', width)
          .attr('height', height);

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
       * [updateScales description]
       * @return {[type]} [description]
       */
      function updateScales(){
        let minDate = xScale.domain()[0]
        let maxDate = xScale.domain()[1];
        let max = 1000; //min scale
        let min;
        //update y scale max based on what's in selection
        _.each(base.lifecycle.series, (el, i)=>{
          if (el.date >= minDate && el.date <= maxDate) {
            if (el.balance > max)
              max = el.balance;
            if( el.balance < min || min === undefined){
              min = el.balance;
            }
          }
        });

        _.each(custom.lifecycle.series, (el)=>{
          if (el.date >= minDate && el.date <= maxDate) {
            if (el.balance > max)
              max = el.balance;
            if( el.balance < min || min === undefined){
              min = el.balance;
            }
          }
        })
        min += -(min/4);
        yScale.domain([Math.max(min,0), max + max/4]);
      }
      /**
       * [zoomCb description]
       * @return {[type]} [description]
       */
      function zoomCb() {
        currentSelectionLengthMs = xScale.domain()[1].getTime() - xScale.domain()[0].getTime();
        render();
        updateScales()
        updateAxes();
      }

      /**
       * [zoomendCb description]
       * @return {[type]} [description]
       */
      function zoomendCb(){
        setCurrentSelection();
      }

      /**
       * [setCurrentSelection description]
       * @return {[type]} [description]
       */
      function setCurrentSelection(){
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
        xAxisEl.call(xAxis);
        yAxisEl.transition().duration(250).ease().call(yAxis);
      }


      /**
       * [drawPayments description]
       * @return {[type]} [description]
       */
      function drawPayments(){

        let customPayments = custom.search(xScale.domain(), true);
        let basePayments = base.search(xScale.domain(), true);

        drawPaymentCircle(customPayments, 'custom');
        drawPaymentCircle(basePayments, 'base');
      }

      /**
       * [drawPaymentCircle description]
       * @param  {[arr]} payments [array of series dates]
       * @return {[type]}          [description]
       */
      function drawPaymentCircle(payments, identifier){
        let classStr = '.' + identifier;
        let container = identifier === "custom" ? customContainer : baseContainer;
        const maxPaymentsAllowed = 250

        if( payments.length <= maxPaymentsAllowed ){

          let paymentCircles = container.selectAll(classStr + '-payment-circle').data(payments)

          paymentCircles.enter()
            .append('circle')
              .classed(identifier + '-payment-circle', true)
              .on('mouseenter', mouseEnter)
              .on('mouseout', mouseOut);

          updatePaymentCircles(paymentCircles);

          paymentCircles.exit().remove();

        } else {
          container.selectAll(classStr + '-payment-circle').remove()
        }

      }

      /**
       * [removePaymentCircles description]
       * @return {[type]} [description]
       */
      function removePaymentCircles(identifier){
        let container = identifier === "custom" ? customContainer : baseContainer;
        let paymentCircles = container.selectAll( '.' + identifier + '-payment-circle').remove()
      }


      /**
       * [updatePaymentCircles description]
       * @param  {[type]} sel [description]
       * @return {[type]}     [description]
       */
      function updatePaymentCircles(sel){
        sel
          .attr('cx', (d)=>{
            // console.log('here', d);
            return xScale(d.date)
          })
          .attr('cy', (d)=>{
            return yScale(d.balance)
          })
          .attr('r', ()=> Math.max(pointScale(currentSelectionLengthMs), 0) )
      }

      /**
       * [mouseEnter description]
       * @param  {[type]} d [description]
       * @return {[type]}   [description]
       */
      function mouseEnter(d, i){
        let circle = d3.select(this);

        circle.transition().duration(250).attr('r', (2 * circle.attr('r')) );

        var HTML = "<div>" + dateFilter(d.date, 'mediumDate') + "</div>"
        HTML += "<div>Balance $" + numberFilter(d.balance, 2) + '</div>';
        HTML += "<div>" + d.payments + ' payment' + (d.payments !== 1 ? 's' : '') + '</div>';
        HTML += "<div>$" + numberFilter(d.amountPaid, 2) + ' paid' + '</div>';

        tooltip
          .style('display', 'block')
          .html(HTML)
          .style("left", (d3.event.pageX + 10 ) + "px")
          .style("top", (d3.event.pageY -  100 ) + "px");

      }

      /**
       * [mouseOut description]
       * @return {[type]} [description]
       */
      function mouseOut(){
        let circle = d3.select(this);
        circle.transition().duration(250).attr('r', pointScale(currentSelectionLengthMs) );
        tooltip.style('display', 'none').html('');
      }

    }
  }
}




export default lifecycleGraph;
