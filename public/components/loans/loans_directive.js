import tpl from './loans.html';

function loansDirective(optionsService){
  return {
    replace: true,
    restrict: "E",
    template: tpl,
    link: (scope)=>{

      scope.addLoan = optionsService.addLoan;
      scope.demo = optionsService.demo;

    }
  };
}

export default loansDirective;
