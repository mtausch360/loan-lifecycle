angular.module('loanVisualizer')
  .directive('loanPanel', [ function(){
    return {
      templateUrl: 'loan_panel.html',
      link: function( $scope, element, attrs ){

        $scope.settings = {
          method: 'HI_INTEREST',
          amountExtra: 10000
        };

        $scope.loans = []

        if( localStorage.getItem('loans') ){
          $scope.loans = localStorage.getItem('loans');
        }

        $scope.$watch('settings', function(newValue, oldValue, scope){

          $scope.$emit('edit', $scope.settings);

        }, true);

        $scope.$watch('loans', function(){
          localStorage.setItem('loans', $scope.loans);
        });
      }
    };
  }]);