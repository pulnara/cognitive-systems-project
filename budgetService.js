const dbKey = 'budget';
const msInMin = 60 * 1000;

function createBudgetInfo(limit, startDate, endDate, duration, spendingInPeriod, totalSpending, absoluteStartDate) {
    return {
        limit: limit,
        startDate: startDate.toJSON(),
        endDate: endDate.toJSON(),
        duration: duration, //in minutes
        spendingInPeriod: spendingInPeriod,
        totalSpending: totalSpending,
        absoluteStartDate: absoluteStartDate.toJSON()
    }
}

function saveEmptyInfo() {
    const date = new Date();
    const budgetInfo = createBudgetInfo(null, date, date, 0, 0, 0, date);
    setInfo(budgetInfo);
}

function recordPurchase(price, success, failure) {
    handleLimit(price, (diff, budgetInfo) => {
        budgetInfo.spendingInPeriod += price;
        budgetInfo.totalSpending += price;
        setInfo(budgetInfo);
        success(diff, budgetInfo);
    },diff => failure(diff));
}

function handleLimit(price, belowOrEven, over) {
    handleLimitPeriod(result => {
        const diff = result.spendingInPeriod + price - result.limit;
        if (diff > 0) over(diff);
        else belowOrEven(diff, result);
    }, result => belowOrEven(null, result));
}

function handleLimitPeriod(limitCallback, noLimitCallback) {
    getInfo(result => {
        if (result.limit == null) return noLimitCallback(result);
        let startDate = new Date(result.startDate);
        const timeDifference = getTimeDifferenceInMinutes(startDate, new Date());
        if (timeDifference < result.duration) {
            limitCallback(result);
        }
        else {
            const timesMissed = Math.floor(timeDifference / result.duration);
            startDate = startDate.addMinutes(timesMissed * result.duration);
            result.startDate = startDate.toJSON();
            result.endDate = startDate.addMinutes(result.duration).toJSON();
            result.spendingInPeriod = 0;
            setInfo(result);
            limitCallback(result);
        }
    })
}

function setLimit(limit, periodNumber, periodType, startDate, callback) {
    getInfo(result => {
        const endDate = getEndDate(startDate, periodNumber, periodType);
        result.limit = limit;
        result.duration = getTimeDifferenceInMinutes(startDate, endDate)
        result.startDate = startDate.toJSON();
        result.endDate = endDate.toJSON();
        result.spendingInPeriod = 0;
        setInfo(result);
        callback(result);
    })
}

function cancelLimit(callback) {
    getInfo(result => {
        result.limit = null;
        result.spendingInPeriod = 0;
        setInfo(result);
        callback(result);
    })
}

function setInfo(budgetInfo) {
    chrome.storage.sync.set({ [dbKey]: budgetInfo }, () => {
        if (chrome.runtime.lastError) {
            console.log('chrome storage set error');
        }
        else {
            console.log('data saved successfully');
        }
    });
}

function getInfo(callback) {
    chrome.storage.sync.get(dbKey, (result) => {
        if (chrome.runtime.lastError) {
            console.log('chrome storage get error');
        }
        else {
            callback(result[dbKey]);
        }
    });
}

function getEndDate(startDate, number, periodType) {
    let endDate = new Date(startDate.getTime());
    const addFunction = {
        minute: () => endDate.addMinutes(number),
        hour: () => endDate.addHours(number),
        day: () => endDate.addDays(number),
        week: () => endDate.addWeeks(number),
        month: () => endDate.addMonths(number),
        year: () => endDate.addYears(number)
    };

    addFunction[periodType]();
    return endDate;
}

function getTimeDifferenceInMinutes(startDate, now) {
    return Math.round((now.getTime() - startDate.getTime()) / msInMin);
}

Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};

Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
};

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.addWeeks = function(weeks) {
    this.addDays(weeks*7);
    return this;
};

Date.prototype.addMonths = function (months) {
    let dt = this.getDate();
    this.setMonth(this.getMonth() + months);
    let currDt = this.getDate();
    if (dt !== currDt) {
        this.addDays(-currDt);
    }
    return this;
};

Date.prototype.addYears = function(years) {
    let dt = this.getDate();
    this.setFullYear(this.getFullYear() + years);
    let currDt = this.getDate();
    if (dt !== currDt) {
        this.addDays(-currDt);
    }
    return this;
};
