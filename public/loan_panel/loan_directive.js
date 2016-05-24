class loan {

  constructor(){
    this.templateUrl = 'loan_panel/loan.html';
  }

  link(scope, element, attrs){

  }


}

angular.module('loanVisualizer').directive('loan', loan);
