function loanService(){
  var loans;
  var settings;

  if( !localStorage.getItem('loans') ) initLoans();
  loans = JSON.parse(localStorage.getItem('loans'));

  if( !localStorage.getItem('settings') ) initSettings();
  settings = JSON.parse( localStorage.getItem('settings') );

  console.log("settings loaded", settings);

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
        balance: 11350.12,
        principal: 11350.12,
        interest: 0,
        interestRate: 0.0825,
        minimumPayment: 229.88,
      },
      {
        name: 'sm2',
        balance: 7897.15,
        principal: 7897.15,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 136.10,
      },
      {
        name: 'sm3',
        balance: 5738.86,
        principal: 5738.86,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 98.29,
      },
      {
        name: 'AES1',
        balance: 8778.63,
        principal: 8778.63,
        interest: 0,
        interestRate: 0.0377,
        minimumPayment: 53.82,
      },

      {
        name: 'GLS1',
        balance: 11293.97,
        principal: 11293.97,
        interest: 0,
        interestRate: 0.034,
        minimumPayment: 53.82,
      },
      {
        name: 'AES2',
        balance: 7563.24,
        principal: 7563.24,
        interest: 0,
        interestRate: 0.0386,
        minimumPayment: 53.82,
      }

    ]) );
  }

  function initSettings(){
    localStorage.setItem('settings', JSON.stringify({
      method: 'HI_INTEREST',
      extra: 10000
    }));
  }

}

export default loanService;
