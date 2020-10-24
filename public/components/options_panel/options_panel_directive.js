import tpl from './options_panel.html';
// import Loan from '../../modules/Loan';

function optionsPanelDirective(optionsService) {

  return {
    replace: true,
    restrict: 'E',
    template: tpl,
    link: function (scope) {

      scope.$watch('settings', function () {
        scope.$emit('edit', { type: 'settings' });
      }, true);

      scope.$watch('loans', () => {
        scope.$emit('edit', { type: 'loans' });
      }, true);

    }
  }

}

export default optionsPanelDirective;
