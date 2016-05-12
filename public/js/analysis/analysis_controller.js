angular.module('loanVisualizer')
  .controller('AnalysisController', ['$scope', function( $scope ){

    $scope.lifecycle = null;

    $scope.$on('edit', function(event, settings){
      $scope.base = $scope.createLifecycle($scope.Loans, settings.method, 0);
      $scope.lifecycle = $scope.createLifecycle($scope.Loans, settings.method, settings.amountExtra)
    });

    $scope.Loans = [
      {
        name: 'sm1',
        currentBalance: 11350.12,
        interestRate: 0.0825,
        minimumPayment: 229.88,
      },
      {
        name: 'sm2',
        currentBalance: 7897.15,
        interestRate: 0.0725,
        minimumPayment: 136.10,
      },
      {
        name: 'sm3',
        currentBalance: 5738.86,
        interestRate: 0.0725,
        minimumPayment: 98.29,
      },
      {
        name: 'AES1',
        currentBalance: 8778.63,
        interestRate: 0.0377,
        minimumPayment: 53.82,
      },

      {
        name: 'GLS1',
        currentBalance: 11293.97,
        interestRate: 0.034,
        minimumPayment: 53.82,
      },
      {
        name: 'AES2',
        currentBalance: 7563.24,
        interestRate: 0.0386,
        minimumPayment: 53.82,
      }
      // {
      //   name: 'AES1',
      //   currentBalance: 8778.63,
      //   interestRate: 0.0377,
      //   minimumPayment: 53.82,
      // },
      // {
      //   name: 'AES1',
      //   currentBalance: 8778.63,
      //   interestRate: 0.0377,
      //   minimumPayment: 53.82,
      // },
    ];


    $scope.createLifecycle = function (loans, method, amountExtraPerMonth) {

      loans = angular.copy(loans);

      amountExtraPerMonth = amountExtraPerMonth || 0;

      var lifecycle = {
        method: method,
        amountExtraPerMonth: amountExtraPerMonth,
        series: [],
        totalPaid: 0,
      };

      var monthIndex = 1;
      var cumulativeMonth;
      var amountExtraNow;

      var init = lifecycle.series[0] = {

        monthIndex: monthIndex,

        minimumPayment: 0,

        amountExtraPaid: 0,

        amountPaid: 0,

        currentBalance: 0,

        interest: 0

      };

      _.each(loans, function(l){

        init.minimumPayment +=  l.minimumPayment;
        init.currentBalance +=  l.currentBalance;
      })

      while ( lifecycleIncomplete( loans )  ) {

        amountExtraNow = amountExtraPerMonth;

        sortForMethod(loans, method);

        //initialize lifecycle
        lifecycle.series[monthIndex] = {

          monthIndex: monthIndex,

          minimumPayment: 0,

          amountExtraPaid: 0,

          amountPaid: 0,

          currentBalance: 0,

          interest: 0

        };

        cumulativeMonth = lifecycle.series[monthIndex];

        //calculate entire month of loans
        for( var i = 0, loan; i < loans.length; i++){
          loan = loans[i];

          if( loan.currentBalance < 0 )
            loan.currentBalance = 0;

          //initialize values
          var amountPaid = 0; // total paid for this loan this month (including extra)
          var amountExtraPaid = 0;

          //add the interest
          var interest = loan.interestRate / 12 * loan.currentBalance;
          loan.currentBalance += interest;

          if( loan.currentBalance !== 0){

            if( loan.currentBalance - loan.minimumPayment <= 0 ){ //if minimum payment is more than required

              amountExtraPaid = 0;

              amountPaid = loan.currentBalance;
            }

            //figure out how much to pay per month per loan
            if( amountExtraNow  !== 0){

              if( loan.currentBalance - ( loan.minimumPayment + amountExtraNow ) <= 0 ) { //some extra

                amountExtraPaid = loan.currentBalance - loan.minimumPayment;
                amountExtraNow -= amountExtraPaid;

                amountPaid = loan.minimumPayment + amountExtraPaid;


              } else { //all extra

                amountExtraPaid = amountExtraNow;
                amountExtraNow = 0;

                amountPaid = loan.minimumPayment + amountExtraPaid;

              }

            } else {

              amountExtraPaid = 0;

              amountPaid = loan.minimumPayment;

            }
          }

          //pay the loan
          loan.currentBalance -= amountPaid;

          cumulativeMonth.amountPaid += amountPaid;
          cumulativeMonth.amountExtraPaid += amountExtraPaid;
          cumulativeMonth.interest += interest;

          cumulativeMonth.currentBalance += loan.currentBalance;

        }

        lifecycle.totalPaid += cumulativeMonth.amountPaid;

        monthIndex++;
      }



      return lifecycle;
    }

    function sortForMethod(loans, method, amountExtraPerMonth){

      // def not final need to consider loans that are already done
      // should also include amount to give to each loan in this section
      switch(method){
        case 'HI_INTEREST':
          bubbleSort(loans, 'interestRate');
          break;
        case 'LO_BALANCE':
          bubbleSort(loans, 'currentBalance');
          break;
      }

      function bubbleSort(array, key){
        var flag = false;
        var prev = array[0];
        for(var i = 1; i < array.length; i++ ){
          var curr = array[i];
          if(prev[key] > curr[key]){
            array[i] = prev;
            array[i-1] = curr;
            flag = true;
          }
          prev = array[i];
        }
        if(!flag)
          return array;
        else
          return bubbleSort(array, key);
      }
    }


    function lifecycleIncomplete(loans) {

      var isComplete = true,
        loan;

      for( var i = 0; i < loans.length; i++ ){
        loan = loans[i];
        if (loan.currentBalance > 0 ){

          isComplete = false;
        }
      }

      return !isComplete;
    }

  }]);