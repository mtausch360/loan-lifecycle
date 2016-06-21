import tpl from './repayment_breakdown.html';

function repaymentBreakdown() {
  return {
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs) => {

      let custom = scope.lifecycles.custom.lifecycle;
      let base = scope.lifecycles.base.lifecycle;
      var updateCustom;
      var updateBase;
      var updateAxes;

      var width
      var height
      var margin
      var bar
      var plotArea
      var plotAreaEl
      var Custom = {}
      var Base = {}
      var svg
      var domain = {
        base: 0,
        custom: 1
      };
      var domainMap = Object.keys(domain);
      var yScale
      var xScale
      var o = d3.scale.category20();
      var xAxis
      var yAxis
      var xAxisEl
      var yAxisEl
      var customBreakdown
      var baseBreakdown

      create();

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

      function render() {
        width = document.getElementById('lifecycle-panel').offsetWidth || 800;
        height = width * .3;
        margin = {
          top: 0,
          left: 75,
          bottom: 50,
          right: 20
        };

        bar = {
          maxWidth: width - margin.left - margin.right,
          height: 50,
        }

        plotArea = {
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom
        };

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

        updateBase();
        updateCustom();
        updateAxes();
      }


      function create() {


        svg = d3.select('.repayment-breakdown-container')
          .append('svg')


        yScale = d3.scale.ordinal().domain(domainMap);
        xScale = d3.scale.linear().domain([0, Math.max(base.totalPaid, custom.totalPaid)]);

        xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        yAxis = d3.svg.axis().scale(yScale).orient('left');

        xAxisEl = svg.append('g')
          .classed('x-axis', true)

        yAxisEl = svg.append('g')
          .classed('y-axis', true)


        plotAreaEl = svg.append('g').classed('plot-area', true)

        customBreakdown = plotAreaEl.append('g').classed('custom breakdown', true);
        baseBreakdown = plotAreaEl.append('g').classed('base breakdown', true);


        Base.totalPrincipal = baseBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (20) + ')')
          .attr('fill', 'blue');

        Base.totalInterest = baseBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (20) + ')')
          .attr('fill', 'red');

        Custom.totalPrincipal = customBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (70 + 20) + ')')
          .attr('fill', 'blue');

        Custom.totalPrincipalPaidByExtra = customBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (70 + 20) + ')')
          .attr('fill', 'pink');

        Custom.totalInterest = customBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (70 + 20) + ')')
          .attr('fill', 'red');

        render();





      }

      function updateAxes() {
        xScale.domain([0, Math.max(base.totalPaid, custom.totalPaid)]);
        xAxisEl.call(xAxis);
      }

      function updateBase() {
        Base.totalPrincipal
          .attr('transform', 'translate(' + 0 + ',' + (20) + ')')
          .attr('width', function () {
            return xScale(base.totalPrincipalPaid);
          })
          .attr('height', () => bar.height)


        Base.totalInterest
          .attr('transform', 'translate(' + xScale(base.totalPrincipalPaid) + ',' + (20) + ')')
          .attr('width', function () {
            return xScale(base.totalInterestPaid);
          })
          .attr('height', () => bar.height)
      }


      function update() {
        Custom.totalPrincipal
          .attr('transform', 'translate(' + 0 + ',' + (70 + 20) + ')')
          .attr('height', () => bar.height)
          .attr('width', function () {
            return xScale(custom.totalPrincipalPaid);
          })

        Custom.totalPrincipalPaidByExtra
          .attr('transform', 'translate(' + xScale(custom.totalPrincipalPaid) + ',' + (70 + 20) + ')')
          .attr('height', () => bar.height)
          .attr('width', function () {
            return xScale(custom.totalPrincipalPaidByExtra);
          })

        Custom.totalInterest
          .attr('transform', 'translate(' + xScale(base.totalPrincipalPaid + base.totalPrincipalPaidByExtra) + ',' + (70 + 20) + ')')
          .attr('width', function () {
            return xScale(custom.totalInterestPaid);
          })
          .attr('height', () => bar.height)

      }
    }
  }

}


export default repaymentBreakdown;
