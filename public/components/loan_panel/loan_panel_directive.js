import tpl from './loan_panel.html';
import Loan from '../../modules/Loan';

function loanPanel(loanService) {

  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: function (scope, element, attrs) {

      scope.settings = loanService.getSettings();
      scope.loans = loanService.getLoans();

      scope.addLoan = loanService.addLoan;
      scope.demo = loanService.demo;

      scope.$watch('loans', ()=>{
        loanService.saveLoans();
        scope.$emit('edit', { type: 'loans' });
      }, true);

      scope.$watch('settings', function () {
        loanService.saveSettings();
        scope.$emit('edit', { type: 'settings' });
      }, true);



    }
  }

}

export default loanPanel;
