import tpl from './loan_panel.html';


function loanPanel(loanService) {

  return {
    restrict: 'E',
    template: tpl,
    link: function(scope, element, attrs){


      scope.settings = loanService.getSettings();
      scope.loans = loanService.getLoans();

      scope.showSettings = true;

      scope.toggleShowSettings = (show) =>{
        scope.showSettings = show;
      }

      scope.saveSettings = ()=>{
        scope.$emit('edit', { type: 'settings'});
      };


      scope.$watch('settings', function(){
        loanService.saveSettings();
      }, true);

      scope.addLoan = loanService.addLoan;


      scope.saveLoans = ()=>{
        scope.$emit('edit', { type: 'loans' });
      }

    }
  }

}

export default loanPanel;

