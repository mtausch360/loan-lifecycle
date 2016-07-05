import tpl from './repayment_breakdown.html';

function repaymentBreakdown(lifecycleService) {
  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs) => {

      let custom = scope.lifecycles.custom.lifecycle;
      let base = scope.lifecycles.base.lifecycle;
      let baseData;
      let customData;
      var updateCustom;
      var updateBase;
      var updateAxes;
      var width;
      var height;
      var margin;
      var bar;

      var plotArea;
      var plotAreaEl;
      var Custom = {};
      var Base = {};
      var svg;
      var domain = {
        "Default Lifecycle": 0,
        "My Lifecycle": 1
      };
      var domainMap = Object.keys(domain);
      var yScale;
      var xScale;
      var o = d3.scale.category20();
      var xAxis;
      var yAxis;
      var xAxisEl;
      var yAxisEl;
      var customBreakdown;
      var baseBreakdown;
      var currentSelection = [0,0];

      scope.$on('redrawCustom', function () {
        updateCustom()
      });

      scope.$on('redrawAll', function () {
        updateAxes();
        updateCustom();
        updateBase();
      });

      scope.$on('render', render);

      window.addEventListener('resize', render);

      scope.$watch(()=>lifecycleService.getLastSelectionDate(), function(newValue, oldValue, scope){
        if( newValue !== oldValue  && newValue){
          currentSelection = lifecycleService.getCurrentSelection();
          pruneData()

        }
      });

      create();

      /**
       * [create description]
       * @return {[type]} [description]
       */
      function create() {

        svg = d3.select('.repayment-breakdown-container')
          .append('svg')

        yScale = d3.scale.ordinal().domain(domainMap);
        xScale = d3.scale.linear().domain([0, Math.max(base.totalPaid, custom.totalPaid)]);

        xAxis = d3.svg.axis().scale(xScale).orient('top').ticks(4) ;
        yAxis = d3.svg.axis().scale(yScale).orient('left');

        xAxisEl = svg.append('g')
          .classed('x-axis axis', true);

        yAxisEl = svg.append('g')
          .classed('y-axis axis', true);

        plotAreaEl = svg.append('g').classed('plot-area', true)

        customBreakdown = plotAreaEl.append('g').classed('custom breakdown', true);
        baseBreakdown = plotAreaEl.append('g').classed('base breakdown', true);

        Base.totalPrincipal = baseBreakdown.append('rect').classed('principal', true);
        Base.totalInterest = baseBreakdown.append('rect').classed('interest', true);;

        Custom.totalPrincipal = customBreakdown.append('rect').classed('principal', true);
        // Custom.totalPrincipalPaidByExtra = customBreakdown.append('rect').classed('principal', true);
        Custom.totalInterest = customBreakdown.append('rect').classed('interest', true);

        render();
      }

      /**
       * [render description]
       * @return {[type]} [description]
       */
      function render() {
        width = document.getElementById('lifecycle-panel').offsetWidth;
        height = Math.max(document.documentElement.clientHeight - document.getElementById('nav-bar'), 200)*.25;
        margin = {
          top: 25,
          left: width * .15,
          bottom: 0,
          right: width * .1
        };
        plotArea = {
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom
        };

        bar = {
          maxWidth: plotArea.width,
          height: plotArea.height * (2 / 8),
          margin: {
            top: plotArea.height * (1 / 8),
            bottom: plotArea.height * (1 / 8)
          },
        };

        bar.sectionHeight = bar.height + bar.margin.top + bar.margin.bottom;

        svg
          .attr('width', width)
          .attr('height', height);

        yScale.rangeRoundBands([0, plotArea.height]);
        xScale.range([0, bar.maxWidth]);

        xAxisEl
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top ) + ')')
          .transition()
          .call(xAxis);

        yAxisEl
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
          .transition()
          .call(yAxis);

        plotAreaEl
          .attr('width', plotArea.width)
          .attr('height', plotArea.height)
          .attr('transform', 'translate(' + (margin.left) + ', ' + (margin.top) + ')');

        pruneData()
      }

      /**
       * [drawAll description]
       * @return {[type]} [description]
       */
      function drawAll(){
        updateAxes();
        updateBase();
        updateCustom();
      }

      /**
       * [pruneData description]
       * @return {[type]} [description]
       */
      function pruneData(){
        customData = custom.search(currentSelection);
        baseData = base.search(currentSelection);
        // console.log('currentSelectin', currentSelection, customData, baseData);
        drawAll();
      }

      /**
       * [updateAxes description]
       * @return {[type]} [description]
       */
      function updateAxes() {
        xScale.domain([0, Math.max(baseData.totalPaid*1.1, customData.totalPaid*1.1, 1000)]);
        xAxisEl.transition().call(xAxis);
      }

      /**
       * [updateBase description]
       * @return {[type]} [description]
       */
      function updateBase() {
        Base.totalPrincipal.transition().duration(100).delay(50)
          .attr('transform', 'translate(' + 0 + ',' + (bar.sectionHeight * 0 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(baseData.totalPrincipalPaid))
          .attr('height', () => bar.height)

        Base.totalInterest.transition().duration(100).delay(50)
          .attr('transform', 'translate(' + xScale(baseData.totalPrincipalPaid) + ',' + (bar.sectionHeight * 0 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(baseData.totalInterestPaid))
          .attr('height', () => bar.height)
      }

      /**
       * [updateCustom description]
       * @return {[type]} [description]
       */
      function updateCustom() {
        Custom.totalPrincipal.transition().duration(100).delay(50)
          .attr('transform', 'translate(' + 0 + ',' + (bar.sectionHeight * 1 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(customData.totalPrincipalPaid + customData.totalPrincipalPaidByExtra))
          .attr('height', () => bar.height)

        // Custom.totalPrincipalPaidByExtra
        //   .attr('transform', 'translate(' + xScale(customData.totalPrincipalPaid) + ',' + (bar.sectionHeight * 1 + bar.margin.top) + ')')
        //   .attr('width', ()=> xScale(customData.totalPrincipalPaidByExtra))
        //   .attr('height', () => bar.height)

        Custom.totalInterest.transition().duration(100).delay(50)
          .attr('transform', 'translate(' + xScale(customData.totalPrincipalPaid + customData.totalPrincipalPaidByExtra) + ',' + (bar.sectionHeight * 1 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(customData.totalInterestPaid))
          .attr('height', () => bar.height)

      }
    }
  }

}

export default repaymentBreakdown;
