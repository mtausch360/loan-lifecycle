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
  // console.log("Expect ",num, ' between ', comparison - 1, comparison + 1 )
  return _.inRange(num, comparison - 1, comparison + 1);
}

/**
 * https://en.wikipedia.org/wiki/Amortization_calculator
 * A = P ( i + (i / ( ( 1 + i )^n - 1) ))
 * @return {[type]} [description]
 */
function randomLoan({interestRate=_.random(.01, max.interestRate, true), principal=_.random(1000, max.principal, true), n=_.random(100, max.n, false) }={}){

  // let interestRate = _.random(.01, max.interestRate, true);
  // let principal = _.random(1000, max.principal, true);
  // let n = _.random(100, max.n, false);
  let dueDate = _.random(1, max.dueDate, false)
  let i = big(interestRate).div(12);
  let minimumPayment = big( i ).div( big(1).minus( big( big(i).plus(1) ).pow(-n) ) );
  minimumPayment = Number( big(minimumPayment).times(principal) );
  let loan = {
    name: randomName(),
    interestRate,
    principal,
    balance: principal,
    minimumPayment,
    dueDate,
    n
  };
  console.log('random loan', JSON.stringify(loan) );
  return loan;
}

/**
 * [randomLoans description]
 * @return {[type]} [description]
 */
function randomLoans(){
    let res = []
    let count = 0;
    let max = _.random(3, 7);
    while( count < max ){
      res.push( randomLoan() )
      count++
    }

    return res;
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
  let adjectives = ['big', 'sweet', 'fortuitous', 'sanctimonious', 'kind', 'sweet', 'old', 'wrong', 'deft', 'swift', 'gargantuan',
    'large', 'wholesome', 'toothsome', 'freaky', 'stupid', 'rad', 'miniscule', 'pretty', 'petty', 'dusty', 'crude', 'negative', 'hella',
    'virulent', 'intense', 'uppity', 'hostile', 'angry'
  ];
  let nouns = ['loan', 'bond', 'annuity', 'pain', 'burden', 'afterthought', 'weight', 'thing', 'chunk', 'tuition', 'morsel', 'piece', 'threat',
    'pal', 'cash', 'scrilla', 'nickels', 'eternity', 'bucks', 'cheddar', 'cabbage', 'clams', 'Gs', 'loot', 'shekels', 'scratch','nega-dollars', 'doll hairs'
  ];
  let randomAdjectives = _.random(1,3);
  let str = '';
  for( var i = 0; i < randomAdjectives; i++){
    if(str.length)
      str += ', ';
    str += _.capitalize( adjectives[ _.random(0, adjectives.length - 1, false) ] );
  }
  return str + (str.length ? ' ' : '') + _.capitalize(nouns[ _.random(0, nouns.length - 1, false ) ]);
}

export { inRange, randomLoan, randomLoans, expectedGrowth };
