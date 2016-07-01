import tpl from './repayment_breakdown.html';

function repaymentBreakdown(lifecycleService) {
  return {
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
        base: 0,
        custom: 1
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

      function timeHelper(month, day = 1) {
        var d = new Date();
        var currMonth = d.getMonth();
        var currYear = d.getFullYear();

        var date = new Date(Math.floor((currMonth + month) / 12) + currYear, (currMonth + month) % 12, day);
        return date;
      }

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

        xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        yAxis = d3.svg.axis().scale(yScale).orient('left');

        xAxisEl = svg.append('g')
          .classed('x-axis', true);

        yAxisEl = svg.append('g')
          .classed('y-axis', true);

        plotAreaEl = svg.append('g').classed('plot-area', true)

        customBreakdown = plotAreaEl.append('g').classed('custom breakdown', true);
        baseBreakdown = plotAreaEl.append('g').classed('base breakdown', true);

        Base.totalPrincipal = baseBreakdown.append('rect');
        Base.totalInterest = baseBreakdown.append('rect');

        Custom.totalPrincipal = customBreakdown.append('rect');
        Custom.totalPrincipalPaidByExtra = customBreakdown.append('rect');
        Custom.totalInterest = customBreakdown.append('rect');

        render();

      }

      /**
       * [render description]
       * @return {[type]} [description]
       */
      function render() {
        width = document.getElementById('lifecycle-panel').offsetWidth;
        height = Math.max(document.documentElement.clientHeight - document.getElementById('nav-bar'), 200)*.3;
        margin = {
          top: 0,
          left: 75,
          bottom: 50,
          right: 20
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
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top + plotArea.height) + ')')
          .call(xAxis);

        yAxisEl
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
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
        xScale.domain([0, Math.max(baseData.totalPaid, customData.totalPaid)]);
        xAxisEl.call(xAxis);
      }

      /**
       * [updateBase description]
       * @return {[type]} [description]
       */
      function updateBase() {
        Base.totalPrincipal.transition()
          .attr('transform', 'translate(' + 0 + ',' + (bar.sectionHeight * 0 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(baseData.totalPrincipalPaid))
          .attr('height', () => bar.height)
          .attr('fill', 'red')

        Base.totalInterest.transition()
          .attr('transform', 'translate(' + xScale(baseData.totalPrincipalPaid) + ',' + (bar.sectionHeight * 0 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(baseData.totalInterestPaid))
          .attr('height', () => bar.height)
          .attr('fill', 'blue')
      }

      /**
       * [updateCustom description]
       * @return {[type]} [description]
       */
      function updateCustom() {
        Custom.totalPrincipal.transition()
          .attr('transform', 'translate(' + 0 + ',' + (bar.sectionHeight * 1 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(customData.totalPrincipalPaid))
          .attr('height', () => bar.height)
          .attr('fill', 'red')

        Custom.totalPrincipalPaidByExtra.transition()
          .attr('transform', 'translate(' + xScale(customData.totalPrincipalPaid) + ',' + (bar.sectionHeight * 1 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(customData.totalPrincipalPaidByExtra))
          .attr('height', () => bar.height)
          .attr('fill', 'pink')

        Custom.totalInterest.transition()
          .attr('transform', 'translate(' + xScale(customData.totalPrincipalPaid + customData.totalPrincipalPaidByExtra) + ',' + (bar.sectionHeight * 1 + bar.margin.top) + ')')
          .attr('width', ()=> xScale(customData.totalInterestPaid))
          .attr('height', () => bar.height)
          .attr('fill', 'blue')

      }
    }
  }

}

export default repaymentBreakdown;
