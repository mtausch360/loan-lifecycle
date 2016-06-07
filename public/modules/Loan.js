class Loan {

    constructor({ name, interestRate, minimumPayment, principal, interest }) {
        this.name = name;
        //find better way to id things
        this.id = Math.floor(Math.random() * 10000);
        this.interestRate = interestRate;
        this.minimumPayment = minimumPayment;
        this.principal = principal;
        this.interest = interest;
        this.interestAccrued = 0;
        this.alive = true;

        this._calculateBalance();
    }

    /**
     * Payments assume that any overpayment is applied to principal balance.
     * Calling this function also ages the Loan one month and capitalizes any previous interest
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
        if( this.interest - minimumPayment <= 0){ //take portion of min
            interestPaid += this.interest;
            minimumPayment -= this.interest;
            this.interest = 0;

        } else if ( this.interest - ( minimumPayment + extra ) <= 0 ){ //take all min, some extra
            interestPaid += minimumPayment;
            this.interest -= minimumPayment;
            minimumPayment = 0;

            interestPaidByExtra += this.interest;
            extra -= this.interest;
            this.interest -= this.interest;

        } else if( this.interest - (minimumPayment + extra ) > 0 ){ //take all min, all extra
            interestPaid += minimumPayment;
            this.interest -= minimumPayment;
            minimumPayment = 0;

            interestPaidByExtra += extra;
            this.interest -= extra;
            extra = 0;
        }

        //principal
        if( this.principal - minimumPayment <= 0){ //take portion of min, no extra
            principalPaid += this.principal;
            minimumPayment -= this.principal;
            this.principal = 0;

        } else if ( this.principal - ( minimumPayment + extra ) <= 0 ){ //take all of min some extra
            principalPaid += minimumPayment;
            this.principal -= minimumPayment;
            minimumPayment = 0;

            principalPaidByExtra += this.principal;
            extra -= this.principal;
            this.principal = 0;

        } else if( this.principal - (minimumPayment + extra ) > 0 ){ //take all min, all extra
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

            amountPaid: ( interestPaid + interestPaidByExtra + principalPaid + principalPaidByExtra ),

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

        //assume capitalization
        this.principal += this.interest;
        this.interest = 0;

        //need better way to deal with division, losing significance
        var monthlyInterestAccrued = Number((this.interestRate / 12 * this.principal).toFixed(2));

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
}

export default Loan;
