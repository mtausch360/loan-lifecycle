
/*@ngInject*/
function AnalysisController($scope, lifecycleService, loanService){

  lifecycleService.createLifecycles( loanService.getLoans(), loanService.getSettings() );

}

export default AnalysisController;