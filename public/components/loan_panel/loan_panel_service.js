function loanService(){
  var loans = [];
  var settings;
  var state;

  if( !localStorage.getItem('loanVisState') ) {
    state = { id: 0 };
    saveState()
  }

  state = JSON.parse(localStorage.getItem('loanVisState'));
initLoans();

  loans = JSON.parse(localStorage.getItem('loans'));

  if( !localStorage.getItem('settings') ) initSettings();
  settings = JSON.parse( localStorage.getItem('settings') );


  return {
    getLoans,
    addLoan,
    saveLoans,
    removeLoan,

    getSettings,
    saveSettings,

  };

  function getLoans(){
    return loans;
  }

  function removeLoan(loan){
    loans.splice(loans.indexOf(loan), 1);
    saveLoans()
  }

  function getSettings(){
    return settings;
  }

  function addLoan(loan){
    loans.unshift( initLoan(loan) );
    saveState();
  };

  function initLoans(){

    _.each([
      {
        name: 'sm1',
        balance: 11350.12,
        principal: 11350.12,
        dueDate: 3,
        compoundingRate: "MONTHLY",
        interest: 0,
        interestRate: 0.0825,
        minimumPayment: 229.88,
      },
      {
        name: 'sm2',
        dueDate: 3,
        compoundingRate: "MONTHLY",
        balance: 7897.15,
        principal: 7897.15,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 136.10,
      },
      {
        name: 'sm3',
        dueDate: 3,
        compoundingRate: "MONTHLY",
        balance: 5738.86,
        principal: 5738.86,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 98.29,
      },
      {
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
      },
      {
        name: 'GLS2',
        dueDate: 22,
        compoundingRate: "MONTHLY",
        balance: 7563.24,
        principal: 7563.24,
        interest: 0,
        interestRate: 0.0386,
        minimumPayment: 53.82,
      }

    ], function(l){
      addLoan(l);
    });

    saveLoans();

  }

  function saveLoans(){
    localStorage.setItem('loans', JSON.stringify(loans));
  }

  function initLoan({ name = "New Loan", id = state.id++, balance = 0, principal = 0, interest = 0, interestRate = 0, minimumPayment = 0} = {}){

    return {
      name,
      id,
      balance,
      principal,
      interest,
      interestRate,
      minimumPayment
    };
  }

  function initSettings(){
    localStorage.setItem('settings', JSON.stringify({
      method: 'HI_INTEREST',
      extra: 10000
    }));
  }

  function saveSettings(){
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  function saveState(){
    localStorage.setItem('loanVisState', JSON.stringify(state));
  }

}

export default loanService;
