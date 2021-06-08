window.addEventListener('load', () => {
    let setLimitButton = document.getElementById('set-limit-button');
    let cancelLimitButton = document.getElementById('cancel-limit-button');
    let limitInfo = document.getElementById('limit-info');
    let totalSpendingElement = document.getElementById('total-spending');
    let totalSpendingSinceElement = document.getElementById('since');
    let limitElement = document.getElementById('limit-value');
    let spendingInPeriodElement = document.getElementById('spending-in-period');
    let startDateElement = document.getElementById('from');
    let endDateElement = document.getElementById('to');
    let setLimitForm = document.getElementById('set-limit');
    let saveLimitButton = document.getElementById('save-limit-button');

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleString();
    }

    function setGeneralInfo(totalSpending, absoluteStartDate) {
        totalSpendingElement.innerHTML = `<b>Total amount spent: </b> ${totalSpending}`;
        totalSpendingSinceElement.innerHTML = `<b>Since: </b> ${formatDate(absoluteStartDate)}`;
    }

    function setLimitInfo(startDateStr, endDateStr, limit, spendingInPeriod) {
        cancelLimitButton.style.display = 'block';
        setLimitButton.style.display = 'none';

        limitInfo.style.display = 'block';

        limitElement.innerHTML = `<b>Limit:</b> ${limit}`;
        spendingInPeriodElement.innerHTML = `<b>Money spent:</b> ${spendingInPeriod}`;
        startDateElement.innerHTML = `<b>From:</b> ${formatDate(startDateStr)}`;
        endDateElement.innerHTML = `<b>To:</b> ${formatDate(endDateStr)}`;

        cancelLimitButton.addEventListener("click",  () => {
            cancelLimit(() => {
                clearLimitInfo();
            })
        });
    }

    function clearLimitInfo() {
        setLimitButton.style.display = 'block';
        cancelLimitButton.style.display = 'none';

        limitInfo.style.display = 'none';

        setLimitButton.addEventListener("click",() => {
            setLimitButton.style.display = 'none';
            setLimitForm.style.display = 'block';
        });
    }

    handleLimitPeriod(result => {
        setGeneralInfo(result.totalSpending, result.absoluteStartDate);
        setLimitInfo(result.startDate, result.endDate, result.limit, result.spendingInPeriod);
    }, result => {
        setGeneralInfo(result.totalSpending, result.absoluteStartDate);
        clearLimitInfo();
    });

    saveLimitButton.addEventListener('click', () => {
            const limit = parseInt(document.getElementById('limit').value);
            const duration = parseInt(document.getElementById('duration').value);
            const periodType = document.getElementById('period-type').value;

            setLimit(limit, duration, periodType, new Date(),result => {
                setLimitForm.style.display = 'none';
                setLimitInfo(result.startDate, result.endDate, result.limit, result.spendingInPeriod);
            });
        }
    );
});