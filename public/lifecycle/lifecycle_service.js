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
    	create,
    	createLifecycles
    };

    function createLifecycles(loans, settings){

    	return;
    	lifecycleState.custom.lifecycle = new Lifecycle(loans, settings.method, settings.amountExtra );
    	lifecycleState.custom.date = Date.now();

    	lifecycleState.base.lifecycle = new Lifecycle(loans, settings.method);
    	lifecycleState.base.date = Date.now();

    }

    function getLifecycle() {
        return lifecycleState;
    }

    function create(loans, method, amountExtraPerMonth = 0) {
 
        var Loans = [];
        _.each(loans, function(loan){
            Loans.push( new Loan(loan) );
        });

        amountExtraPerMonth = amountExtraPerMonth || 0;
        var lifecycle = {
            method: method,
            amountExtraPerMonth: amountExtraPerMonth,
            series: [],
            totalPaid: 0,
        };

        var monthIndex = 1;
        var cumulativeMonth;
        var amountExtraNow;

        var init = lifecycle.series[0] = {

            monthIndex: monthIndex,

            minimumPayment: 0,

            amountExtraPaid: 0,

            amountPaid: 0,

            currentBalance: 0,

            interest: 0

        };

        _.each(Loans, function(l) {

            init.minimumPayment += l.minimumPayment;
            init.currentBalance += l.currentBalance;

        });

        while (lifecycleIncomplete(Loans)) {

            amountExtraNow = amountExtraPerMonth;

            switch (method) {
                case 'HI_INTEREST':
                    bubbleSort(Loans, 'interestRate');
                    break;
                case 'LO_BALANCE':
                    bubbleSort(Loans, 'currentBalance');
                    break;
            }

            //initialize lifecycle
            lifecycle.series[monthIndex] = {

                monthIndex: monthIndex,

                minimumPayment: 0,

                amountExtraPaid: 0,

                amountPaid: 0,

                currentBalance: 0,

                interest: 0

            };

            cumulativeMonth = lifecycle.series[monthIndex];

            _.each(Loans, function(L, i) {
                L.age();
                let { amountTendered,amountPaid, change, principalPaid, interestPaid } = L.makePayment( L.minimumPayment + amountExtraNow );

                amountExtraNow = L.minimumPayment - change -; //need to calculate how much extra cash has been spent
                cumulativeMonth.amountPaid += amountPaid;
                // cumulativeMonth.amountExtraPaid += amountExtraPaid;
                cumulativeMonth.principalPaid += principalPaid;
                cumulativeMonth.interestPaid += interestPaid;
                cumulativeMonth.interest += res.interest;

                cumulativeMonth.balance += L.balance;

            });




            lifecycle.totalPaid += cumulativeMonth.amountPaid;

            monthIndex++;
        }



        return lifecycle;
    }


    function bubbleSort(array, key) {
        var flag = false;
        var prev = array[0];
        for (var i = 1; i < array.length; i++) {
            var curr = array[i];
            if (prev[key] > curr[key]) {
                array[i] = prev;
                array[i - 1] = curr;
                flag = true;
            }
            prev = array[i];
        }
        if (!flag)
            return array;
        else
            return bubbleSort(array, key);
    }


    function lifecycleIncomplete(loans) {

        var isComplete = true;
        var loan;

        for (var i = 0; i < loans.length; i++) {
            loan = loans[i];
            if (loan.currentBalance > 0) {

                isComplete = false;
            }
        }

        return !isComplete;
    }
}



export default lifecycleService;