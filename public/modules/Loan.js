class Loan {

  //find better way to id things
  constructor( { name, interestRate, minimumPayment, principal, interest } ){
    this.name = name;
    this.id = Math.floor(Math.random()*10000);
    this.interestRate = interestRate;
    this.minimumPayment = minimumPayment;
    this.principal = principal;
    this.interest = interest;
    this.balance = this.principal + this.interest;

    this.interestAccrued = 0;

    if( this.balance ) this.alive = true;

  }

  /**
   * Payments assume that any overpayment is applied to principal balance.
   * Calling this function also ages the Loan one month and capitalizes any previous interest
   *
   * @param  {[number]} amount [total money to paydown on this loan]
   * @return {[type]}     [description]
   */
  makePayment(amount){

    var amountTendered = amount;
    var interestPaid = 0;
    var amountPaid = 0;
    var principalPaid = 0;
    var change;
    var extra = amountTendered - this.minimumPayment;

    //first pay off any interest
    if( this.interest - amount >= 0){
      interestPaid = amount;
      amount = 0;
      this.interest -= interestPaid;
    } else {
      interestPaid = this.interest;
      amount -= this.interest;
      this.interest = 0;
    }

    //then pay off principal balance
    if( this.principal - amount >= 0){
      principalPaid = amount;
      amount = 0;
      this.principal -= principalPaid;
    } else {
      principalPaid = this.principal;
      amount -= this.principal;
      this.principal = 0;
    }



    this._calculateBalance();

    return {
        amountTendered,
        amountPaid: (interestPaid + principalPaid),
        extraPaid: this.minimumPayment,
        change: amount,
        // extraPaid: (amountTendered - this.minimumPayment),
        principalPaid,
        interestPaid
    };

  }

  /**
   * Ages the loan one month and capitalizes any previous interest
   * @return {[type]} [description]
   */
  age(){

    //assume capitalization
    this.principal += this.interest;
    this.interest = 0;

    //need better way to deal with division, losing significance
    var monthlyInterestAccrued = Number( (this.interestRate / 12 * this.principal).toFixed(2));

    this.interest += monthlyInterestAccrued;
    this.interestAccrued += monthlyInterestAccrued;

    this._calculateBalance();

  }

  /**
   * [_calculateBalance description]
   * @return {[type]} [description]
   */
  _calculateBalance(){
      this.balance = this.principal + this.interest;

      if( this.balance )
        this.alive = false;
    }
  }
}

export default Loan;
