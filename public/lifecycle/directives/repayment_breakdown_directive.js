import tpl from './repayment_breakdown.html';

function repaymentBreakdown() {
  return {
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs)=>{

      let custom = scope.lifecycles.custom.lifecycle;
      let base = scope.lifecycles.base.lifecycle;
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
      })

      function create(){
        var width = 600;
        var height = 300;
        var margin = {
          top: 0,
          left: 75,
          bottom: 50,
          right: 20
        };

        var bar = {
          maxWidth: width - margin.left - margin.right,
          height: 50,
        }

        var plotArea = {
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom
        };

        var Custom = {};
        var Base = {};


        var svg = d3.select('.repayment-breakdown-container')
          .append('svg')
            .attr('width', width)
            .attr('height', height);

        var domain = {
          base: 0,
          custom: 1
        };
        var domainMap = Object.keys(domain);

        var yScale = d3.scale.ordinal().domain(domainMap).rangeRoundBands([0,plotArea.height]);
        var xScale = d3.scale.linear().domain([0, Math.max(base.totalPaid, custom.totalPaid)]).range([0, bar.maxWidth]);
        function o (val){
          return (d3.scale.category20())(val % 20)
        }
        var o = d3.scale.category20();

        var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        var yAxis = d3.svg.axis().scale(yScale).orient('left');

        var xAxisEl = svg.append('g')
          .classed('x-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top + plotArea.height) + ')' )
          .call(xAxis);

        var yAxisEl = svg.append('g')
          .classed('y-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + ( margin.top) + ')' )
          .call(yAxis);

        var plotArea = svg.append('g').classed('plot-area', true)
          .attr('width', plotArea.width )
          .attr('height', plotArea.height )
          .attr('transform', 'translate(' + (margin.left) + ', ' + ( margin.top ) + ')');

        var customBreakdown = plotArea.append('g').classed('custom breakdown', true);
        var baseBreakdown = plotArea.append('g').classed('base breakdown', true);


        Base.totalPrincipal = baseBreakdown
          .append('rect')
            .attr('transform', 'translate(' + 0 + ',' + (20) + ')' )
            .attr('height', () => bar.height)
            .attr('fill', 'blue' );

        Base.totalInterest = baseBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (20) + ')' )
          .attr('height', () => bar.height)
          .attr('fill', 'red' );

        Custom.totalPrincipal = customBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (70 +20) + ')' )
          .attr('height', () => bar.height)
          .attr('fill', 'blue' );

        Custom.totalPrincipalPaidByExtra = customBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (70 +20) + ')' )
          .attr('height', () => bar.height)
          .attr('fill', 'pink' );

        Custom.totalInterest = customBreakdown
          .append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (70 +20) + ')' )
          .attr('height', () => bar.height)
          .attr('fill', 'red' );


        updateBase = ()=>{
          Base.totalPrincipal
            .transition().delay(400)
            .attr('transform', 'translate(' + 0 + ',' + (20) + ')' )
            .attr('width', function() {
              return xScale( base.totalPrincipalPaid);
            })

          Base.totalInterest
            .transition().delay(400)
            .attr('transform', 'translate(' + xScale( base.totalPrincipalPaid) + ',' + ( 20) + ')' )
            .attr('width', function(){
              return xScale(base.totalInterestPaid);
            })
            .attr('height', () => bar.height)
        }


        updateCustom = ()=>{
          Custom.totalPrincipal
            .transition().delay(400)
            .attr('transform', 'translate(' + 0 + ',' + (70 +20) + ')' )
            .attr('height', () => bar.height)
            .attr('width', function() {
              return xScale( custom.totalPrincipalPaid);
            })

          Custom.totalPrincipalPaidByExtra
            .transition().delay(400)
            .attr('transform', 'translate(' + xScale( custom.totalPrincipalPaid ) + ',' + ( 70+ 20) + ')' )
            .attr('height', () => bar.height)
            .attr('width', function() {
              return xScale( custom.totalPrincipalPaidByExtra);
            })

          Custom.totalInterest
            .transition().delay(400)
            .attr('transform', 'translate(' + xScale( base.totalPrincipalPaid + base.totalPrincipalPaidByExtra ) + ',' + (70 + 20) + ')' )
            .attr('width', function(){
              return xScale(custom.totalInterestPaid);
            })
            .attr('height', () => bar.height)

        }

        updateBase();
        updateCustom();

        updateAxes = ()=>{
          xScale.domain([0, Math.max(base.totalPaid, custom.totalPaid)]);
          xAxisEl.call(xAxis);
        }

      }
    }
  }

}


export default repaymentBreakdown;
