import tpl from './lifecycle_settings.html';

function lifecycleSettingsDirective(){
  return {
    replace: true,
    restrict: "E",
    template: tpl,
    link: ()=>{}
  };
}

export default lifecycleSettingsDirective