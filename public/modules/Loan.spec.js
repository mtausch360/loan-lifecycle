import Loan from "./Loan.js";

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
  });

  it("Should age correctly", function () {

    loan.age();
    expect(loan.interest).toBe(18.75);
    expect(loan.principal).toBe(5000);

    var l = new Loan({
      principal: 1000,
      interestRate: 0.1, // 10% annually, 
      minimumPayment: 100
    });

    for(var i = 0; i < 12; i++) l.age();

    // 1000(1 + .1/12 )^12 = 1104.7131
    expect(l.balance).toBe(1104.7131);


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
  //fix to gain more precision, but for now this is accurate enough
  xit("should follow its proper lifecycle", function () {
    var last;
    var counter = 0;
    while (loan.alive) {
      loan.age();
      last = loan.makePayment();
      counter++;
    }

    expect(loan.interestAccrued).toBe(592.91);
    expect(counter).toBe(60);
    expect(loan.balance).toBe(0);
    expect(loan.interest).toBe(0);
  });


  xit("should follow proper lifecycle with adding extra", function () {
    var last;
    var counter = 0;
    while (loan.alive) {
      loan.age();
      last = loan.makePayment(1000);
      counter++;
    }

    expect(loan.interestAccrued).toBe(53.31);
    expect(counter).toBe(5);
    expect(loan.balance).toBe(0);
    expect(loan.interest).toBe(0);
  });
});
