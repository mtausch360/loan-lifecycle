import Lifecycle from '../../modules/Lifecycle.js';

function lifecycleService(loanService) {

  var lifecycleState = {
    base: {
      date: null,
      lifecycle: null
    },
    custom: {
      date: null,
      lifecycle: null
    },
    date: null
  };
  var current = {
    lifecycleSelection: [null, null],
    date: null
  };

  return {
    getState,
    createLifecycles,
    updateCustom,
    getCurrentSelection,
    setCurrentSelection,
    getLastSelectionDate
  };

  /**
   * [getCurrentSelection description]
   * @return {[type]} [description]
   */
  function getCurrentSelection(){
    return current.lifecycleSelection;
  }

  /**
   * [setCurrentSelection description]
   */
  function setCurrentSelection(selection){
    current.lifecycleSelection = selection;
    current.date = Date.now();
  }

  /**
   * [getLastSelectionDate description]
   * @return {[type]} [description]
   */
  function getLastSelectionDate(){
    return current.date;
  }

  /**
   * [createLifecycles description]
   * @return {[type]} [description]
   */
  function createLifecycles() {
    updateCustom();
    updateBase();
    lifecycleState.date = Date.now();
  }

  /**
   * [updateCustom description]
   * @return {[type]} [description]
   */
  function updateCustom() {
    let custom = new Lifecycle(loanService.getLoans(), loanService.getSettings());
    if (!lifecycleState.custom.lifecycle)
      lifecycleState.custom.lifecycle = custom;
    else
      _.extend(lifecycleState.custom.lifecycle, custom);
    console.log('custom', custom);
    lifecycleState.custom.date = Date.now();
  }

  /**
   * [updateBase description]
   * @return {[type]} [description]
   */
  function updateBase() {
    let base = new Lifecycle(loanService.getLoans(), loanService.getSettings(), /* base lifecycle */ true);
    if (!lifecycleState.base.lifecycle)
      lifecycleState.base.lifecycle = base;
    else
      _.extend(lifecycleState.base.lifecycle, base);

    lifecycleState.base.date = Date.now();
  }

  /**
   * [getState description]
   * @return {[type]} [description]
   */
  function getState() {
    return lifecycleState;
  }

}



export default lifecycleService;
