const util = require('util'),
    assert = require('assert'),
    applyPerformanceWrapper = require('../index');

class MyObject {
    constructor() {
        // dummy conctructor
    }

    callbackSum(a,b, cb) {
        setTimeout(() => {
            cb(a+b);
        }, 150);
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

describe("Test performance wrapper", function () {

    const logger = ({functionName, args, startTime, endTime}) => {
        console.log(functionName, util.inspect(args), startTime, endTime);
    };

    const myObj = applyPerformanceWrapper(new MyObject(), 'myObj', logger);

    it("normal method call", function () {
        let result = myObj.sum(3, 5);
        console.log('normal: ', result);
        assert.equal(result, 8);
    });


    it("normal method call", function (done) {
        myObj.callbackSum(3, 5, (result) => {
            console.log('callback: ', result);
            assert.equal(result, 8);
            done();
        });
    });


    it("normal method call", function (done) {
        myObj.promisedSum(3, 5)
        .then((result) => {
            console.log('promise: ', result);
            assert.equal(result, 8);
            done();
        });
    });

    it("normal method call", function (done) {
        myObj.asyncSum(3, 5)
        .then((result) => {
            console.log('async: ', result);
            assert.equal(result, 8);
            done();
        });
    });


});
