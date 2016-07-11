/**
 * basic factory for lifecycle graphs
 *
 * @returns object with basic functionality hooks, rendering, updating and hooks into zoomEnd function
 */
function LifecycleGraphFactory({ selectionCb }={}){
  let _state = {
    created: false,
    udpated: false
  };
  //placeholding functions
  let dateFilter = (x) => x;
  let numberFilter = (x) => x;

  const THREE_MONTHS_MILLI = 1000 * 60 * 60 * 24 * 7 * 4.5 * 3;
  const maxPaymentsVisible = 250;

  var svg;
  var width;
  var height;
  var margin;
  var plotArea;
  var plotAreaEl;
  var defs;
  var clipPath;

  var background;
  var xScale;
  var yScale;
  var pointScale;
  var xAxis;
  var yAxis;
  var xAxisEl;
  var yAxisEl;
  var updateAxes;
  var line;
  var area;
  var zoom;
  var zoomExtent = {x: [null, null]}; //not correct
  var tooltip;

  //variables for two lifecycle classes, get filled in update
  let baseLifecycle;
  let baseRoot;

  let customLifecycle;
  let customRoot;

  //container is the representative of the whole lifecycle visualization: payments, interest and the path
  var customContainer;
  var baseContainer;

  //refers to actual path element inside of series container
  var basePath;
  var customPath;

  var drawBase;
  var drawCustom;

  var totalXLengthMs;
  var currentSelectionLengthMs;

  var parseDate = d3.time.format("%m/%d/%Y");
  let instance = {
    create,
    render,
    update,
    // updateBase,
    // updateCustom,
    // getCurrentSelection
  };

  return instance;

  /**
   * Creates chart svg on dom, assigns variables, prereq to call update or render,
   * should only be called once
   */
  function create() {

    svg = d3.select('.lifecycle-graph-container').append('svg');

    xScale = d3.time.scale();
    yScale = d3.scale.linear();

    pointScale = d3.scale.linear();

    xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(4);

    yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(5);

    xAxisEl = svg.append('g').classed('x-axis axis', true);

    yAxisEl = svg.append('g').classed('y-axis axis', true);

    clipPath = svg
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect');

    background = svg.append('rect').classed('background', true);

    plotAreaEl = svg.append('g').classed('plot-area', true).attr('clip-path', 'url(#clip)');

    customContainer = plotAreaEl.append('g').classed('custom series', true);
    customPath = customContainer.append('path').attr('class', 'line custom');

    baseContainer = plotAreaEl.append('g').classed('base series', true);
    basePath = baseContainer.append('path').attr('class', 'line base');

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

    _state.created = true;

    return instance;
  }

  /**
   * Renders graph with already in scope data, sets height and width, gives ranges to x and y scales
   *   - probs should take width/height as input
   *
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

    plotAreaEl
      .attr("clip-path", "url(#clip)")
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('transform', 'translate(' + (margin.left) + ', ' + (margin.top) + ')');

    background
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('transform', 'translate(' + (margin.left) + ', ' + (margin.top) + ')');


    zoom = d3.behavior.zoom()
      .x(xScale)
      // .scaleExtent([1, 40])
      .on('zoom', zoomCb)
      .on('zoomend', zoomendCb)

    background.call(zoom);

    drawBase();
    drawCustom();
    drawPayments();
  }


  /**
   * Function to call to have chart load and display new data
   * updates scales, axes, paths and other elements
   */
  function update({ base, custom }){
    //need to keep a reference to these because we need search method which is not on the lifecycle
    //property of the lifecycle instance but is higher up, should change
    baseRoot = base.lifecycle;
    customRoot = custom.lifecycle;

    //load new data
    baseLifecycle = base.lifecycle.lifecycle;
    customLifecycle = custom.lifecycle.lifecycle;

    //udpate Scales and axes
    xScale.domain([baseLifecycle.startDate, baseLifecycle.endDate]); //setting new domain
    zoomExtent.x[0] = baseLifecycle.startDate;
    zoomExtent.x[1] = baseLifecycle.endDate;
    calculateScales();

    if(!_state.updated){
      _state.updated = true;

      if(selectionCb)
        selectionCb(xScale.domain())
    }
    // zoom.scaleExtent(zoomExtent.x)


    //draw
    render();
  }

  /**
   * Current selection window, happens to be xScale domain
   * @return array[ date, date ]
   */
  function getCurrentSelection(){
    return xScale.domain();
  }

  /**
   * computes min and max of current selection, updates current selection variable, updates yScale based on
   * view selection
   *
   * scales have zoom factor of 4, will be expanded upon, kind of clunky at the moment
   *
   * @return {[type]} [description]
   */
  function calculateScales(){
    //dates in current selection
    let minDate = xScale.domain()[0]
    let maxDate = xScale.domain()[1];
    totalXLengthMs = baseLifecycle.endDate.getTime() - baseLifecycle.startDate.getTime();
    currentSelectionLengthMs = minDate.getTime() - maxDate.getTime();

    pointScale.domain([ totalXLengthMs ,THREE_MONTHS_MILLI/3]).range([5, -50]);

    let max = 1000; //min scale
    let min;
    let baseMin;
    let customMin;
    let basePayments = 0;
    let customPayments = 0;

    //update y scale min/max based on what's in selection
    baseLifecycle.series.forEach((el, i)=>{
      if (el.date >= minDate && el.date <= maxDate) {
        basePayments++;
        if (el.balance > max)
          max = el.balance;
        if( el.balance < min || min === undefined){
          min = el.balance;
        }
      }
    });

    customLifecycle.series.forEach((el)=>{
      if (el.date >= minDate && el.date <= maxDate) {
        customPayments++;
        if (el.balance > max)
          max = el.balance;
        if( el.balance < min || min === undefined){
          min = el.balance;
        }
      }
    });

    min += -(min/4);

    if( !customPayments || !basePayments) //if one is gone, show from 0 on y axis
      min = 0;

    yScale.domain([Math.max(min,0), max + max/4]);

  }


  /**
   * plots the path element for the base lifecycle
   * @return {[type]} [description]
   */
  function drawBase() {
    let path = basePath.data([baseLifecycle.series])
    path.attr('d', (d) => {
        return line(d)
      })
    path.exit().remove();
  }

  /**
   * plots the path element for the custom lifecycle
   * @return {[type]} [description]
   */
  function drawCustom() {
    customPath.data([customLifecycle.series])
      .attr('d', (d) => {
        return line(d)
      })
  }

  /**
   * function called after zoom
   * @return {[type]} [description]
   */
  function zoomCb() {
    calculateScales();
    zoomTranslate();
    updateAxes();

    render();
  }

  /**
   * callback when zoom selection is stopped
   * @return {[type]} [description]
   */
  function zoomendCb(){
    //need hook into this for angular
    if( selectionCb )
      selectionCb( xScale.domain() );
  }

  /**
   * don't want selection to be outside of x min / max of lifecycles
   * @return {[type]} [description]
   */
  function zoomTranslate(){

    // var tx =
    //   xScale.domain()[0] < zoomExtent.x[0] ? zoomExtent.x[0] :
    //     xScale.domain()[1] > zoomExtent.x[1] ? zoomExtent.x[1] : zoom.translate()[0];
    // console.log('tx', tx)
    // zoom.translate([tx, zoom.translate()[1]]);
  }

  /**
   * [updateAxes description]
   * @return {[type]} [description]
   */
  function updateAxes (){
    xAxisEl.call(xAxis);
    yAxisEl.call(yAxis);
  }


  /**
   * Draws payments for both lifecycles in current selection, if any
   * @return {[type]} [description]
   */
  function drawPayments(){

    let customPayments = customRoot.search(xScale.domain(), true);
    let basePayments = baseRoot.search(xScale.domain(), true);

    drawPaymentCircle(customPayments, 'custom');
    drawPaymentCircle(basePayments, 'base');
  }

  /**
   * plots the payment circles for the current selection
   * @param  {[arr]} payments [array of series dates]
   * @return {[type]}          [description]
   */
  function drawPaymentCircle(payments, identifier){
    let classStr = '.' + identifier;
    let container = identifier === "custom" ? customContainer : baseContainer;

    if( payments.length <= maxPaymentsVisible ){

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
      .attr('r', ()=>{
        return Math.max(pointScale(currentSelectionLengthMs), 0);
      })
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
    circle.transition().duration(250).attr('r', Math.max(pointScale(currentSelectionLengthMs), 0) );
    tooltip.style('display', 'none').html('');
  }
}

export {LifecycleGraphFactory};