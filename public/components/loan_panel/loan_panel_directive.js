import tpl from './loan_panel.html';


function loanPanel(loanService) {

  return {
    restrict: 'E',
    template: tpl,
    link: function (scope, element, attrs) {

      scope.settings = loanService.getSettings();
      scope.loans = loanService.getLoans();
      scope.addLoan = loanService.addLoan;
      scope.saveLoans = () => {
        scope.$emit('edit', { type: 'loans' });
      };
      scope.saveSettings = () => {
        scope.$emit('edit', { type: 'settings' });
      };

      scope.$watch('settings', function () {
        scope.saveSettings();
        loanService.saveSettings();
      }, true);


    }
  }

}

export default loanPanel;
