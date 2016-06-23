// import Loan from "../../public/modules/Loan.js";
import Lifecycle from "./Lifecycle.js";

describe('Lifecycle module', function () {
  var loans;

  beforeEach(function () {
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
    }];

  });

  it('should complete the lifecycle without errors', function () {
    var lifecycle = new Lifecycle(loans, { extra: 0, method: 'HI_BALANCE' });
    expect(lifecycle).not.toBe(undefined);
  });

  it('should give series objects in order of date', ()=>{
    var lifecycle = new Lifecycle(loans, { extra: 0, method: 'HI_BALANCE' });
    console.log('lifecycle', lifecycle.lifecycle);
    expect(lifecycle.lifecycle.series[0].day).toBe(2);
    expect(lifecycle.lifecycles.series[1].day).toBe(3);
    expect(lifecycle.lifecycle.series[2].day).toBe(8);
  });

  it('should order loans based on method', ()=>{
    var lifecycle = new Lifecycle(loans, { extra: 0, method: 'HI_BALANCE' });

  });

});
