import tpl from './lifecycle_graph.html';
import { LifecycleGraphFactory } from './lifecycle_graph';

/**
 * This vis shows current balance as a function of time, and compares two lifecycles to oneanother
 * @return {[type]} [description]
 */
function lifecycleGraphDirective(lifecycleService, $timeout) {

  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: (scope) => {

      // hook into lifecycle graph selection
      const currentWindowCallback = (currentWindow) => {
        lifecycleService.setCurrentWindow(currentWindow);
        $timeout();
      };

      let Chart = LifecycleGraphFactory(currentWindowCallback).create();

      scope.$watch('lifecycles.date', (newValue, oldValue, scope) => { 
        if (scope.lifecycles && newValue) {
          Chart.update(scope.lifecycles);
        }
      });

      window.addEventListener('resize', Chart.render);
      scope.$on('render', Chart.render);

    }
  }
}




export default lifecycleGraphDirective;
