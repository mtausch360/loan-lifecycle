import Lifecycle from '../../modules/Lifecycle.js';

function lifecycleService(optionsService) {

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

  var currentWindow = {
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

    getCurrentWindow,
    setCurrentWindow,
  };

  /**
   * [getCustom description]
   * @return {[type]} [description]
   */
  function getCustom () {
    return lifecycleState.custom;
  }

  /**
   * [getBase description]
   * @return {[type]} [description]
   */
  function getBase () {
    return lifecycleState.base;
  }

  /**
   * [getCurrentWindow description]
   * @return {[type]} [description]
   */
  function getCurrentWindow () {
    return currentWindow;
  }

  /**
   * [setCurrentWindow description]
   */
  function setCurrentWindow (selection) {
    currentWindow.lifecycleSelection = selection;
    currentWindow.customSelectionData = lifecycleState.custom.lifecycle.search(selection);
    currentWindow.baseSelectionData = lifecycleState.base.lifecycle.search(selection);
    currentWindow.date = Date.now();
  }

  /**
   * [createLifecycles description]
   * @return {[type]} [description]
   */
  function createLifecycles () {
    updateCustom();
    updateBase();
    setCurrentWindow([
      lifecycleState.base.lifecycle.lifecycle.startDate,
      lifecycleState.base.lifecycle.lifecycle.endDate
    ]);
  }

  /**
   * [updateCustom description]
   * @return {[type]} [description]
   */
  function updateCustom () {
    let custom = new Lifecycle(optionsService.getVisibleLoans(), optionsService.getSettings());
    if (!lifecycleState.custom.lifecycle) {
      lifecycleState.custom.lifecycle = custom;
    }
    else {
      _.extend(lifecycleState.custom.lifecycle, custom);
    }
    lifecycleState.custom.date = Date.now();
    lifecycleState.date = Date.now();
  }

  /**
   * [updateBase description]
   * @return {[type]} [description]
   */
  function updateBase() {
    let base = new Lifecycle(optionsService.getVisibleLoans());
    if (!lifecycleState.base.lifecycle) {
      lifecycleState.base.lifecycle = base;
    }
    else {
      _.extend(lifecycleState.base.lifecycle, base);
    }
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
