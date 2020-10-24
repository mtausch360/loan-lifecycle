import tpl from './loan.html';

function loanDirective(optionsService) {
  return {
    replace: true,
    restrict: "E",
    template: tpl,
    link: function link(scope){

      scope.removeLoan = optionsService.removeLoan;

      scope.toggleVisibility = (l) => {
        optionsService.toggleVisibility(l);
      }


    }
  };
}

export default loanDirective;

