import Loan from '../../modules/Loan';

function loanService() {
  var appName = 'loanLifecycleState'
  var loans = [];
  var settings;
  var appState;

  //currently overwriting previous appState now
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
  };

  /**
   * [initAppState description]
   * @return {[type]} [description]
   */
  function initAppState() {
    if (!localStorage.getItem(appName)) {
      appState = { id: 0 };
      saveAppState();
    }
    appState = JSON.parse(localStorage.getItem(appName));
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
    if (!localStorage.getItem('settings'))
      localStorage.setItem('settings', JSON.stringify({
        method: 'HI_INTEREST',
        extra: 10000
      }));

    settings = JSON.parse(localStorage.getItem('settings'));
  }

  /**
   * [initLoans description]
   * @return {[type]} [description]
   */
  function initLoans() {
    // loans = JSON.parse(localStorage.getItem('loans')) || [];

    _.each([{
        name: 'sm1',
        balance: 11350.12,
        principal: 11350.12,
        dueDate: 3,
        compoundingRate: "MONTHLY",
        interest: 0,
        interestRate: 0.0825,
        minimumPayment: 229.88,
      }, {
        name: 'sm2',
        dueDate: 3,
        compoundingRate: "MONTHLY",
        balance: 7897.15,
        principal: 7897.15,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 136.10,
      }, {
        name: 'sm3',
        dueDate: 3,
        compoundingRate: "MONTHLY",
        balance: 5738.86,
        principal: 5738.86,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 98.29,
      }, {
        name: 'AES1',
        dueDate: 15,
        compoundingRate: "MONTHLY",
        balance: 8778.63,
        principal: 8778.63,
        interest: 0,
        interestRate: 0.0377,
        minimumPayment: 53.82,
      },

      {
        name: 'GLS1',
        dueDate: 22,
        compoundingRate: "MONTHLY",
        balance: 11293.97,
        principal: 11293.97,
        interest: 0,
        interestRate: 0.034,
        minimumPayment: 53.82,
      }, {
        name: 'GLS2',
        dueDate: 22,
        compoundingRate: "MONTHLY",
        balance: 7563.24,
        principal: 7563.24,
        interest: 0,
        interestRate: 0.0386,
        minimumPayment: 53.82,
      }

    ], function (l) {
      addLoan(l);
    });
    saveLoans();
  }
  /**
   * [getLoans description]
   * @return {[type]} [description]
   */
  function getLoans() {
    return loans;
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
  function addLoan(obj) {
    _.extend(obj, {id: appState.id++ });
    console.log('obj', obj);
    loans.unshift(new Loan(obj));
    saveAppState();

  }

  /**
   * [saveLoans description]
   * @return {[type]} [description]
   */
  function saveLoans() {
    localStorage.setItem('loans', JSON.stringify(loans));
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


}

export default loanService;
