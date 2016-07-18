function AppController($scope, lifecycleService, $timeout) {

  $scope.lifecycles = lifecycleService.getState();
  lifecycleService.createLifecycles();

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
    }
  });

  function redrawAll() {
    lifecycleService.createLifecycles();
    $scope.$broadcast('redrawAll');
  }



}

export default AppController;
