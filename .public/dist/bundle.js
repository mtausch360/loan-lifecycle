/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	//dependencies

	//lifecycle
	import lifecycleGraph from "./lifecycle/directives/lifecycleGraph.js "
	import lifecycleService from "./lifecycle/lifecycle_service.js "
	import AnalysisController from "./lifecycle/analysis_controller.js "

	//loans
	import loanPanelService from "./loan_panel/loan_panel_service.js "
	import loan_panel_service from "./loan_panel/loan_panel_service.js "

	//modules


	//init angular app
	angular.module('loanVisualizer', []);
	angular.module('loanVisualizer').controller('AnalysisController', AnalysisController);
	angular.module('loanVisualizer').directive('lifecycleGraph', lifecycleGraph);
	angular.module('loanVisualizer').service('lifecycleService', lifecycleService);


/***/ }
/******/ ]);