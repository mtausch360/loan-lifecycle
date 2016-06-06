function lifecycleService() {

    var lifecycleState = {
        base: {
            date: null,
            lifecycle: null

        },
        custom: {
            date: null,
            lifecycle: null
        }
    };

    return {
    	getLifecycle,
    	createLifecycles
    };

    function createLifecycles(loans, settings){

    	return;
    	lifecycleState.custom.lifecycle = new Lifecycle(loans, settings);
    	lifecycleState.custom.date = Date.now();

    	lifecycleState.base.lifecycle = new Lifecycle(loans, settings);
    	lifecycleState.base.date = Date.now();

    }

    function getLifecycle() {
        return lifecycleState;
    }

}



export default lifecycleService;