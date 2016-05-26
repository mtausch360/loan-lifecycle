import Loan from "../../public/modules/Loan.js";
import Lifecycle from "../../public/modules/Lifecycle.js";

describe('Lifecycle', function(){
  var lifecycle;

  beforeEach(function(){
    lifecycle = new Lifecycle({ custom: false, loans: Loans, extra: 0,   });
  });

});
