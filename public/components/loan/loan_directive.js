import tpl from './loan.html';

function loanDirective(optionsService) {
  return {
    replace: true,
    restrict: "E",
    template: tpl,
    link: function link(scope){
      scope.removeLoan = optionsService.removeLoan;
      scope.$watch('loan', ()=> optionsService.saveLoans(), true);

    }
  };
}

export default loanDirective;

