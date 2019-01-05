(function () {
    'use strict';

    function getTemperaturesKelvin(length) {
        let count = 0;
        const result = [];
        const modulo = Math.floor(length / 100);
        while (count < length) {
            result[count] = count % modulo === 0
                ? 273 + 37 // 37°C
                : Math.floor(Math.random() * 1000) + 374; // Above 100°C
            count++;
        }
        return result;
    }
    function kelvinToCelcius(degKelvin) {
        return degKelvin - 273;
    }
    function isLiquid(degCelcius) {
        return degCelcius > 0 && degCelcius < 100;
    }

    const tests = {
        "map-filter-array": {
            description: "Perform a map, filter and convert the result back to an array (if needed)",
            validateResult: (_input, result) => result.length === 100,
        },
        "map-filter-forEach": {
            description: "Perform a map, filter and iterate over the result",
            validateResult: (_input, result) => result === 100,
        },
        "map-filter-sum": {
            description: "Perform a map, filter and sum the results",
            validateResult: (_input, result) => result === 3700,
        },
        "map-some": {
            description: "Perform a map and check if the result contains a specific condition",
            validateResult: (_input, result) => result,
        },
        "map-array": {
            description: "Perform a map and convert the result back to an array (if needed)",
            validateResult: (input, result) => result !== input && result.length === input.length,
        },
    };
    const testSets = {};
    const lengths = [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6];
    function measure(name, exec) {
        performance.mark(`${name}-start`);
        exec();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];
        // Measurements seem to have a precision of 0.1ms (eg: 1.799999ms)
        return (Math.round(measure.duration * 10) / 10) || 0.01; // prevent 0 for logaritmic scale
    }
    const hooks = [];
    function initTests() {
        // Fill Combobox
        const testNamesEl = document.getElementById("textName");
        const runTestEl = document.getElementById("runTest");
        const noOpertorsEl = document.getElementById("no-operators");
        const descriptionEl = document.getElementById("test-description");
        Object.keys(tests).forEach(testName => {
            const optionEl = document.createElement("option");
            optionEl.innerText = optionEl.value = testName;
            testNamesEl.appendChild(optionEl);
        });
        function updateTestDescription(selectedTestName = testNamesEl.options[testNamesEl.selectedIndex].value) {
            const test = tests[selectedTestName];
            descriptionEl.innerText = test && test.description ? test.description : "";
        }
        testNamesEl.addEventListener("change", () => {
            updateTestDescription();
        });
        updateTestDescription();
        runTestEl.addEventListener("click", () => {
            const selectedTestName = testNamesEl.options[testNamesEl.selectedIndex].value;
            runTestEl.disabled = true;
            startTest(selectedTestName, noOpertorsEl.checked)
                .then(() => {
                runTestEl.disabled = false;
                testNamesEl.disabled = false;
            })
                .catch(() => {
                runTestEl.disabled = false;
                testNamesEl.disabled = false;
            });
        });
    }
    async function startTest(testName = "map-filter-array", includeNoOperators = false) {
        hooks.forEach(hook => {
            hook.onStart(lengths);
        });
        // Use test of all testSets
        return forEachAsync(Object.keys(testSets), async (testSetName) => {
            const testInfo = testSets[testSetName];
            if (!testInfo || !testInfo.tests || (!includeNoOperators && !testInfo.hasOperators))
                return Promise.resolve();
            const test = testInfo.tests[testName].test;
            const rowInfo = hooks.map(hook => hook.onNewSet(testSetName, test.toString()));
            return forEachAsync(lengths, async (length) => {
                return new Promise((resolve) => {
                    const name = `test-${testSetName}-${testName}-#${length}`;
                    // Get random array of values for test
                    const arr = getTemperaturesKelvin(length);
                    const durationInMs = measure(name, () => {
                        test(arr, result => {
                            resolve(result);
                            // validate result
                            if (!tests[testName].validateResult(arr, result)) {
                                console.error(`Test '${testSetName}' '${testName}' failed for '${testSetName}' #${length}`);
                            }
                        });
                    });
                    hooks.forEach((hook, index) => {
                        hook.onNewSetValue(durationInMs, rowInfo[index]);
                    });
                });
            });
        });
    }
    /** iterate and execute async function one after eachother */
    async function forEachAsync(arr, cbAsync) {
        return arr.reduce(async (prevPromise, value, index) => {
            return prevPromise
                .then(rafAsync) // add pause to update UI
                .then(() => cbAsync(value, index)); // exec next;
        }, Promise.resolve());
    }
    function rafAsync() {
        //return new Promise(resolve => requestAnimationFrame(resolve)) as TPromise;
        return new Promise(resolve => setTimeout(resolve, 1));
    }

    function getTableHook() {
        let tableEl;
        let rowEls = [];
        let columnIndex = 0;
        return {
            onStart(lengths) {
                const headerRowEl = document.querySelector("table thead tr");
                tableEl = document.querySelector("table tbody");
                rowEls = [];
                // Remove Cols
                for (const el of Array.from(headerRowEl.children)) {
                    el.remove();
                }
                headerRowEl.appendChild(document.createElement("td"));
                // Remove Rows
                for (const el of Array.from(tableEl.children)) {
                    el.remove();
                }
                // Draw headers
                lengths.forEach(length => {
                    const tdEl = document.createElement("td");
                    tdEl.innerText = `#${length.toExponential()}`;
                    headerRowEl.appendChild(tdEl);
                });
            },
            onNewSet(setName, fnString) {
                // Update table
                const rowEl = document.createElement("tr");
                rowEl.setAttribute("title", fnString);
                tableEl.appendChild(rowEl);
                // Add name of test set
                const tdEl = document.createElement("td");
                tdEl.innerText = setName;
                rowEl.appendChild(tdEl);
                rowEls.push(rowEl);
                columnIndex = 0;
                return rowEl;
            },
            onNewSetValue(durationInMs, rowEl) {
                // Update table
                const tdEl = document.createElement("td");
                tdEl.innerText = `${Math.round(durationInMs * 10) / 10}ms`;
                rowEl.appendChild(tdEl);
                columnIndex++;
                // Highlight fastest
                if (rowEls.length > 1) {
                    const colEls = rowEls.map(el => el.children[columnIndex]);
                    const durations = colEls.map(el => parseFloat(el.innerText));
                    const fastest = Math.min(...durations);
                    const slowest = Math.max(...durations);
                    colEls.forEach(el => {
                        const isFastest = parseFloat(el.innerText) === fastest;
                        const isSlowest = rowEls.length > 2 && (parseFloat(el.innerText) === slowest);
                        el.style.backgroundColor = isFastest
                            ? "green"
                            : isSlowest
                                ? "red"
                                : null; // for tslint
                        el.style.color = (isSlowest || isFastest)
                            ? "white"
                            : null; // for tslint
                    });
                }
            },
        };
    }
    hooks.push(getTableHook());

    function getGraphHook() {
        let myChart;
        let graphOptions = {};
        // based on prepared DOM, initialize echarts instance
        window.addEventListener("load", () => {
            myChart = echarts.init(document.getElementById("main"));
        });
        return {
            onStart(lengths) {
                myChart.clear();
                graphOptions = {
                    animation: false,
                    grid: {
                        containLabel: true
                    },
                    legend: {
                        data: [""],
                    },
                    tooltip: {
                        trigger: "axis",
                    },
                    xAxis: {
                        name: "#items",
                        data: lengths.slice(0),
                    },
                    yAxis: {
                        name: "ms",
                        type: "log",
                    },
                    series: []
                };
                // Update
                myChart.setOption(graphOptions);
            },
            onNewSet(setName, _fnString) {
                graphOptions.legend.data.push(setName);
                const serie = {
                    name: setName,
                    type: "line",
                    smooth: false,
                    data: [],
                };
                graphOptions.series.push(serie);
                // Update
                myChart.setOption(graphOptions);
                return serie;
            },
            onNewSetValue(durationInMs, serie) {
                serie.data.push(durationInMs);
                // Update
                myChart.setOption(graphOptions);
            },
        };
    }
    hooks.push(getGraphHook());

    testSets["array"] = {
        hasOperators: true,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    arr
                        .map(kelvinToCelcius)
                        .filter(isLiquid)
                        .forEach(doSomething);
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const result = arr
                        .map(kelvinToCelcius);
                    onComplete(result);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const result = arr
                        .map(kelvinToCelcius)
                        .filter(isLiquid);
                    onComplete(result);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    const result = arr
                        .map(kelvinToCelcius)
                        .filter(isLiquid)
                        .reduce((acc, val) => acc + val, 0);
                    onComplete(result);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    const result = arr
                        .map(kelvinToCelcius)
                        .some(isLiquid);
                    onComplete(result);
                },
            },
        }
    };

    function map(transform) {
        return arr => arr.map(transform);
    }
    function filter(predicate) {
        return arr => arr.filter(predicate);
    }
    function forEach(action) {
        return arr => {
            arr.forEach(action);
            return arr;
        };
    }
    function some(predicate) {
        return arr => arr.some(predicate);
    }
    function sum() {
        return arr => arr.reduce((acc, val) => acc + val, 0);
    }
    function pipe(start, ...fns) {
        // For better type inference, I included the start value as argument
        return fns.reduce((y, f) => f(y), start);
    }

    /*
    * - Just the native array functions
    * - Composed with a pipe function
    * - easy to create extra operators without modifing Array prototype
    * - should have similar duration as the native array functions
    */
    testSets["pipeables"] = {
        hasOperators: true,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    pipe(arr, map(kelvinToCelcius), filter(isLiquid), forEach(doSomething));
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const result = pipe(arr, map(kelvinToCelcius));
                    onComplete(result);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const result = pipe(arr, map(kelvinToCelcius), filter(isLiquid));
                    onComplete(result);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    const result = pipe(arr, map(kelvinToCelcius), filter(isLiquid), sum());
                    onComplete(result);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    const result = pipe(arr, map(kelvinToCelcius), some(isLiquid));
                    onComplete(result);
                },
            },
        },
    };

    // Operators
    // ----------
    function map$1(transform) {
        return function mapStep(nextReducer) {
            return (acc, val) => nextReducer(acc, transform(val));
        };
    }
    function filter$1(predicate) {
        return function filterStep(nextReducer) {
            return (acc, val) => predicate(val) ? nextReducer(acc, val) : acc;
        };
    }
    // Sinks
    // ----------
    function toArray(seed = []) {
        function appendStepper(acc, value) {
            acc.push(value);
            return acc;
        }
        return function toArrayIterating(iterable, reducer) {
            let arr = seed ? seed : [];
            for (const value of iterable) {
                arr = reducer(appendStepper)(arr, value);
            }
            return arr;
        };
    }
    function some$1(predicate) {
        function predicateStepper(_acc, value) {
            return predicate(value);
        }
        return function someStep(iterable, reducer) {
            for (const value of iterable) {
                if (reducer(predicateStepper)(false, value)) {
                    return true;
                }
            }
            return false;
        };
    }
    function sum$1() {
        function sumStepper(acc, value) {
            return acc + value;
        }
        return function sumIterating(iterable, reducer) {
            let sum = 0;
            for (const value of iterable) {
                sum = reducer(sumStepper)(sum, value);
            }
            return sum;
        };
    }
    function forEach$1(cb) {
        let index = 0;
        function actionStepper(_acc, value) {
            cb(value, index++);
        }
        return function forEachIterating(iterable, reducer) {
            for (const value of iterable) {
                reducer(actionStepper)(undefined, value);
            }
            return iterable;
        };
    }
    // -----------------------
    function chainReducers(...reducers) {
        return reducers.reduceRight((prevReducer, reducer) => (...args) => reducer(prevReducer(...args)));
    }
    function pipe$1(iterable, ...args) {
        const transformer = args.pop(); // get the last argument
        const reducer = chainReducers(...args); // Chain operators as 1 new reducer function
        return transformer(iterable, reducer);
    }

    /*
    * - Transducers (= Transformation + Reducers)
    * - works by chaining reducers and iterating the source once.
    */
    testSets["transducers"] = {
        hasOperators: true,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    pipe$1(arr, map$1(kelvinToCelcius), filter$1(isLiquid), forEach$1(doSomething));
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const result = pipe$1(arr, map$1(kelvinToCelcius), toArray());
                    onComplete(result);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const result = pipe$1(arr, map$1(kelvinToCelcius), filter$1(isLiquid), toArray());
                    onComplete(result);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    const result = pipe$1(arr, map$1(kelvinToCelcius), filter$1(isLiquid), sum$1());
                    onComplete(result);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    const result = pipe$1(arr, map$1(kelvinToCelcius), some$1(isLiquid));
                    onComplete(result);
                },
            },
        },
    };

    // Combinators
    // -----------
    // Remark: Because generators return iterators (not iterables), combinators take also iterator
    function map$2(transform) {
        return function* (iterable) {
            for (const val of iterable) {
                yield transform(val);
            }
        };
    }
    function filter$2(predicate) {
        return function* (iterable) {
            for (const val of iterable) {
                if (predicate(val))
                    yield val;
            }
        };
    }
    function sum$2() {
        return function (iterable) {
            let sum = 0;
            for (const val of iterable) {
                sum += val;
            }
            return sum;
        };
    }
    function some$2(predicate) {
        return function (iterable) {
            for (const val of iterable) {
                if (predicate(val))
                    return true;
            }
            return false;
        };
    }
    function toArray$1() {
        return function (iterable) {
            return Array.from(iterable);
        };
    }
    function forEach$2(action) {
        return function (iterable) {
            for (const val of iterable) {
                action(val);
            }
            return iterable;
        };
    }
    function pipe$2(start, ...fns) {
        // For better type inference, I included the start value as argument
        return fns.reduce((y, f) => f(y), start);
    }

    testSets["generators"] = {
        hasOperators: true,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    pipe$2(arr, map$2(kelvinToCelcius), filter$2(isLiquid), forEach$2(doSomething));
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const result = pipe$2(arr, map$2(kelvinToCelcius), toArray$1());
                    onComplete(result);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const result = pipe$2(arr, map$2(kelvinToCelcius), filter$2(isLiquid), toArray$1());
                    onComplete(result);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    const result = pipe$2(arr, map$2(kelvinToCelcius), filter$2(isLiquid), sum$2());
                    onComplete(result);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    const result = pipe$2(arr, map$2(kelvinToCelcius), some$2(isLiquid));
                    onComplete(result);
                },
            },
        },
    };

    function pipe$3(...cbs) {
        let res = cbs[0];
        const n = cbs.length;
        for (let i = 1; i < n; i++)
            res = cbs[i](res);
        return res;
    }

    function fromIter(iter) {
        return (start, sink) => {
            if (start !== 0)
                return;
            const iterator = iter[Symbol.iterator]
                ? iter[Symbol.iterator]()
                : iter;
            let inloop = false;
            let got1 = false;
            let completed = false;
            let res;
            function loop() {
                inloop = true;
                while (got1 && !completed) {
                    got1 = false;
                    res = iterator.next();
                    if (res.done) {
                        sink(2);
                        break;
                    }
                    else
                        sink(1, res.value);
                }
                inloop = false;
            }
            sink(0, t => {
                if (completed)
                    return;
                if (t === 1) {
                    got1 = true;
                    if (!inloop && !(res && res.done))
                        loop();
                }
                else if (t === 2) {
                    completed = true;
                }
            });
        };
    }

    function map$3(f) {
        return source => (start, sink) => {
            if (start !== 0)
                return;
            source(0, (t, d) => {
                sink(t, t === 1 ? f(d) : d);
            });
        };
    }

    function filter$3(condition) {
        return source => (start, sink) => {
            if (start !== 0)
                return;
            let talkback;
            source(0, (t, d) => {
                if (t === 0) {
                    talkback = d;
                    sink(t, d);
                }
                else if (t === 1) {
                    if (condition(d))
                        sink(t, d);
                    else
                        talkback(1);
                }
                else
                    sink(t, d);
            });
        };
    }

    function toArray$2() {
        return source => {
            let talkback;
            const arr = [];
            source(0, (t, d) => {
                if (t === 0)
                    talkback = d;
                if (t === 1)
                    arr.push(d);
                if (t === 1 || t === 0)
                    talkback(1);
            });
            return arr;
        };
    }

    function sum$3() {
        return source => {
            let talkback;
            let sum = 0;
            source(0, (t, d) => {
                if (t === 0)
                    talkback = d;
                if (t === 1)
                    sum += d;
                if (t === 1 || t === 0)
                    talkback(1);
            });
            return sum;
        };
    }

    function iterate(operation) {
        return source => {
            let talkback;
            source(0, (t, d) => {
                if (t === 0)
                    talkback = d;
                if (t === 1)
                    operation(d);
                if (t === 1 || t === 0)
                    talkback(1);
            });
        };
    }

    /**
     * Incomplete test operation that (now) only works on pullable sources
     */
    function some$3(predicate) {
        return source => {
            let found = false;
            let talkback;
            source(0, (t, d) => {
                if (found)
                    return;
                if (t === 0) {
                    talkback = d;
                    talkback(1); // Get value
                }
                if (t === 1) {
                    if (predicate(d)) {
                        found = true;
                        talkback(2); // Unsubscribe
                    }
                    else {
                        talkback(1); // Get value
                    }
                    return;
                }
            });
            return found;
        };
    }

    /*
    * - Callbags is just a spec that describes the way of working
    * - General solution to work with iterables (pull) and reactive (push) data
    * - Like RxJs but also works on iterables
    * - Is a broader concept that also processes the items one by one
    */
    testSets["callbags"] = {
        hasOperators: true,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    pipe$3(fromIter(arr), map$3(kelvinToCelcius), filter$3(isLiquid), iterate(doSomething));
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const result = pipe$3(fromIter(arr), map$3(kelvinToCelcius), toArray$2());
                    onComplete(result);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const result = pipe$3(fromIter(arr), map$3(kelvinToCelcius), filter$3(isLiquid), toArray$2());
                    onComplete(result);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    const result = pipe$3(fromIter(arr), map$3(kelvinToCelcius), filter$3(isLiquid), sum$3());
                    onComplete(result);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    const result = pipe$3(fromIter(arr), map$3(kelvinToCelcius), some$3(isLiquid));
                    onComplete(result);
                },
            },
        },
    };

    /** Combine all in one reduce */
    testSets["reduce"] = {
        hasOperators: false,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    arr.reduce((_acc, kelvin) => {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            doSomething(celcius);
                        return undefined;
                    }, undefined);
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const result = arr.reduce((acc, kelvin) => {
                        acc.push(kelvinToCelcius(kelvin));
                        return acc;
                    }, []);
                    onComplete(result);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const result = arr
                        .reduce((acc, kelvin) => {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            acc.push(celcius);
                        return acc;
                    }, []);
                    onComplete(result);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    const result = arr
                        .reduce((sum, kelvin) => {
                        const celcius = kelvinToCelcius(kelvin);
                        return isLiquid(celcius)
                            ? sum += celcius
                            : sum;
                    }, 0);
                    onComplete(result);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    const result = arr
                        .reduce((result, kelvin) => {
                        if (result)
                            return result;
                        const celcius = kelvinToCelcius(kelvin);
                        return isLiquid(celcius)
                            ? true
                            : false;
                    }, false);
                    onComplete(result);
                },
            },
        },
    };

    /** Combine all in one reduce */
    testSets["foreach"] = {
        hasOperators: false,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    arr.forEach(kelvin => {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            doSomething(celcius);
                    });
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const newArr = [];
                    arr.forEach(kelvin => {
                        newArr.push(kelvinToCelcius(kelvin));
                    });
                    onComplete(newArr);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const newArr = [];
                    arr.forEach(kelvin => {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            newArr.push(celcius);
                    });
                    onComplete(newArr);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    let sum = 0;
                    arr.forEach(kelvin => {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            sum += celcius;
                    });
                    onComplete(sum);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    let found = false;
                    arr.forEach(kelvin => {
                        if (found)
                            return;
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius)) {
                            found = true;
                        }
                    });
                    onComplete(found);
                },
            },
        },
    };

    /** Combine all in one reduce */
    testSets["for-of"] = {
        hasOperators: false,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    const doSomething = (_value) => count++;
                    for (let kelvin of arr) {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            doSomething(kelvin);
                    }
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const newArr = [];
                    for (let kelvin of arr) {
                        newArr.push(kelvinToCelcius(kelvin));
                    }
                    onComplete(newArr);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const newArr = [];
                    for (let kelvin of arr) {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            newArr.push(celcius);
                    }
                    onComplete(newArr);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    let sum = 0;
                    for (let kelvin of arr) {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            sum += celcius;
                    }
                    onComplete(sum);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    let found = false;
                    for (let kelvin of arr) {
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius)) {
                            found = true;
                            break;
                        }
                    }
                    onComplete(found);
                },
            },
        },
    };

    /** Combine all in one reduce */
    testSets["for"] = {
        hasOperators: false,
        tests: {
            "map-filter-forEach": {
                test: (arr, onComplete) => {
                    let count = 0;
                    let length = arr.length;
                    const doSomething = (_value) => count++;
                    for (let i = 0; i < length; i++) {
                        const kelvin = arr[i];
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            doSomething(celcius);
                    }
                    onComplete(count);
                },
            },
            "map-array": {
                test: (arr, onComplete) => {
                    const newArr = [];
                    let length = arr.length;
                    for (let i = 0; i < length; i++) {
                        const kelvin = arr[i];
                        newArr.push(kelvinToCelcius(kelvin));
                    }
                    onComplete(newArr);
                },
            },
            "map-filter-array": {
                test: (arr, onComplete) => {
                    const newArr = [];
                    let length = arr.length;
                    for (let i = 0; i < length; i++) {
                        const kelvin = arr[i];
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            newArr.push(celcius);
                    }
                    onComplete(newArr);
                },
            },
            "map-filter-sum": {
                test: (arr, onComplete) => {
                    let sum = 0;
                    let length = arr.length;
                    for (let i = 0; i < length; i++) {
                        const kelvin = arr[i];
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius))
                            sum += celcius;
                    }
                    onComplete(sum);
                },
            },
            "map-some": {
                test: (arr, onComplete) => {
                    let found = false;
                    let length = arr.length;
                    for (let i = 0; i < length; i++) {
                        const kelvin = arr[i];
                        const celcius = kelvinToCelcius(kelvin);
                        if (isLiquid(celcius)) {
                            found = true;
                            break;
                        }
                    }
                    onComplete(found);
                },
            },
        },
    };

    window.onload = () => {
        initTests();
        startTest();
    };

}());
