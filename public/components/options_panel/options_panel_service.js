// import Loan from '../../modules/Loan';
import {randomLoans} from '../../modules/util';
import addLoanModalTpl from '../../templates/add_loan_modal.html';

/**
 * [optionsPanelService description]
 * @param  {[type]} $uibModal [description]
 * @return {[type]}           [description]
 */
function optionsPanelService($uibModal) {
  var appName = 'loanLifecycleState';
  var loans = [];
  var settings;
  var appState;

  initAppState();
  initLoans();
  initSettings();

  return {
    getLoans,
    addLoan,
    saveLoans,
    removeLoan,
    getSettings,
    saveSettings,
    demo
  };

  /**
   * [initAppState description]
   * @return {[type]} [description]
   */
  function initAppState() {
    let prevAppState = localStorage.getItem(appName);

    if (!prevAppState) {
      appState = { id: 0 };
      saveAppState();
    } else {
      appState = JSON.parse(prevAppState);
      appState.id = 0;
    }
  }

  /**
   * [saveAppState description]
   * @return {[type]} [description]
   */
  function saveAppState() {
    localStorage.setItem(appName, JSON.stringify(appState));
  }

  /**
   * [initSettings description]
   * @return {[type]} [description]
   */
  function initSettings() {
    let prevSettings = localStorage.getItem('settings');

    if (!prevSettings){
      settings = {
        method: 'HI_INTEREST',
        extra: 50
      };
      saveSettings();
    } else {
      settings = JSON.parse(prevSettings);
    }

  }

  /**
   * [getSettings description]
   * @return {[type]} [description]
   */
  function getSettings() {
    return settings;
  }

  /**
   * [saveSettings description]
   * @return {[type]} [description]
   */
  function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  /**
   * [initLoans description]
   * @return {[type]} [description]
   */
  function initLoans() {
    let prevLoans = localStorage.getItem('loans');

    if( !prevLoans ){
      loans = [];
      saveLoans();
    } else{
      loans = JSON.parse(prevLoans);
    }
    loans = [];

    demo();

  }
  /**
   * [getLoans description]
   * @return {[type]} [description]
   */
  function getLoans() {
    return loans;
  }

  /**
   * removes current loans and loads up a bunch of random ones
   * @return {[type]} [description]
   */
  function demo(){
    let rl = randomLoans();
    loans.splice()
    rl.forEach((l)=>{
      l.id = appState.id++;
      loans.push(l)
    });
  }

  /**
   * [removeLoan description]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  function removeLoan(obj) {
    loans.splice(loans.indexOf(obj), 1);
    saveLoans();
  }
  /**
   * [addLoan description]
   * @param {[type]} loan [description]
   */
  function addLoan() {

    let modalInstance = $uibModal.open({
      controller: AddLoanController,
      template: addLoanModalTpl,
      size: 'md'
    });

    modalInstance.result.then((loanObj)=>{
      if( !loanObj.id === undefined ){
        loanObj.id = appState.id++;
        saveAppState();
      }

      loans.unshift(loanObj);
    });


    function AddLoanController($scope, $uibModalInstance){
      $scope.loan = getNewLoan();

      $scope.save = ()=> $uibModalInstance.close($scope.loan);
      $scope.close = ()=> $uibModalInstance.dismiss();
    }

  }

  /**
   * [getNewLoan description]
   * @return {[type]} [description]
   */
  function getNewLoan(){
    return {
      name: 'New Loan',
      id: appState.id++,
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      dueDate: 1
    };
  }
  /**
   * [saveLoans description]
   * @return {[type]} [description]
   */
  function saveLoans() {
    localStorage.setItem('loans', JSON.stringify(loans));
  }



}

export default optionsPanelService;
