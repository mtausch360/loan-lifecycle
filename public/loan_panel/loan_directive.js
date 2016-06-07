import tpl from './loan.html';

function loan() {
  return {
    template: tpl,
    link,
  }
}

function link(scope, element, attrs){
  console.log('link directive');
}

export default loan;

