class lifecycleGraph {
    constructor() {
        this.templateUrl = 'lifecycle/directives/lifecycle_graph.html';
    }

    link(scope, element, attrs) {

        scope.$watch('lifecycle', function(scope, newValue, oldValue) {
            if (newValue)
                this.create(scope.lifecycle);
        });
    }

}

export default lifecycleGraph;
