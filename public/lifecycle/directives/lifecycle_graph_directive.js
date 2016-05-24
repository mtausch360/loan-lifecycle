class lifecycleGraph {
    constructor() {
        this.templateUrl = 'lifecycle/lifecycle_graph.html';
    }

    link(scope, element, attrs) {

        scope.$watch('lifecycle', function(scope, newValue, oldValue) {
            if (newValue)
                this.create(scope.lifecycle);
        });
    }

}

angular.module('loanVisualizer').directive('lifecycleGraph', lifecycleGraph);
