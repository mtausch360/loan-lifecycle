import tpl from './options_panel.html';
// import Loan from '../../modules/Loan';

function optionsPanelDirective(optionsService) {

  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: function (scope) {

      scope.settings = optionsService.getSettings();
      scope.loans = optionsService.getLoans();

      scope.addLoan = optionsService.addLoan;
      scope.demo = optionsService.demo;

      scope.$watch('loans', () => {
        optionsService.saveLoans();
        scope.$emit('edit', { type: 'loans' });
      }, true);

      scope.$watch('settings', function () {
        optionsService.saveSettings();
        scope.$emit('edit', { type: 'settings' });
      }, true);

    }
  }

}

export default optionsPanelDirective;
