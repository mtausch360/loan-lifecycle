let big = require('big.js');

//test suite settings
const max = {
  principal: 25000,
  n: 500,
  interestRate: .25,
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
 * A = P ( i + (i / ( ( 1 + i )^n - 1) ))
 * @return {[type]} [description]
 */
function randomLoan(){

  let interestRate = _.random(.01, max.interestRate, true);
  let principal = _.random(1000, max.principal, true);
  let n = _.random(100, max.n, false);
  let dueDate = _.random(1, max.dueDate, false)

  let minimumPayment = interestRate/12 + Number( big(interestRate).div( big( 1 + interestRate/12).pow(n).minus(1) ) );
  minimumPayment *= principal;
  let loan = {
    name: randomName(),
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
 *     // 1000(1 + .1/12 )^n = balance
 * @param  {[type]} l [description]
 * @return {[type]}   [description]
 */
function expectedGrowth(l, n){
  return Number(big(l.principal).times(Number(big(1 + Number(big(l.interestRate).div(12))).pow(n))));
}

/**
 * [randomName description]
 * @return {[type]} [description]
 */
function randomName(){
  let adjectives = ['big', 'sweet', 'fortitious', 'sanctimonious', 'kind', 'sweet', 'old', 'wrong', 'deft', 'swift', 'gargantuan',
    'large', 'wholesome', 'toothsome', 'freaky', 'stupid', 'rad', 'miniscule', 'pretty'];
  let nouns = ['loan', 'bond', 'annuity', 'pain', 'burden', 'afterthought', 'weight', 'thing', 'chunk', 'tuition', 'morsel', 'piece', 'threat'];
  let randomAdjectives = _.random(1,3);
  let str = '';
  for( var i = 0; i < randomAdjectives; i++){
    if(str.length)
      str += ', ';
    str += adjectives[ _.random(0, adjectives.length - 1, false) ];
  }
  return str + (str.length ? ' ' : '') + nouns[ _.random(0, nouns.length - 1, false ) ];
}

export { inRange, randomLoan, expectedGrowth };
