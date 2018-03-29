# performance-wrapper


##### A wrapper to obtain performance(only time) for methods (functions within object)



Inject start-time and end-time calls for your methods dynamically without modifying your own code. This library works for the methods that take only one callback or return promises or none. Check unit test for more details.

##### This library works in both Node.js environment and also in Browser environment

##### Example


code


```javascript

    const applyPerformanceWrapper = require('performance-wrapper');

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
```


This library exports a default function called applyPerformanceWrapper, this function receives three paramaters
- object: the methods of this obect are intercepted for performance logging
- name: name for the object, this name appended to the returned function name in logging
- logger: this is a function that receives the performance details of the function under observation

    -- name : name of the function under observation, eg: myObj.sum

    -- arguments: arguments to the function under observation, eg: a,b

    -- start time: start time of the function under observation

    -- end time: end time of the function under observation



The passed callback function (logger in the above case) is called asynchronously, without affecting the stack of the function under observation.
