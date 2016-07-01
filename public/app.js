var Big = require('big.js');
Big.DP = 25;

import AppController from "./app_controller";
import lifecycleNav from "./components/nav/nav_directive";

import lifecycleGraph from "./components/lifecycle_graph/lifecycle_graph_directive";
import repaymentBreakdown from "./components/repayment_breakdown/repayment_breakdown_directive";
import loanPanel from "./components/loan_panel/loan_panel_directive";
import editableInput from "./components/editable_input/editable_input_directive";
import lifecycleService from "./components/lifecycle/lifecycle_service";

import loanService from "./components/loan_panel/loan_panel_service";
import loan from "./components/loan/loan_directive";

angular.module('loanVisualizer', ['ngAnimate']);
angular.module('loanVisualizer').controller('AppController', AppController);
angular.module('loanVisualizer').service('loanService', loanService);
angular.module('loanVisualizer').service('lifecycleService', lifecycleService);
angular.module('loanVisualizer').directive('lifecycleNav', lifecycleNav);
angular.module('loanVisualizer').directive('lifecycleGraph', lifecycleGraph);
angular.module('loanVisualizer').directive('editableInput', editableInput);
angular.module('loanVisualizer').directive('repaymentBreakdown', repaymentBreakdown);
angular.module('loanVisualizer').directive('loanPanel', loanPanel);
angular.module('loanVisualizer').directive('loan', loan);