//dependencies

//modules
// import Loan from "./modules/Loan";
// import Lifecycle from "./modules/Lifecycle";

import AppController from "./app_controller";

//lifecycle
import lifecycleGraph from "./components/lifecycle_graph/lifecycle_graph_directive";

import repaymentBreakdown from "./components/repayment_breakdown/repayment_breakdown_directive";

import lifecycleService from "./components/lifecycle/lifecycle_service";

import loanPanel from "./components/loan_panel/loan_panel_directive";
import loanService from "./components/loan_panel/loan_panel_service";
import loan from "./components/loan/loan_directive";


//init angular app
angular.module('loanVisualizer', []);
angular.module('loanVisualizer').controller('AppController', AppController);
angular.module('loanVisualizer').directive('lifecycleGraph', lifecycleGraph);
angular.module('loanVisualizer').directive('repaymentBreakdown', repaymentBreakdown);
angular.module('loanVisualizer').service('lifecycleService', lifecycleService);

angular.module('loanVisualizer').directive('loanPanel', loanPanel);
angular.module('loanVisualizer').service('loanService', loanService);
angular.module('loanVisualizer').directive('loan', loan);