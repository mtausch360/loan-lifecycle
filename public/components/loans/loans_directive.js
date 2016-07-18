import tpl from './loans.html';

function loansDirective(){
  return {
    replace: true,
    restrict: "E",
    template: tpl,
    link: ()=>{}
  };
}

export default loansDirective