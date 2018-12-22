#Loan Lifecycle

Work in progress. Exploration and visualization tool to control your loan's amortization and repayment schedule.

Loans are currently randomly generated and will randomize on load (refresh to get a new set!). These random loans are meant to model realistic loan balances and interest rates, amortizing over lengthy periods of time. Change the amount extra in the settings tab to see the difference in time that it would take to pay off all loans. Even making $50 extra monthly payments tends to have drastic effects on total repayment of loans over time.

All calculations are done on browser and all data is stored in LocalStorage.

Check it out at http://loan-lifecycle.herokuapp.com

###Technologies
Angular 1.5, ES6, Webpack, Babel, Less, D3, Big.js, Karma, PhantomJS

Todo:
  * Error handling, preventing infinite loops for improper loans
  * Persisting of loans, see above
  * Extra for individual loans
  * filter to display any selection of loans in lifecycle
  * General UI/UX polish
