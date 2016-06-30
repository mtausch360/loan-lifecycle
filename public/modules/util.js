let big = require('big.js');

//test suite settings
const max = {
  principal: 500000,
  n: 300,
  interestRate: .27,
  dueDate: 28
};

/**
 * Default testing function
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
function inRange(num, comparison){
  console.log("Expect ",num, ' between ', comparison - 1, comparison + 1 )
  return _.inRange(num, comparison - 1, comparison + 1);
}

/**
 * https://en.wikipedia.org/wiki/Amortization_calculator
 * @return {[type]} [description]
 */
function randomLoan(){

  let interestRate = _.random(.01, max.interestRate, true);
  let principal = _.random(1000, max.principal, true);
  let n = _.random(5, max.n, false);
  let dueDate = _.random(5, max.dueDate, false)
  let minimumPayment;
  try{
    minimumPayment = principal * ( interestRate + Number( big(interestRate).div( Number(big( 1 + interestRate, n).pow(n)) - 1) ) );
  }
  catch(e){
    console.log(e, interestRate, principal, n);
  }
  let loan = {
    interestRate,
    principal,
    minimumPayment,
    dueDate,
    n
  };
  console.log('random loan', JSON.stringify(loan) );
  return loan;
}

/**
 *     // 1000(1 + .1/12 )^12 = 1104.7131
 * @param  {[type]} l [description]
 * @return {[type]}   [description]
 */
function expectedGrowth(l, n){
  return Number(big(l.principal).times(Number(big(1 + Number(big(l.interestRate).div(12))).pow(n))));
}

export { inRange, randomLoan, expectedGrowth };
