// import Loan from "../../public/modules/Loan.js";
import Lifecycle from "./Lifecycle.js";

describe('Lifecycle module', function(){
  var loans;

  beforeEach(function(){
    loans = [{
        name: 'sm1',
        balance: 11350.12,
        principal: 11350.12,
        interest: 0,
        interestRate: 0.0825,
        minimumPayment: 229.88,
      },
      {
        name: 'sm2',
        balance: 7897.15,
        principal: 7897.15,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 136.10,
      },
      {
        name: 'sm3',
        balance: 5738.86,
        principal: 5738.86,
        interest: 0,
        interestRate: 0.0725,
        minimumPayment: 98.29,
      }];

  });

  it('should complete the lifecycle without errors', function(){
    var lifecycle = new Lifecycle(loans, {extra: 0, method: 'HI_BALANCE'});
    expect( lifecycle ).not.toBe(undefined);
  });

});
