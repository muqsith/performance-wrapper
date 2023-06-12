
const applyPerformanceWrapper = (function(){

const getFunctionsNames = (obj) => {
    // courtesy: https://stackoverflow.com/a/31055217/2388706
    let fNames = [];
    do {
        fNames = fNames.concat(Object.getOwnPropertyNames(obj).filter((p) => (p !== 'constructor' && typeof obj[p] === 'function')));
    } while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype);

    return fNames;
};

const notifyPerformance = (fn, performanceDetails) => {
    setTimeout(() => {
        let {functionName, args, startTime, endTime} = performanceDetails;
        let _args = args;
        if (Array.isArray(args)) {
            _args = args.map((arg) => {
                if (typeof arg === 'function') {
                    let fName = arg.name;
                    if (!fName) {
                        fName = 'function';
                    } else if (fName === 'callbackWrapper') {
                        fName = 'callback';
                    }
                    arg = `[${fName} Function]`;
                }
                return arg;
            });
        }
        fn({functionName, args: _args, startTime, endTime});
    }, 0);
};

const performanceWrapper = (obj, objectName, performanceNotificationCallback) => {
    let _notifyPerformance = notifyPerformance.bind(null, performanceNotificationCallback);
    let fNames = getFunctionsNames(obj);
    for (let fName of fNames) {
        let originalFunction = obj[fName];
        let wrapperFunction = (...args) => {
            let callbackFnIndex = -1;
            let startTime = Date.now();
            let _callBack = args.filter((arg, i) => {
                    let _isFunction = (typeof arg === 'function');
                    if (_isFunction) {
                        callbackFnIndex = i;
                    }
                    return _isFunction;
                })[0];
            if (_callBack) {
                let callbackWrapper = (...callbackArgs) => {
                    let endTime = Date.now();
                    _notifyPerformance({'functionName': `${objectName}.${fName}`, args, startTime, endTime});
                    _callBack.apply(null, callbackArgs);
                }
                args[callbackFnIndex] = callbackWrapper;
            }
            let originalReturnObject = originalFunction.apply(obj, args);
            let isPromiseType = (originalReturnObject && typeof originalReturnObject.then === 'function'
                && typeof originalReturnObject.catch === 'function');
            if (isPromiseType) {
                return originalReturnObject
                .then((...resolveArgs) => {
                    let endTime = Date.now();
                    _notifyPerformance({'functionName': `${objectName}.${fName}`, args, startTime, endTime});
                    return Promise.resolve(...resolveArgs);
                })
                .catch((...rejectArgs) => {
                    let endTime = Date.now();
                    _notifyPerformance({'functionName': `${objectName}.${fName}`, args, startTime, endTime});
                    return Promise.reject(...rejectArgs);
                })
            }
            if (!_callBack && !isPromiseType) {
                let endTime = Date.now();
                _notifyPerformance({'functionName': `${objectName}.${fName}`, args, startTime, endTime});
            }
            return originalReturnObject;
        }
        obj[fName] = wrapperFunction;
    }

    return obj;
}
return performanceWrapper;
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = applyPerformanceWrapper;
}
