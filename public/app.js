//dependencies

//lifecycle
import lifecycleGraph from "./lifecycle/directives/lifecycle_graph_directive";
import lifecycleService from "./lifecycle/lifecycle_service";
import AnalysisController from "./lifecycle/analysis_controller";

//loan
import loanPanel from "./loan_panel/loan_panel_directive";
import loanService from "./loan_panel/loan_service";
import loan from "./loan_panel/loan_directive";

//modules
// import Loan from "./modules/Loan";
import Lifecycle from "./modules/Lifecycle";

//init angular app
angular.module('loanVisualizer', []);
angular.module('loanVisualizer').controller('AnalysisController', AnalysisController);
angular.module('loanVisualizer').directive('lifecycleGraph', lifecycleGraph);
angular.module('loanVisualizer').service('lifecycleService', lifecycleService);

angular.module('loanVisualizer').directive('loanPanel', loanPanel);
angular.module('loanVisualizer').service('loanService', loanService);
angular.module('loanVisualizer').directive('loan', new loan);