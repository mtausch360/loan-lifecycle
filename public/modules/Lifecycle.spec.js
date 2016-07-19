import Lifecycle from "./Lifecycle.js";
import {inRange, randomLoan} from "./util.js";

describe('Lifecycle module', ()=>{
  var loans;
  var simpleLoan;
  var longLoan;

  beforeEach(()=>{

    loans = [{
      name: 'sm1',
      balance: 1000,
      dueDate: 8,
      interestRate: 0.08,
      minimumPayment: 200,
    }, {
      name: 'sm2',
      balance: 1000,
      dueDate: 3,
      interestRate: 0.08,
      minimumPayment: 200,
    }, {
      name: 'sm3',
      balance: 1000,
      dueDate: 2,
      interestRate: 0.08,
      minimumPayment: 200,
    },{
      name: 'sm3',
      balance: 1000,
      dueDate: 11,
      interestRate: 0.08,
      minimumPayment: 200,
    }];

    simpleLoan = [{
      balance: 1005,
      dueDate: 1,
      interestRate: .01,
      minimumPayment: 84
    }];

    longLoan = [{
      balance: 100000,
      interestRate: .045,
      minimumPayment: 632.65
    }];



  });

  it('should complete the lifecycle without errors', ()=>{
    var lifecycle = new Lifecycle(loans);
    expect(lifecycle).not.toBe(undefined);
  });

  it('should complete lifecycle with relative accuracy', ()=>{
    var lifecycle = new Lifecycle(simpleLoan);
    expect(lifecycle.lifecycle.series.length ).toBe(13);
  });

  //http://www.bankrate.com/calculators/mortgages/loan-calculator.aspx?loanAmount=100000&years=20.000&terms=240&interestRate=4.500&loanStartDate=28+Jun+2016&show=true&showRt=false&prods=387&monthlyAdditionalAmount=0&yearlyAdditionalAmount=0&yearlyPaymentMonth=+Jun+&oneTimeAdditionalPayment=0&oneTimeAdditionalPaymentInMY=+Jul+2016&ic_id=mtg_loan_calc_amortization_btn
  it('should handle longer lifecycles correctly',()=>{
    var lifecycle = new Lifecycle(longLoan);
    let expectedInterestPaid = 51835.85;
    let expectedPrincipalPaid = longLoan[0].balance;
    expect( inRange(lifecycle.lifecycle.totalInterestPaid, expectedInterestPaid) ).toBe(true);
    expect( inRange(lifecycle.lifecycle.totalPaid, expectedInterestPaid + longLoan[0].balance) ).toBe(true);
    expect( lifecycle.lifecycle.series.length ).toBe(240);

  });


  it('should handle random perfect loans', ()=>{
    let count = 0;
    while( count < 1 ){
      let l = randomLoan();
      let life = new Lifecycle([l]);
      console.log(life.lifecycle);
      expect( life.lifecycle.series.length ).toBe(l.n+1);
      count++;
    }
  });

});
