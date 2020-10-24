/**
 * [AppController description]
 * @param {[type]} $scope           [description]
 * @param {[type]} lifecycleService [description]
 * @param {[type]} $timeout         [description]
 */
function AppController($scope, lifecycleService, optionsService, $timeout) {

  $scope.lifecycles = lifecycleService.getState();
  lifecycleService.createLifecycles();

  $scope.loans = optionsService.getLoans();
  $scope.settings = optionsService.getSettings();

  $scope.showNav = true;

  $scope.toggleNav = () => {
    $scope.showNav = !$scope.showNav;
    let count = 0;
    render();
    function render() {
      $timeout(() => {
        $scope.$broadcast('render');
        count++;
        if (count < 50)
          render()
      }, 10);
    }
  };

  $scope.$on('edit', function (event, data) {
    switch (data.type) {
      case 'settings':
        redrawAll();
        break;

      case 'loans':
        redrawAll();
        break;

      default:
        redrawAll();
        break;
    }
  });

  function redrawAll() {
    lifecycleService.createLifecycles();
    $scope.visibleLoanCount = $scope.loans.filter((l) => l.visible).length

  }

}

export default AppController;
