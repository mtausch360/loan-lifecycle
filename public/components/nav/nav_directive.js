import tpl from './nav.html';

function lifecycleNav() {
  return {
    replace: true,
    template: tpl,
    link: function (scope, element, attrs) {
      scope.showSettings = false;
      scope.toggleShowSettings = (show) => {
        scope.showSettings = show;
      };
    }
  }
}

export default lifecycleNav;
