import tpl from './loan.html';

function loan(loanService) {
  return {
    restrict: "E",
    template: tpl,
    link: function(scope, element, attrs){
      scope.removeLoan = loanService.removeLoan;
      scope.$watch('loan', ()=> loanService.saveLoans(), true)

    }
  }
}

export default loan;

