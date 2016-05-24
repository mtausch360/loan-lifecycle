
/*@ngInject*/
function AnalysisController($scope, lifecycleService, loanService){
  lifecycleService.createLifecycles( loanService.getLoans(), loanService.getSettings() )

}

angular.module('loanVisualizer').controller('AnalysisController', AnalysisController);