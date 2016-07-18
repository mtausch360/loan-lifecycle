
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
 * @return {Object} Returns randomized loan within test suite settings
 */
function randomLoan({interestRate=_.random(.01, max.interestRate, true), principal=_.random(5000, max.principal, true), n=_.random(100, max.n, false) }={}){

  let dueDate = _.random(1, max.dueDate, false)
  let i = Big(interestRate).div(12);
  let minimumPayment = Number( Big( Big( i ).div( Big(1).minus( Big( Big(i).plus(1) ).pow(-n) ) ).times(principal) ) );

  let loan = {
    name: randomName(),
    interestRate,
    principal,
    balance: principal,
    minimumPayment,
    dueDate,
    n
  };

  // console.log('random loan', JSON.stringify(loan) );
  return loan;
}

/**
 * Returns random amount of random loans, used for demo purposes
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
 *     Testing function
 * @param  {[type]} l [description]
 * @return {[type]}   [description]
 */
function expectedGrowth(l, n){
  return Number(Big(l.principal).times(Number(Big(1 + Number(Big(l.interestRate).div(12))).pow(n))));
}

/**
 * returns random name for loans
 *
 */
function randomName(){
  let adjectives = ['Big', 'sweet', 'fortuitous', 'sanctimonious', 'kind', 'sweet', 'old', 'wrong', 'deft', 'swift', 'gargantuan',
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
