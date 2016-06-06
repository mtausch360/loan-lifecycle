class timeChart {
    constructor() {
        this.templateUrl = 'lifecycle/directives/time_chart.html';
    }

    link(scope, element, attrs) {

        scope.$watch('lifecycle', function(scope, newValue, oldValue) {
            if (newValue)
                this.create(scope.lifecycle);
        });
    }

}

export default timeChart;
