function loanPanel(loanService) {

  return {
    restrict: 'AE',
    templateUrl: 'loan_panel/loan_panel.html',
    link: function(scope, element, attrs){

      if( !localStorage.getItem('settings') )
        init();

      scope.settings = JSON.parse( localStorage.getItem('settings') );

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

