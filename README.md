# performance-wrapper

##### A wrapper to obtain performance(only time) for methods (functions within object)


Inject start-time and end-time calls your methods dynamically without modifying your own code. This library works for the methods that take only one callback or return promises or none. Check unit test for more details.

`
    function logger({functionName, args, startTime, endTime}) {
        console.log(functionName, util.inspect(args), startTime, endTime);
    }

    const myObj = applyPerformanceWrapper(new MyObject(1,2,3), 'myObj', logger);
`
