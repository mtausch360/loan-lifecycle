import tpl from './loan.html';

<<<<<<< HEAD
function loanDirective(optionsService) {
=======
function loanDirective(loanService) {
>>>>>>> 226d7fb19d099eac264fe61e6669ea854f7ce862
  return {
    replace: true,
    restrict: "E",
    template: tpl,
    link: function(scope){
<<<<<<< HEAD
      scope.removeLoan = optionsService.removeLoan;
      scope.$watch('loan', ()=> optionsService.saveLoans(), true)
=======
      scope.removeLoan = loanService.removeLoan;
      scope.$watch('loan', ()=> loanService.saveLoans(), true)
>>>>>>> 226d7fb19d099eac264fe61e6669ea854f7ce862
    }
  }
}

export default loanDirective;

