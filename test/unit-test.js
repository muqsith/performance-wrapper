const crypto = require('crypto'),
    util = require('util'),
    applyPerformanceWrapper = require('../index')
    ;
class DatabaseConnector {

    constructor(a, b, c) {
        console.log(a, b, c);
    }

    query0(str) {
        const hash = crypto.createHmac('sha256', 'secret')
                   .update(str)
                   .digest('hex');
        return hash;
    }

    query1(options, cb) {
        let result = ['a', 'b', 'c', 'd', 'e'];
        setTimeout(() => {
            cb(result);
        }, 200);
    }

    query2(opt1, opt2, cb) {
        let result = ['1', '2', '3', '4', '5', '6'];
        setTimeout(() => {
            cb(result);
        }, 100);
    }

    query3(opt1) {
        return (
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (((Math.random() * 100) | 0) % 2) {
                        resolve('heheheh ...');
                    } else {
                        reject(new Error('booo booo'));
                    }
                }, 1000);
            })
        )
    }
}

class Dummy extends DatabaseConnector {
    constructor(a, b, c) {
        super(a, b, c)
    }
}

function logger({functionName, args, startTime, endTime}) {
    console.log(functionName, util.inspect(args), startTime, endTime);
}

describe('test applyPerformanceWrapper', function() {
    it('#applyPerformanceWrapper', function(done) {
        // creation of dal
    const dal = applyPerformanceWrapper(new Dummy(1,2,3), 'dal', logger);

    // users of dal
    console.log(dal.query0('muqsith'));
    dal.query1('select * from persons', console.log);
    dal.query2(null, null, console.log);
    dal.query3('promise')
    .then((res) => {
        console.log(res);
        done();
    })
    .catch((err) => {
        console.log(err);
        done();
    });

    })
})
