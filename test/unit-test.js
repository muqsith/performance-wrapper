const util = require('util'),
    applyPerformanceWrapper = require('../index');

function logger({functionName, args, startTime, endTime}) {
    console.log(functionName, util.inspect(args), startTime, endTime);
}

class MyObject {
    constructor() {
        // dummy conctructor
    }

    callbackSum(a,b, cb) {
        cb(a+b);
    }

    promisedSum(a,b) {
        return (
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(a+b);
                }, 100);
            })
        );
    }

    async asyncSum(a,b) {
        return await this.promisedSum(a,b);
    }

    sum(a,b) {
        return a+b;
    }
}

const myObj = applyPerformanceWrapper(new MyObject(), 'myObj', logger);

console.log('normal: ', myObj.sum(3, 5));
myObj.callbackSum(3, 5, (result) => {
    console.log('callback: ', result);
});

myObj.promisedSum(3, 5)
.then((result) => {
    console.log('promise: ', result);
});

myObj.asyncSum(3, 5)
.then((result) => {
    console.log('async: ', result);
});
