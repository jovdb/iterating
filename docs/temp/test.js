var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getTemperaturesKelvin } from "./data";
export const tests = {
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
export const testSets = {};
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
export const hooks = [];
export function initTests() {
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
export function startTest(testName = "map-filter-array", includeNoOperators = false) {
    return __awaiter(this, void 0, void 0, function* () {
        hooks.forEach(hook => {
            hook.onStart(lengths);
        });
        // Use test of all testSets
        return forEachAsync(Object.keys(testSets), (testSetName) => __awaiter(this, void 0, void 0, function* () {
            const testInfo = testSets[testSetName];
            if (!testInfo || !testInfo.tests || (!includeNoOperators && !testInfo.hasOperators))
                return Promise.resolve();
            const test = testInfo.tests[testName].test;
            const rowInfo = hooks.map(hook => hook.onNewSet(testSetName, test.toString()));
            return forEachAsync(lengths, (length) => __awaiter(this, void 0, void 0, function* () {
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
            }));
        }));
    });
}
/** iterate and execute async function one after eachother */
function forEachAsync(arr, cbAsync) {
    return __awaiter(this, void 0, void 0, function* () {
        return arr.reduce((prevPromise, value, index) => __awaiter(this, void 0, void 0, function* () {
            return prevPromise
                .then(rafAsync) // add pause to update UI
                .then(() => cbAsync(value, index)); // exec next;
        }), Promise.resolve());
    });
}
function rafAsync() {
    //return new Promise(resolve => requestAnimationFrame(resolve)) as TPromise;
    return new Promise(resolve => setTimeout(resolve, 1));
}
