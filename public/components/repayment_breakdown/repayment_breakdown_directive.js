import tpl from './repayment_breakdown.html';
import { RepaymentBreakdownFactory } from './repayment_breakdown';

function repaymentBreakdownDirective(lifecycleService, $filter) {
  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: (scope, element, attrs) => {
      let Chart = RepaymentBreakdownFactory().create();

      scope.$on('render', Chart.render);
      window.addEventListener('resize', Chart.render);

      scope.$watch(
        () => lifecycleService.getLastSelectionDate(),
        (newValue, oldValue, scope) => {
          if (newValue) {
            Chart.update( lifecycleService.getCurrentSelection() );
          }
        });

    }
  }

}

export default repaymentBreakdownDirective;
