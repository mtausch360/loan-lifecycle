import Loan from './Loan.js';

class Lifecycle{

  constructor( loans, { method, extra } ){

    this.loans = loans;

    var Loans = [];
    this.Loans = Loans;

    _.each(loans, function(loan){
        Loans.push( new Loan(loan) );
    });

    this.method = method;

    this.amountExtraPerMonth = extra;

    this.lifecycle = {
        method: method,
        amountExtraPerMonth: extra,
        series: [],
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
  live(){

    var cumulativeMonth;
    var amountExtraNow;

    var init = lifecycle.series[0] = {

        monthIndex: monthIndex,

        minimumPayment: 0,

        amountExtraPaid: 0,

        amountPaid: 0,

        currentBalance: 0,

        interest: 0

    };

    _.each(this.Loans, function(l) {

        init.minimumPayment += l.minimumPayment;
        init.currentBalance += l.currentBalance;

    });

    while (this._lifecycleIncomplete(Loans)) {

        amountExtraNow = this.amountExtraPerMonth;

        switch (method) {
            case 'HI_INTEREST':
                this._sortByMethod('interestRate');
                break;
            case 'LO_BALANCE':
                this._sortByMethod('currentBalance');
                break;
        }

        //initialize lifecycle
        this.lifecycle.series[this.monthIndex] = {

            monthIndex: this.monthIndex,

            minimumPayment: 0,

            amountExtraPaid: 0,

            amountPaid: 0,

            currentBalance: 0,

            interest: 0

        };

        this._payLoans();

        this.monthIndex++;
    }



    return lifecycle;
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
          return bubbleSort(key);
  }

  /**
   * [_payLoans description]
   * @return {[type]} [description]
   */
  _payLoans(){

    let cumulativeMonth = this.lifecycle.series[this.monthIndex];

    _.each(this.Loans, function(L, i) {
        //age the loan
        L.age();

        let { amountTendered, amountPaid, change, principalPaid, interestPaid } = L.makePayment( L.minimumPayment + amountExtraNow );

        // amountExtraNow = L.minimumPayment - change -; //need to calculate how much extra cash has been spent
        cumulativeMonth.amountPaid += amountPaid;
        // cumulativeMonth.amountExtraPaid += amountExtraPaid;
        cumulativeMonth.principalPaid += principalPaid;
        cumulativeMonth.interestPaid += interestPaid;
        cumulativeMonth.interest += res.interest;

        cumulativeMonth.balance += L.balance;

    });


    this.lifecycle.totalPaid += cumulativeMonth.amountPaid;
  }

}


export default Lifecycle;