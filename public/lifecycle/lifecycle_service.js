function lifecycleService() {
    var lifecycle = {
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
    	lifecycle.custom.lifecycle = create(loans, settings.method, settings.amountExtra );
    	lifecycle.custom.date = Date.now();

    	lifecycle.base.lifecycle = create(loans, settings.method, 0 );
    	lifecycle.base.date = Date.now();

    }

    function getLifecycle() {
        return this.lifecycle;
    }

    function create(loans, method, amountExtraPerMonth) {

        loans = angular.copy(loans);
        amountExtraPerMonth = amountExtraPerMonth || 0;
        lifecycle = {
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

        _.each(loans, function(l) {

            init.minimumPayment += l.minimumPayment;
            init.currentBalance += l.currentBalance;

        });

        while (lifecycleIncomplete(loans)) {

            amountExtraNow = amountExtraPerMonth;

            switch (method) {
                case 'HI_INTEREST':
                    bubbleSort(loans, 'interestRate');
                    break;
                case 'LO_BALANCE':
                    bubbleSort(loans, 'currentBalance');
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

            _.each(loans, function(loan, i) {
                var res = calculateMonth(loan, amountExtraNow);

                amountExtraNow = res.amountExtraNow;
                cumulativeMonth.amountPaid += res.amountPaid;
                cumulativeMonth.amountExtraPaid += res.amountExtraPaid;
                cumulativeMonth.amountPrincipalPaid += res.amountPrincipalPaid;
                cumulativeMonth.amountInterestPaid += res.amountInterestPaid;

                cumulativeMonth.interest += res.interest;

                cumulativeMonth.currentBalance += loan.currentBalance;
            });




            lifecycle.totalPaid += cumulativeMonth.amountPaid;

            monthIndex++;
        }



        return lifecycle;
    }

}

angular.module('loanVisualizer').service('lifecycleService', lifecycleService);

function calculateMonth(loan, amountExtraNow) {
    var totalAmountPaid = 0;
    var amountExtraPaid = 0;
    var amountInterestPaid = 0;

    //add the interest
    var monthlyInterestAccrued = loan.interestRate / 12 * loan.currentBalance;

    loan.currentBalance += monthlyInterestAccrued;

    if (loan.currentBalance !== 0) {

        if (loan.currentBalance - loan.minimumPayment <= 0) { //if minimum payment is more than required

            amountExtraPaid = 0;

            amountPaid = loan.currentBalance;
        }

        //figure out how much to pay per month per loan
        if (amountExtraNow !== 0) {

            if (loan.currentBalance - (loan.minimumPayment + amountExtraNow) <= 0) { //some extra

                amountExtraPaid = loan.currentBalance - loan.minimumPayment;
                amountExtraNow -= amountExtraPaid;

                amountPaid = loan.minimumPayment + amountExtraPaid;


            } else { //all extra

                amountExtraPaid = amountExtraNow;
                amountExtraNow = 0;

                amountPaid = loan.minimumPayment + amountExtraPaid;

            }

        } else {

            amountExtraPaid = 0;

            amountPaid = loan.minimumPayment;

        }
    }

    return {
        totalAmountPaid,
        amountExtraPaid,
        amountInterestPaid,
        amountExtraNow
    };
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