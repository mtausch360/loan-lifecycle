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
    	createLifecycles,
        updateCustom,
    };

    function createLifecycles(){
        updateCustom();
        updateBase();
        lifecycleState.date = Date.now();
        console.log(lifecycleState);

    }

    function updateCustom(){
        let custom = new Lifecycle(loanService.getLoans(), loanService.getSettings());
        if( !lifecycleState.custom.lifecycle)
            lifecycleState.custom.lifecycle = custom;
        else
            _.extend(lifecycleState.custom.lifecycle, custom);

        lifecycleState.custom.date = Date.now();
    }

    function updateBase(){
        let base = new Lifecycle(loanService.getLoans(), loanService.getSettings(), /* base lifecycle */ true);
        if( !lifecycleState.base.lifecycle)
            lifecycleState.base.lifecycle = base;
        else
            _.extend(lifecycleState.base.lifecycle, base);

        lifecycleState.base.date = Date.now();
    }

    function getState() {
        return lifecycleState;
    }

}



export default lifecycleService;