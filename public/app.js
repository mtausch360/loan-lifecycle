//dependencies

//modules
// import Loan from "./modules/Loan";
// import Lifecycle from "./modules/Lifecycle";

//lifecycle
import lifecycleGraph from "./lifecycle/directives/lifecycle_graph_directive";
import repaymentBreakdown from "./lifecycle/directives/repayment_breakdown_directive";
import lifecycleService from "./lifecycle/lifecycle_service";
import AnalysisController from "./lifecycle/analysis_controller";
//loan
import loanPanel from "./loan_panel/loan_panel_directive";
import loanService from "./loan_panel/loan_service";
import loan from "./loan_panel/loan_directive";


//init angular app
angular.module('loanVisualizer', []);
angular.module('loanVisualizer').controller('AnalysisController', AnalysisController);
angular.module('loanVisualizer').directive('lifecycleGraph', lifecycleGraph);
angular.module('loanVisualizer').directive('repaymentBreakdown', repaymentBreakdown);
angular.module('loanVisualizer').service('lifecycleService', lifecycleService);

angular.module('loanVisualizer').directive('loanPanel', loanPanel);
angular.module('loanVisualizer').service('loanService', loanService);
angular.module('loanVisualizer').directive('loan', loan);