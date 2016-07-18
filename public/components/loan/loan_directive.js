import tpl from './loan.html';

function loan(loanService) {
  return {
    replace: true,
    restrict: "E",
    template: tpl,
    link: function(scope){
      scope.removeLoan = loanService.removeLoan;
      scope.$watch('loan', ()=> loanService.saveLoans(), true)
    }
  }
}

export default loan;

