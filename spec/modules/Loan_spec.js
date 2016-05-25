import Loan from "../../public/modules/Loan.js";

describe("Loan module", function(){

  // beforeEach(function(){
    
  //   console.log('run', loan);
  // });

  it("Should be instantiated from an object", function(){
    var loan;
    loan = new Loan({
          name: 'GLS1',
          principal: 5000,
          interest: 0,
          interestRate: 0.045,
          minimumPayment: 93.22,
        });
    console.log('name', loan);
    expect( loan.name ).toBe('GLS1');
    expect( loan.balance ).toBe( loan.principal + loan.interest);
  });

  //http://www.bankrate.com/calculators/mortgages/loan-calculator.aspx?loanAmount=5000&years=5&terms=60&interestRate=4.50&loanStartDate=24+May+2016&show=true&showRt=false&prods=216&monthlyAdditionalAmount=0&yearlyAdditionalAmount=0&yearlyPaymentMonth=&oneTimeAdditionalPayment=0&oneTimeAdditionalPaymentInMY=&ic_id=mtg_loan_calc_amortization_btn
  it("Should age correctly", function(){
    var loan;
    loan = new Loan({
          name: 'GLS1',
          principal: 5000,
          interest: 0,
          interestRate: 0.045,
          minimumPayment: 93.22,
        });
    loan.age();
    expect( loan.interest ).toBe(18.75);
    expect( loan.principal ).toBe(5000);
  });

  it("should apply payments correctly", function(){
    var loan;
    loan = new Loan({
          name: 'GLS1',
          principal: 5000,
          interest: 0,
          interestRate: 0.045,
          minimumPayment: 93.22,
        });
    loan.makePayment()
  })
});