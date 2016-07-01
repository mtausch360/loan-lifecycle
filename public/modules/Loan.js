
class Loan {

  /**
   * [constructor description]
   * @param  {String} options.name            [description]
   * @param  {[type]} options.id              [description]
   * @param  {Number} options.interestRate    [description]
   * @param  {String} options.compoundingRate [description]
   * @param  {Number} options.dueDate         [description]
   * @param  {Number} options.minimumPayment  [description]
   * @param  {Number} options.principal       [description]
   * @param  {Number} options.interest        [description]
   * @return {[type]}                         [description]
   */
  constructor({ name = "", id, interestRate = 0, compoundingRate = "MONTHLY", dueDate = 1, minimumPayment = 0, balance = 0, principal = 0, interest = 0 }) {
    this.name = name;
    this.id = id;
    this.dueDate = dueDate;
    this.interestRate = interestRate; //nominal interest Rate
    this.compoundingRate = compoundingRate; //not used yet
    this.minimumPayment = minimumPayment;
    if (balance) {
      this.principal = balance;
      this.interest = 0;
    } else {
      this.principal = principal;
      this.interest = interest;
    }
    this.interestAccrued = 0;
    this.alive = true;
    this._calculateBalance();

    let condition = Number(Big(this.interestRate).div(12).times(this.principal)) > this.minimumPayment;
    if (condition > this.minimumPayment) {
      console.error("INVALID LOAN");
      throw "Invalid Loan";
    }
    this._validate();
    return this;
  }

  /**
   * Payments assume that any overpayment is applied to principal balance.
   *
   * @param  {[number]} amount [total money to paydown on this loan]
   * @return {[type]}     [description]
   */
  makePayment(extra = 0) {

    let amountTendered = this.minimumPayment + extra;
    let minimumPayment = this.minimumPayment;

    let amountPaid = 0;

    let interestPaid = 0;
    let interestPaidByExtra = 0;

    let principalPaid = 0;
    let principalPaidByExtra = 0;

    //interest
    if (this.interest - minimumPayment <= 0) { //take portion of min
      interestPaid += this.interest;
      minimumPayment -= this.interest;
      this.interest = 0;

    } else if (this.interest - (minimumPayment + extra) <= 0) { //take all min, some extra
      interestPaid += minimumPayment;
      this.interest -= minimumPayment;
      minimumPayment = 0;

      interestPaidByExtra += this.interest;
      extra -= this.interest;
      this.interest -= this.interest;

    } else if (this.interest - (minimumPayment + extra) > 0) { //take all min, all extra
      interestPaid += minimumPayment;
      this.interest -= minimumPayment;
      minimumPayment = 0;

      interestPaidByExtra += extra;
      this.interest -= extra;
      extra = 0;
    }

    //principal
    if (this.principal - minimumPayment <= 0) { //take portion of min, no extra
      principalPaid += this.principal;
      minimumPayment -= this.principal;
      this.principal = 0;

    } else if (this.principal - (minimumPayment + extra) <= 0) { //take all of min some extra
      principalPaid += minimumPayment;
      this.principal -= minimumPayment;
      minimumPayment = 0;

      principalPaidByExtra += this.principal;
      extra -= this.principal;
      this.principal = 0;

    } else if (this.principal - (minimumPayment + extra) > 0) { //take all min, all extra
      principalPaid += minimumPayment;
      this.principal -= minimumPayment;
      minimumPayment = 0;

      principalPaidByExtra += extra;
      this.principal -= extra;
      extra = 0;
    }

    this._calculateBalance();

    let res = {
      amountTendered,

      amountPaid: (interestPaid + interestPaidByExtra + principalPaid + principalPaidByExtra),

      extraLeft: extra,

      minimumPaymentLeft: minimumPayment,

      totalPrincipalPaid: principalPaidByExtra + principalPaid,
      principalPaid,
      principalPaidByExtra,

      totalInterestPaid: interestPaidByExtra + interestPaid,
      interestPaid,
      interestPaidByExtra
    };

    return res;

  }

  /**
   * Ages the loan one month and capitalizes any previous interest
   * @return {[type]} [description]
   */
  age() {

    //capitalize previous interest
    this.principal += this.interest;
    this.interest = 0;

    //A=P(1+r/n)^n
    let effectiveInterestRate = Big(this.interestRate).div(12);
    let monthlyInterestAccrued = Number(Big(effectiveInterestRate).times(this.principal));

    this.interest += monthlyInterestAccrued;
    this.interestAccrued += monthlyInterestAccrued;

    this._calculateBalance();

  }

  /**
   * [_calculateBalance description]
   * @return {[type]} [description]
   */
  _calculateBalance() {
    this.balance = this.principal + this.interest;

    if (this.balance <= 0)
      this.alive = false;
  }

  /**
   * throws if not a valid loan
   *   minimum payment won't touch the interest grown in a month
   *
   */
  _validate() {
    let condition = Number(Big(this.interestRate).div(12).times(this.principal)) > this.minimumPayment;
    if (condition > this.minimumPayment) {
      console.error("INVALID LOAN");
      throw "Invalid Loan";
    }
  }

}

export default Loan;
