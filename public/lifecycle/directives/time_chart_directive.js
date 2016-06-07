import tpl from 'time_chart.html'

function timeChart {
  return {
    template: tpl,
    link: (scope, element, attrs)=>{
      // scope.$watch('lifecycle', function(scope, newValue, oldValue) {
      //     if (newValue)
      //         this.create(scope.lifecycle);
      // });
    }
  };
}

export default timeChart;
