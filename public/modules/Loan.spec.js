import Loan from "./Loan.js";
import { inRange } from "./util.js";

describe("Loan module", function () {
  var loan;
  beforeEach(function () {
    loan = new Loan({
      name: 'GLS1',
      principal: 5000,
      interest: 0,
      interestRate: 0.045,
      minimumPayment: 93.22,
    });
  });

  it("Should be instantiated from an object", function () {
    expect(loan.name).toBe('GLS1');
    expect(loan.balance).toBe(loan.principal + loan.interest);

    let l = new Loan({interest: 400, principal: 500, interestRate: 0.1, minimumPayment: 300 });
    expect(l.balance).toBe(900);

    let l2 = new Loan({balance: 400, interestRate: 0.1, minimumPayment: 300 })
    expect(l2.principal).toBe(400);
  });

  it("Should age correctly", function () {

    loan.age();
    expect( inRange(loan.interest, 18.75) ).toBe(true);
    expect( inRange(loan.principal, 5000) ).toBe(true);

    var l = new Loan({
      principal: 1000,
      interestRate: 0.1, // 10% annually,
      minimumPayment: 100
    });

    for(var i = 0; i < 12; i++) l.age();

    // 1000(1 + .1/12 )^12 = 1104.7131
    expect( inRange(l.balance, 1104.7131) ).toBe(true);


  });

  it("should apply payments correctly", function () {
    loan.age();

    var {
      amountTendered,
      amountPaid,
      extraLeft,
      principalPaid,
      interestPaid
    } = loan.makePayment();

    expect(amountTendered).toBe(loan.minimumPayment);
    expect(amountPaid).toBe(amountTendered);
    expect(extraLeft).toBe(0);
    expect(principalPaid).toBe(74.47);
    expect(interestPaid).toBe(18.75);

  });



  //test is close to passing, other calculator take dates to be more accurate than what we do (dividing months by 12 evenly)
  it("should follow its proper lifecycle", function () {
    var last;
    var counter = 0;
    while (loan.alive) {
      loan.age();
      last = loan.makePayment();
      counter++;
    }

    expect( inRange(loan.interestAccrued, 592.91) ).toBe(true);
    expect(counter).toBe(60);
    expect(loan.balance).toBe(0);
    expect(loan.interest).toBe(0);
  });


  it("should follow proper lifecycle with adding extra", function () {
    var last;
    var counter = 0;
    while (loan.alive) {
      loan.age();
      last = loan.makePayment(1000);
      counter++;
    }

    expect( inRange(loan.interestAccrued, 53.31)).toBe(true);
    expect(counter).toBe(5);
    expect(loan.balance).toBe(0);
    expect(loan.interest).toBe(0);
  });

  it("should throw when getting an improper loan", ()=>{
    expect( () => new Loan({ balance: 1000, minimumPayment: 0, interestRate: 0})).toThrow();
  });
});

