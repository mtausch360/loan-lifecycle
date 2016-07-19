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

<<<<<<< HEAD
=======
      scope.addLoan = optionsService.addLoan;
      scope.demo = optionsService.demo;

>>>>>>> 226d7fb19d099eac264fe61e6669ea854f7ce862
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
