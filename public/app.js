import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';

//not sure how to do this big thing. don't think es6 modules apply
var Big = require('big.js');
Big.DP = 25;
<<<<<<< HEAD
=======


>>>>>>> 226d7fb19d099eac264fe61e6669ea854f7ce862

import AppController from "./app_controller";
import navDirective from "./components/nav/nav_directive";
import lifecycleSettingsDirective from "./components/lifecycle_settings/lifecycle_settings_directive";

import lifecycleService from "./components/lifecycle/lifecycle_service";
import lifecycleGraphDirective from "./components/lifecycle_graph/lifecycle_graph_directive";
import repaymentBreakdownDirective from "./components/repayment_breakdown/repayment_breakdown_directive";

import optionsPanelDirective from "./components/options_panel/options_panel_directive";
import optionsService from "./components/options_panel/options_panel_service";

import loansDirective from "./components/loans/loans_directive";
import loanDirective from "./components/loan/loan_directive";

import editableInputDirective from "./components/editable_input/editable_input_directive";

angular.module('loanVisualizer', ['ngAnimate', modal]);
angular.module('loanVisualizer').controller('AppController', AppController);
angular.module('loanVisualizer').service('optionsService', optionsService);
angular.module('loanVisualizer').service('lifecycleService', lifecycleService);
angular.module('loanVisualizer').directive('lifecycleNav', navDirective);
angular.module('loanVisualizer').directive('lifecycleGraph', lifecycleGraphDirective);
angular.module('loanVisualizer').directive('editableInput', editableInputDirective);
angular.module('loanVisualizer').directive('repaymentBreakdown', repaymentBreakdownDirective);
angular.module('loanVisualizer').directive('optionsPanel', optionsPanelDirective);
angular.module('loanVisualizer').directive('lifecycleSettings', lifecycleSettingsDirective);
angular.module('loanVisualizer').directive('loans', loansDirective);
angular.module('loanVisualizer').directive('loan', loanDirective);
