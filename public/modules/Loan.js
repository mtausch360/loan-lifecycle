class Loan {

  constructor({name, id = Math.floor(Math.random()*10000), interestRate, minimumPayment, principal, interest} ){
    this.name = name;
    this.id = id;
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
   * Calling this function also ages the Loan one month and capitalizes and previous interest
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

    //first pay off any interest
    if( this.interest - amount > 0){
      interestPaid = amount;
      amount = 0;
      this.interest -= interestPaid;
    } else {
      interestPaid = this.interest;
      amount -= this.interest;
      this.interest = 0;
    }

    //then pay off principal balance
    if( this.principal - amount > 0){
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
        amountPaid: interestPaid + principalPaid,
        change: amount,
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

    var monthlyInterestAccrued = this.interestRate / 12 * this.principal;

    this.interest += monthlyInterestAccrued;
    this.interestAccrued += monthlyInterestAccrued;

    this._calculateBalance();

  }

  /**
   * [_calculateBalance description]
   * @return {[type]} [description]
   */
  _calculateBalance(){
    if( this.principal || this.interest)
      this.balance = this.principal + this.interest;
    else {
      this.balance = 0;
      this.alive = false;
    }
  }
}

export default Loan;
