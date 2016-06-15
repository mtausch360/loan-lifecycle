
function AppController($scope, lifecycleService, $timeout){

  $scope.lifecycles = lifecycleService.getState();
  lifecycleService.createLifecycles();

  let lastCustomDate = $scope.lifecycles.custom.date;
  let lastBaseDate = $scope.lifecycles.base.date;

  $scope.showNav = true;

  $scope.toggleNav = ()=>{
    $scope.showNav = !$scope.showNav;
    render()
    let count = 0;
    function render(){
      $timeout(()=>{
        $scope.$broadcast('render')
        count++
        if( count < 100)
          render()
      }
        , 10);
    }
  };

  $scope.$on('edit', function(event, data){
    console.log('edit event received', data);
    switch(data.type){
      case 'settings':
        redrawCustom();
        break;
      case 'loans':
        redrawAll();
        break;
    }
  });

  function redrawAll(){
    lifecycleService.createLifecycles();
    $scope.$broadcast('redrawAll');
  }

  function redrawCustom(){
    lifecycleService.updateCustom();
    $scope.$broadcast('redrawCustom');
  }



}

export default AppController;