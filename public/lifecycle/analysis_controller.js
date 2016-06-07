
/*@ngInject*/
function AnalysisController($scope, lifecycleService, loanService){

  $scope.lifecycles = lifecycleService.getState();
  lifecycleService.createLifecycles( loanService.getLoans(), loanService.getSettings() );

}

export default AnalysisController;