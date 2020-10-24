import tpl from './repayment_breakdown.html';
import { RepaymentBreakdownFactory } from './repayment_breakdown';

function repaymentBreakdownDirective(lifecycleService) {
  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: (scope) => {
      let Chart = RepaymentBreakdownFactory().create();

      scope.$on('render', Chart.render);
      window.addEventListener('resize', Chart.render);

      scope.$watch(
        () => lifecycleService.getCurrentWindow().date,
        (newValue) => {
          if (newValue) {
            Chart.update(lifecycleService.getCurrentWindow());
          }
      });

    }
  }

}

export default repaymentBreakdownDirective;
