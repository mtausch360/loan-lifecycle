import Loan from './Loan.js';

class Lifecycle {
  /**
   * [constructor description]
   * @param  {[type]}  loans           [description]
   * @param  {[type]}  options.method  [description]
   * @param  {[type]}  options.extra   [description]
   * @param  {Boolean} isBaseLifecycle [description]
   * @return {[type]}                  [description]
   */
  constructor(loans, { method, extra }, isBaseLifecycle) {
    if (isBaseLifecycle)
      extra = 0;

    this.loans = loans;

    var Loans = [];
    this.Loans = Loans;

    _.each(loans, function (loan) {
      Loans.push(new Loan(loan));
    });

    this.method = method;

    this.amountExtraPerMonth = extra;

    this.lifecycle = {
      method: method,
      amountExtraPerMonth: extra,
      series: [],
      totalInterestPaid: 0,
      totalInterestPaidByExtra: 0,
      totalPrincipalPaid: 0,
      totalPrincipalPaidByExtra: 0,
      totalExtraPaid: 0,
      totalPaid: 0,
    };

    this.monthIndex = 1;

    this.live();

    return this.lifecycle;
  }

  /**
   * fills lifecycle object with series information, calculates all loans provided to instance with setings
   * @return {[type]} [description]
   */
  live() {

    var cumulativeMonth;
    var amountExtraNow;

    var init = this.lifecycle.series[0] = this._initMonth();

    _.each(this.Loans, function (L) {

      init.minimumPayment += L.minimumPayment;
      init.balance += L.balance;

    });

    while (this._lifecycleIncomplete()) {

      this.amountExtraNow = this.amountExtraPerMonth;

      switch (this.method) {
      case 'HI_INTEREST':
        this._sortByMethod('interestRate');
        break;
      case 'LO_BALANCE':
        this._sortByMethod('balance');
        break;
      }

      //initialize lifecycle
      this.lifecycle.series[this.monthIndex] = this._initMonth();

      this._payLoans();

      this.monthIndex++;
    }
  }

  /**
   * are all loans dead?
   * @param  {[type]} loans [description]
   * @return {[type]}       [description]
   */
  _lifecycleIncomplete() {

    var isComplete = true;
    var Loan;

    for (var i = 0; i < this.Loans.length; i++) {
      Loan = this.Loans[i];
      if (Loan.alive) isComplete = false;
    }

    return !isComplete;
  }

  /**
   * bubble sort implementation, takes key
   * @param  {[type]} key   [description]
   * @return {[type]}       [description]
   */
  _sortByMethod(key) {
    var flag = false;
    var prev = this.Loans[0];
    for (var i = 1; i < this.Loans.length; i++) {
      var curr = this.Loans[i];
      if (prev[key] > curr[key]) {
        this.Loans[i] = prev;
        this.Loans[i - 1] = curr;
        flag = true;
      }
      prev = this.Loans[i];
    }
    if (!flag)
      return this.Loans;
    else
      return this._sortByMethod(key);
  }

  /**
   * [_payLoans description]
   * @return {[type]} [description]
   */
  _payLoans() {

    let cumulativeMonth = this.lifecycle.series[this.monthIndex];
    let self = this;
    _.each(this.Loans, function (L, i) {
      L.age();

      if (L.alive) {

        let {
          amountPaid,
          extraLeft,
          minimumPaymentLeft,

          principalPaid,
          principalPaidByExtra,

          interestPaid,
          interestPaidByExtra
        } = L.makePayment(self.amountExtraNow);

        let extraPaid = principalPaidByExtra + interestPaidByExtra;
        self.amountExtraNow -= extraPaid;

        cumulativeMonth.amountPaid += amountPaid;
        cumulativeMonth.extraPaid += extraPaid;
        cumulativeMonth.principalPaid += principalPaid;
        cumulativeMonth.principalPaidByExtra += principalPaidByExtra;
        cumulativeMonth.interestPaid += interestPaid;
        cumulativeMonth.interestPaidByExtra += interestPaidByExtra;
        cumulativeMonth.interest += L.interest;
        cumulativeMonth.principal += L.principal;
        cumulativeMonth.balance += L.balance;
      }

    });

    this.lifecycle.totalPaid += cumulativeMonth.amountPaid;
    this.lifecycle.totalExtraPaid += cumulativeMonth.extraPaid;
    this.lifecycle.totalPrincipalPaid += cumulativeMonth.principalPaid;
    this.lifecycle.totalPrincipalPaidByExtra += cumulativeMonth.principalPaidByExtra;
    this.lifecycle.totalInterestPaid += cumulativeMonth.interestPaid;
    this.lifecycle.totalInterestPaidByExtra += cumulativeMonth.interestPaidByExtra;


  }

  /**
   * returns initialized month object for series
   * @return {[type]} [description]
   */
  _initMonth() {
    return {
      monthIndex: this.monthIndex,
      minimumPayment: 0,
      amountExtraPaid: 0,
      amountPaid: 0,
      balance: 0,
      principal: 0,
      interest: 0,
      interestPaid: 0,
      interestPaidByExtra: 0,
      principalPaid: 0,
      principalPaidByExtra: 0,
      extraPaid: 0
    };
  }

}


export default Lifecycle;
