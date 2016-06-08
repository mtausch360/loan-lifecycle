
/*@ngInject*/
function AnalysisController($scope, lifecycleService){

  $scope.lifecycles = lifecycleService.getState();
  lifecycleService.createLifecycles();

  let lastCustomDate = $scope.lifecycles.custom.date;
  let lastBaseDate = $scope.lifecycles.base.date;

  // $scope.$watch('lifecycles.date', function(newVal, oldVal, scope){
  //   if( lastCustomDate !== $scope.lifecycles.custom.date && lastBaseDate !== $scope.lifecycles.base.date && newVal !== oldVal ){
  //     $scope.broadcast('redrawAll');

  //   } else if( lastCustomDate !== $scope.lifecycles.custom.date ) {
  //     $scope.broadcast('redrawCustom');
  //   }
  //   // else if( lastBaseDate !== $scope.lifecycles.base.date ) {
  //   //   lifecycleService.
  //   // }
  // });


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

export default AnalysisController;