import tpl from './loans.html';

<<<<<<< HEAD
function loansDirective(optionsService){
=======
function loansDirective(){
>>>>>>> 226d7fb19d099eac264fe61e6669ea854f7ce862
  return {
    replace: true,
    restrict: "E",
    template: tpl,
<<<<<<< HEAD
    link: (scope)=>{

      scope.addLoan = optionsService.addLoan;
      scope.demo = optionsService.demo;

    }
=======
    link: ()=>{}
>>>>>>> 226d7fb19d099eac264fe61e6669ea854f7ce862
  };
}

export default loansDirective