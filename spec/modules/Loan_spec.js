import Loan from "../../public/modules/Loan.js";

describe("Loan module", function(){
  var loan;
  beforeEach(function(){
    loan = new Loan({
          name: 'GLS1',
          principal: 5000,
          interest: 0,
          interestRate: 0.045,
          minimumPayment: 93.22,
        });
  });

  it("Should be instantiated from an object", function(){
    expect( loan.name ).toBe('GLS1');
    expect( loan.balance ).toBe( loan.principal + loan.interest);
  });

  //http://www.bankrate.com/calculators/mortgages/loan-calculator.aspx?loanAmount=5000&years=5&terms=60&interestRate=4.50&loanStartDate=24+May+2016&show=true&showRt=false&prods=216&monthlyAdditionalAmount=0&yearlyAdditionalAmount=0&yearlyPaymentMonth=&oneTimeAdditionalPayment=0&oneTimeAdditionalPaymentInMY=&ic_id=mtg_loan_calc_amortization_btn
  it("Should age correctly", function(){

    loan.age();
    expect( loan.interest ).toBe(18.75);
    expect( loan.principal ).toBe(5000);

    loan.age();
    loan.makePayment()
  });

  it("should apply payments correctly", function(){
    loan.age();

    var {
        amountTendered,
        amountPaid,
        change,
        principalPaid,
        interestPaid } = loan.makePayment( loan.minimumPayment );

    expect(amountTendered).toBe(loan.minimumPayment);
    expect(amountPaid).toBe(amountTendered);
    expect(change).toBe(0);
    expect(principalPaid).toBe(74.47);
    expect(interestPaid).toBe(18.75);

  });

  it("should follow its proper lifecycle", function(){
    var last;
    var counter = 0;
    while( loan.alive ){
      loan.age();
      last = loan.makePayment( loan.minimumPayment );
      counter++;
    }

    expect(loan.interestAccrued).toBe(592.91);
    expect(counter).toBe(60);
    expect(loan.balance).toBe(0);
    expect(loan.interest).toBe(0);
  });

  it("should follow proper lifecycle with adding extra", function(){
    var last;
    var counter = 0;
    while( loan.alive ){
      loan.age();
      last = loan.makePayment( loan.minimumPayment + 1000 );
      counter++;
    }

    expect(loan.interestAccrued).toBe(53.31);
    expect(counter).toBe(5);
    expect(loan.balance).toBe(0);
    expect(loan.interest).toBe(0);
  });
});
