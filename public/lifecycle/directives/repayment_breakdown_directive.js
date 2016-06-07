import tpl from './repayment_breakdown.html';

function repaymentBreakdown() {
  return {
    template: tpl,
    link: (scope, element, attrs)=>{
      let base;
      let custom;
      scope.$watch('lifecycles.date', function(s, newValue, oldValue) {
          if (newValue){
            custom = scope.lifecycles.custom.lifecycle;
            base = scope.lifecycles.base.lifecycle;
            create();
          }
      });


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


        var chart = d3.select('.repayment-breakdown-container')
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

        var xAxisEl = chart.append('g')
          .classed('x-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + (margin.top + plotArea.height) + ')' )
          .call(xAxis);

        var yAxisEl = chart.append('g')
          .classed('y-axis', true)
          .attr('transform', 'translate(' + margin.left + ',' + ( margin.top) + ')' )
          .call(yAxis);

        var plotArea = chart.append('g').classed('plot-area', true)
          .attr('width', plotArea.width )
          .attr('height', plotArea.height )
          .attr('transform', 'translate(' + (margin.left) + ', ' + ( margin.top ) + ')');

        var customBreakdown = plotArea.append('g').classed('custom breakdown', true);
        var baseBreakdown = plotArea.append('g').classed('base breakdown', true);


        baseBreakdown.append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (20) + ')' )
          .attr('height', () => bar.height)
          .attr('width', function() {
            return xScale( base.totalPrincipalPaid);
          })
          .attr('fill', 'blue' );

        baseBreakdown.append('rect')
          .attr('width', function(){
            return xScale(base.totalInterestPaid);
          })
          .attr('height', () => bar.height)
          .attr('transform', 'translate(' + xScale( base.totalPrincipalPaid) + ',' + ( 20) + ')' )
          .attr('fill', 'red' );


        customBreakdown.append('rect')
          .attr('transform', 'translate(' + 0 + ',' + (70 +20) + ')' )
          .attr('height', () => bar.height)
          .attr('width', function() {
            return xScale( custom.totalPrincipalPaid);
          })
          .attr('fill', 'blue' );

        customBreakdown.append('rect')
          .attr('transform', 'translate(' + xScale( custom.totalPrincipalPaid ) + ',' + ( 70+ 20) + ')' )
          .attr('height', () => bar.height)
          .attr('width', function() {
            return xScale( custom.totalPrincipalPaidByExtra);
          })
          .attr('fill', 'pink' );


        customBreakdown.append('rect')
          .attr('width', function(){
            return xScale(custom.totalInterestPaid);
          })
          .attr('height', () => bar.height)
          .attr('transform', 'translate(' + xScale( base.totalPrincipalPaid + base.totalPrincipalPaidByExtra ) + ',' + (70 + 20) + ')' )
          .attr('fill', 'red' );

        // customBreakdown.append('rect')
        //   .attr('width', ()=> xScale( custom.totalPrincipalPaid - custom.amountExtraPaid ))
        //   .attr('height', bar.height)
        //   .attr('transform', 'translate(' + 0 + ',' + yAxis(1) + ')' )
        //   .attr('color', ()=> o( custom.totalPrincipalPaid ) );

        // customBreakdown.append('rect')
        //   .attr('width', ()=> xScale( custom.totalExtraPaid ))
        //   .attr('height', bar.height)
        //   .attr('transform', 'translate(' + xScale( custom.totalPrincipalPaid - custom.amountExtraPaid ) + ',' + yAxis(1) + ')' )
        //   .attr('color', ()=> o( custom.totalExtraPaid ) );

        // custom.append('rect')
        //   .attr('width', ()=> xScale( custom.totalInterestPaid  ))
        //   .attr('height', bar.height)
        //   .attr('transform', 'translate(' + xScale( custom.totalPrincipalPaid ) + ',' + yAxis(1) + ')' )
        //   .attr('color', ()=> o( custom.totalInterestPaid ) );
      }
    }
  }

}


export default repaymentBreakdown;
