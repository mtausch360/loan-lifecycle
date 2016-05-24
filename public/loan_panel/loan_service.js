function loanService(){
  var loans;
  var settings;

  if( !localStorage.getItem('loans') ) initLoans();
  loans = JSON.parse(localStorage.getItem('loans'));
  if( !localStorage.getItem('settings') ) initSettings();
  settings = JSON.parse( localStorage.getItem('settings') );

  return {
    getLoans,
    getSettings
  };

  function getLoans(){
    return loans;
  }

  function getSettings(){
    return settings;
  }

  function initLoans(){
    localStorage.setItem('loans', JSON.stringify([
      {
        name: 'sm1',
        currentBalance: 11350.12,
        interestRate: 0.0825,
        minimumPayment: 229.88,
      },
      {
        name: 'sm2',
        currentBalance: 7897.15,
        interestRate: 0.0725,
        minimumPayment: 136.10,
      },
      {
        name: 'sm3',
        currentBalance: 5738.86,
        interestRate: 0.0725,
        minimumPayment: 98.29,
      },
      {
        name: 'AES1',
        currentBalance: 8778.63,
        interestRate: 0.0377,
        minimumPayment: 53.82,
      },

      {
        name: 'GLS1',
        currentBalance: 11293.97,
        interestRate: 0.034,
        minimumPayment: 53.82,
      },
      {
        name: 'AES2',
        currentBalance: 7563.24,
        interestRate: 0.0386,
        minimumPayment: 53.82,
      }
      // {
      //   name: 'AES1',
      //   currentBalance: 8778.63,
      //   interestRate: 0.0377,
      //   minimumPayment: 53.82,
      // },
      // {
      //   name: 'AES1',
      //   currentBalance: 8778.63,
      //   interestRate: 0.0377,
      //   minimumPayment: 53.82,
      // },
    ]) );
  }

  function initSettings(){
    localStorage.setItem('settings', JSON.stringify({
      method: 'HI_INTEREST',
      amountExtra: 10000
    }));
  }

}

angular.module('loanVisualizer').service('loanService', loanService);



