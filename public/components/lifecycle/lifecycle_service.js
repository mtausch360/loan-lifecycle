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
    baseSelectionData: null,
    customSelectionData: null,
    date: null
  };

  return {
    getState,
    getBase,
    getCustom,

    createLifecycles,
    updateCustom,
    updateBase,
    getCurrentSelection,
    setCurrentSelection,
    getLastSelectionDate
  };

  /**
   * [getCustom description]
   * @return {[type]} [description]
   */
  function getCustom(){
    return lifecycleState.custom;
  }

  /**
   * [getBase description]
   * @return {[type]} [description]
   */
  function getBase(){
    return lifecycleState.base;
  }

  /**
   * [getCurrentSelection description]
   * @return {[type]} [description]
   */
  function getCurrentSelection(){
    return current;
  }

  /**
   * [setCurrentSelection description]
   */
  function setCurrentSelection(selection){
    current.lifecycleSelection = selection;
    current.customSelectionData = lifecycleState.custom.lifecycle.search(selection);
    current.baseSelectionData = lifecycleState.base.lifecycle.search(selection);
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
  }

  /**
   * [updateCustom description]
   * @return {[type]} [description]
   */
  function updateCustom() {
    console.log("updating lifecycle with ", loanService.getLoans());
    let custom = new Lifecycle(loanService.getLoans(), loanService.getSettings());
    if (!lifecycleState.custom.lifecycle)
      lifecycleState.custom.lifecycle = custom;
    else
      _.extend(lifecycleState.custom.lifecycle, custom);
    console.log('custom', custom);
    lifecycleState.custom.date = Date.now();
    lifecycleState.date = Date.now();
  }

  /**
   * [updateBase description]
   * @return {[type]} [description]
   */
  function updateBase() {
    let base = new Lifecycle(loanService.getLoans());
    if (!lifecycleState.base.lifecycle)
      lifecycleState.base.lifecycle = base;
    else
      _.extend(lifecycleState.base.lifecycle, base);
    console.log('base', base);
    lifecycleState.base.date = Date.now();
    lifecycleState.date = Date.now();
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
