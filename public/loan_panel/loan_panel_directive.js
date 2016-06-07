import tpl from './loan_panel.html';


function loanPanel(loanService) {

  return {
    restrict: 'E',
    template: tpl,
    link: function(scope, element, attrs){

      if( !localStorage.getItem('settings') )
        init();

      scope.settings = loanService.getSettings();
      console.log(scope.settings);
      scope.loans = loanService.getLoans();

      scope.$watch('settings', function(){
        save();
      }, true);

      function save(){
        localStorage.setItem('settings', JSON.stringify(scope.settings));
      }
    }
  }

}

export default loanPanel;

