import Lifecycle from '../modules/Lifecycle.js';

function lifecycleService(loanService) {

    var lifecycleState = {
        base: {
            date: null,
            lifecycle: null

        },
        custom: {
            date: null,
            lifecycle: null
        },
        date: null
    };

    return {
    	getState,
    	createLifecycles
    };

    function createLifecycles(){
        updateCustom();
        updateBase();
        lifecycleState.date = Date.now();
        console.log(lifecycleState);

    }

    function updateCustom(){
        lifecycleState.custom.lifecycle = new Lifecycle(loanService.getLoans(), loanService.getSettings());
        lifecycleState.custom.date = Date.now();
    }

    function updateBase(){
        lifecycleState.base.lifecycle = new Lifecycle(loanService.getLoans(), loanService.getSettings(), /* base lifecycle */ true);
        lifecycleState.base.date = Date.now();
    }

    function getState() {
        return lifecycleState;
    }

}



export default lifecycleService;