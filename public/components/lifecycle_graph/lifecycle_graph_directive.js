import tpl from './lifecycle_graph.html';
import { LifecycleGraphFactory } from './lifecycle_graph';

/**
 * This vis shows current balance as a function of time, and compares two lifecycles to oneanother
 * @return {[type]} [description]
 */
function lifecycleGraphDirective(lifecycleService, $timeout, $filter) {

  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs) => {
      //hook into lifecycle graph selection
      let selectionCb = ( selection )=>{

        lifecycleService.setCurrentSelection( selection )
        $timeout();
      }

      let Chart = LifecycleGraphFactory( {selectionCb} ).create();

      scope.$watch('lifecycles.date', (newValue, oldValue, scope)=>{
        if( scope.lifecycles && newValue ){
          Chart.update(scope.lifecycles);
        }
      });

      window.addEventListener('resize', Chart.render);
      scope.$on('render', Chart.render);


    }
  }
}




export default lifecycleGraphDirective;
