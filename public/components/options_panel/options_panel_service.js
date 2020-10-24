// import Loan from '../../modules/Loan';
import { randomLoans, newLoan } from '../../modules/util';
import addLoanModalTpl from '../../templates/add_loan_modal.html';

/**
 * [optionsPanelService description]
 * @param  {[type]} $uibModal [description]
 * @return {[type]}           [description]
 */
function optionsPanelService($uibModal) {
  const localStorageId = 'loanLifecycleApp';

  let LLState = {
    id: 0,
    loans: [],
    settings: {
      method: 'HI_INTEREST',
      extra: 50
    }
  };

  const prevLLState = localStorage.getItem(localStorageId);

  if (prevLLState) {
    LLState = Object.assign({}, LLState, JSON.parse(prevLLState));
  }

  demo()

  return {
    getLoans,
    getSettings,

    getVisibleLoans,

    toggleLoanVisibility,

    addLoan,
    removeLoan,

    save,

    demo
  };

  function getVisibleLoans () {
    return LLState.loans.filter(l => l.visible)
  }

  /**
   * [saveLLState description]
   * @return {[type]} [description]
   */
  function save() {
    localStorage.setItem(localStorageId, JSON.stringify(LLState));
  }

  /**
   * [getSettings description]
   * @return {[type]} [description]
   */
  function getSettings() {
    return LLState.settings;
  }

  /**
   * [getLoans description]
   * @return {[type]} [description]
   */
  function getLoans() {
    return LLState.loans;
  }

  /**
   * removes current loans and loads up a bunch of random ones
   * @return {[type]} [description]
   */
  function demo(){
    let rl = randomLoans();

    LLState.loans = [];

    rl.forEach((l)=>{
      l.id = LLState.id++;
      LLState.loans.push(l);
    });
  }

  /**
   * [removeLoan description]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  function removeLoan (obj) {
    LLState.loans.splice(LLState.loans.indexOf(obj), 1);
    save();
  }

  function toggleLoanVisibility (obj) {
    LLState.loans.forEach((l) => {
      if (obj.id === l.id) {
        l.visibility = !l.visibility;
      }
    })
  }

  /**
   * [addLoan description]
   * @param {[type]} loan [description]
   */
  function addLoan () {

    let modalInstance = $uibModal.open({
      controller: AddLoanController,
      template: addLoanModalTpl,
      size: 'md'
    });

    modalInstance.result.then((loanObj)=>{
      if( !loanObj.id === undefined ){
        loanObj.id = LLState.id++;
        save();
      }

      LLState.loans.unshift(loanObj);
    });


    function AddLoanController($scope, $uibModalInstance){
      $scope.loan = newLoan(LLState.id++);

      $scope.save = ()=> $uibModalInstance.close($scope.loan);
      $scope.close = ()=> $uibModalInstance.dismiss();
    }

  }


}

export default optionsPanelService;
