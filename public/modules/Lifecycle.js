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
    this.method = method;
    this.amountExtraPerMonth = extra;
    this.loans = loans;

    var Loans = [];
    this.Loans = Loans;

    loans.forEach((loan) => {
      Loans.push(new Loan(loan));
    });

    this.lifecycle = {
      method: method,
      amountExtraPerMonth: extra,
      series: [],
      startDate: new Date(),
      endDate: null,
      totalInterestPaid: 0,
      totalInterestPaidByExtra: 0,
      totalPrincipalPaid: 0, //total + toalPaidByExtra = overall total, poor naming convention
      totalPrincipalPaidByExtra: 0,
      totalExtraPaid: 0,
      totalPaid: 0,
    };

    this.monthIndex = 1;

    this.live();

    return this;
  }

  /**
   * fills lifecycle object with series information, calculates all loans provided to instance with setings
   * @return {[type]} [description]
   */
  live() {

    var cumulativeMonth;
    var amountExtraNow;

    this._initializeState(); //prepare to run lifecycle

    var init = this.lifecycle.series[0] = this._initSeriesObj();

    _.each(this.Loans, (L)=> {

      init.minimumPayment += L.minimumPayment;
      init.balance += L.balance;

    });

    //main lifecycle loop
    while (this._lifecycleIncomplete()) {

      this.monthIndex++;

      this.amountExtraNow = this.amountExtraPerMonth; //refreshes each month

      this._sortLoansByMethod();

      this._initializeState();

      this._payLoans();

    }

    this.lifecycle.endDate = this.lifecycle.series[ this.lifecycle.series.length - 1].date;
  }

  /**
   * [initializeState description]
   * @return {[type]} [description]
   */
  _initializeState(){
    let self = this;
    let dates = {};
    this._state = {};
    //want to keep track of ordering for applying extra to loan payments
    _.each(this.Loans, (L)=>{
      if(L.alive){
        if( !dates[L.dueDate] )
          dates[L.dueDate] = self._initSeriesObj(L.dueDate);
      }
    });
    this._state.dates = dates;

  }

  /**
   * [_payLoans description]
   * @return {[type]} [description]
   */
  _payLoans() {

    let self = this;
    _.each(this.Loans, function (L, i) {

      let cumulativeSeriesDate = self._state.dates[ L.dueDate ];

      if (L.alive) {
        L.age();
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

        //series object calculations
        cumulativeSeriesDate.payments++;
        cumulativeSeriesDate.amountPaid += amountPaid;
        cumulativeSeriesDate.extraPaid += extraPaid;
        cumulativeSeriesDate.principalPaid += principalPaid;
        cumulativeSeriesDate.principalPaidByExtra += principalPaidByExtra;
        cumulativeSeriesDate.interestPaid += interestPaid;
        cumulativeSeriesDate.interestPaidByExtra += interestPaidByExtra;
        cumulativeSeriesDate.interest += L.interest;
        cumulativeSeriesDate.principal += L.principal;
        cumulativeSeriesDate.balance += L.balance;

        //aggregate calculations
        self.lifecycle.totalPaid += amountPaid;
        self.lifecycle.totalExtraPaid += extraPaid;
        self.lifecycle.totalPrincipalPaid += principalPaid;
        self.lifecycle.totalPrincipalPaidByExtra += principalPaidByExtra;
        self.lifecycle.totalInterestPaid += interestPaid;
        self.lifecycle.totalInterestPaidByExtra += interestPaidByExtra;
      }

    });

    //put all date series objects into series array
    _.forIn(this._state.dates, (el)=> self.lifecycle.series.push(el) );

  }

  /**
   * looks in series and returns aggregation of series elements inside of range
   * @return {[obj]} [description]
   */
  search([minDate, maxDate] = [minDate=0, maxDate=0]) {
    let res = {
      totalInterestPaid: 0,
      totalInterestPaidByExtra: 0,
      totalPrincipalPaid: 0,
      totalPrincipalPaidByExtra: 0,
      totalExtraPaid: 0,
      totalPaid: 0,
    };
    this.lifecycle.series.forEach((el)=>{
      if( el.date >= minDate && el.date <= maxDate ){
        res.totalInterestPaid += el.interestPaid;
        res.totalInterestPaidByExtra += el.interestPaidByExtra;

        res.totalPrincipalPaid += el.principalPaid;
        res.totalPrincipalPaidByExtra += el.principalPaidByExtra;

        res.totalPaid += el.amountPaid;
      }
    });
    return res;
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
  _sortLoans(key) {
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
      return this._sortLoans(key);
  }

  /**
   * [_sortLoansByMethod description]
   * @return {[type]} [description]
   */
  _sortLoansByMethod(){

    switch (this.method) {
      case 'HI_INTEREST':
        this._sortLoans('interestRate');
        break;
      case 'LO_BALANCE':
        this._sortLoans('balance');
        break;
    }
  }

  /**
   * returns initialized month object for series
   * @return {[type]} [description]
   */
  _initSeriesObj(day) {
    let date = this._timeHelper(this.monthIndex, day);
    return {
      monthIndex: this.monthIndex,
      day: day,
      date: date,
      payments: 0,
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

  /**
   * transform month index to new date
   * @param  {[type]} month [description]
   * @param  {Number} day   [description]
   * @return {[type]}       [description]
   */
  _timeHelper(month, day = 1) {
    var d = new Date();
    var currMonth = d.getMonth();
    var currYear = d.getFullYear();

    var date = new Date(Math.floor((currMonth + month) / 12) + currYear, (currMonth + month) % 12, day);
    return date;
  }

}

export default Lifecycle;
