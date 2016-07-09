import tpl from './lifecycle_graph.html';
import {LifecycleGraphFactory} from '../../modules/lifecycle_graph';

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

      let selectionCb = ( selection )=>{
        console.log('selection cb called', selection);
        lifecycleService.setCurrentSelection( selection );
      };

      let Chart = LifecycleGraphFactory( { selectionCb } );
      Chart.create()


      // scope.customState = lifecycleService.getCustom();
      // scope.$watch('customState.date',()=>{
      //   console.log('custom has changed')
      //   if( scope.customState.lifecycle )
      //     custom = scope.customState.lifecycle;
      // })

      // scope.baseState = lifecycleService.getBase();
      // scope.$watch('baseState.date', ()=>{
      //   console.log('base state')
      //   if(scope.baseState.lifecycle)
      //     base = scope.baseState.lifecycle;
      //   create();

      // });

      scope.$watch('lifecycles.date', (newValue, oldValue, scope)=>{
        if( scope.lifecycles && newValue ){
          console.log('update called')
          Chart.update(scope.lifecycles);
        }
      })
      window.addEventListener('resize', Chart.render);
      scope.$on('render', Chart.render);




    }
  }
}




export default lifecycleGraphDirective;
