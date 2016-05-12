angular.module('loanVisualizer')
  .directive('lifecycle', [ function(){
    return {
      templateUrl: 'lifecycle.html',
      link: function( $scope, element, attrs ){

        $scope.$watch('lifecycle', function(scope, newValue, oldValue){
          if( newValue )
            createLifecycle($scope.lifecycle);
        });

        // function createLifecycle(lifecycle){

        //   var series = lifecycle.series;

        //   var container = d3.select('#chart-container');

        //   var chart = d3.select('#chart');
        //   var width = 700;
        //   var barHeight = 20;
        //   var barMargin = 10;

        //   chart
        //     .attr("width", width)
        //     .attr("height", barHeight * series.length);


        //   var max = d3.max( d3.values( series ) );

        //   var x = d3.scale.linear()
        //       .domain([0, max.currentBalance ])
        //       .range([0, width - 100]);

        //   //create bars
        //   var month = chart.selectAll('rect').data(series);

        //   console.log('month', month)
        //   month.attr("width", function(d){
        //     console.log('updating rects');
        //     return x( d.currentBalance );
        //   });

        //   month.enter()
        //     .append('rect')
        //     .attr("transform", function(d, i) {

        //       return "translate(0," + i * barHeight  + ")";

        //     })
        //     .attr("width", function(d){

        //       return x( d.currentBalance ) }
        //     )
        //     .attr("height", barHeight - 1);

        //   month.exit().remove();



        // }
        function createLifecycle(lifecycle){

          var series = lifecycle.series;
          console.log('here');  

          var color = d3.scale.ordinal()
              .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

          var container = d3.select('#chart-container');
          var margin = {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          };
          var monthMargin = {
            top: 30,
            bottom: 10,
            left: 0,
            right: 0,
          };
          var chart = d3.select('#chart');
          var width = 700;
          var barHeight = 40;
          var barMargin = 10;
          var barMargin = 10;
          var barSpacing = 5;
          var monthHeight = (2 * barHeight + monthMargin.top + monthMargin.bottom );

          chart
              .attr("width", width + margin.left + margin.right)
              .attr("height", monthHeight * series.length + margin.top + margin.bottom );


          var max = d3.max( d3.values( series ) );
          console.log(max,'max')
          var x = d3.scale.linear()
              .domain([0, max.currentBalance  ])
              .range([0, width - 100]);

          //create bars
          var currentBalance = chart.selectAll('.currentbalance').data(series);

          currentBalance
            .enter()
              .append('rect')
              .classed('currentBalance', true)
              .attr('fill', function(){ return color(3)})
              .attr("transform", function(d, i) {
                // console.log('here');
                return "translate(" + (x(max.currentBalance) - ( margin.right +  40 + margin.left + x( d.currentBalance ) ) ) + "," + i * ( monthHeight  )  + ")";

              })
              .attr("width", function(d){
                // console.log('currentBalance', x(d.currentBalance))
                return x( d.currentBalance );
              })
              .attr("height", barHeight)

          currentBalance
            .exit().remove();

          currentBalance
            .attr("width", function(d){
              // console.log('currentBalance', x(d.currentBalance))
              console.log('updating currentBalance', x(d.currentBalance))
              return x( d.currentBalance );
            })




          var payment = chart.selectAll('.payment').data(series);

          payment
            .enter()
              .append('rect')
              .classed('payment', true)
              .attr('fill', function(){ return 'rgba(0,0,0, .1)'})
              .attr("transform", function(d, i) {

                return "translate(" + 0 + "," + ( i * monthHeight ) + ")";

              })
              .attr("width", function(d){
                // console.log( 'amountpaid', x(d.amountPaid))
                return x( d.amountPaid );
              })
              .attr("height", barHeight);

          payment
            .exit().remove();

          payment
            .attr("width", function(d){
              // console.log( 'amountpaid', x(d.amountPaid))
              return x( d.amountPaid );
            })

        }
      }
    };

}]);

