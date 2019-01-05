/*
* - Callbags is just a spec that describes the way of working
* - General solution to work with iterables (pull) and reactive (push) data
* - Like RxJs but also works on iterables
* - Is a broader concept that also processes the items one by one
*/

import { testSets } from "../test";
import { kelvinToCelcius, isLiquid } from "../data";

import { pipe } from "./pipe";
import { fromIter } from "./fromIter";
import { map } from "./map";
import { filter } from "./filter";
import { toArray } from "./toArray";
import { sum } from "./sum";
import { iterate } from "./iterate";
import { some } from "./some";

testSets["callbags"] = {
	hasOperators: true,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				const doSomething = (_value: number) => count++;
				pipe(
					fromIter(arr),
					map(kelvinToCelcius),
					filter(isLiquid),
					iterate(doSomething),
				);
				onComplete(count);
			},
		},
		"map-array": {
			test: (arr, onComplete) => {
				const result = pipe(
					fromIter(arr),
					map(kelvinToCelcius),
					toArray(),
				);
				onComplete(result);
			},
		},
		"map-filter-array": {
			test: (arr, onComplete) => {
				const result = pipe(
					fromIter(arr),
					map(kelvinToCelcius),
					filter(isLiquid),
					toArray(),
				);
				onComplete(result);
			},
		},
		"map-filter-sum": {
			test: (arr, onComplete) => {
				const result = pipe(
					fromIter(arr),
					map(kelvinToCelcius),
					filter(isLiquid),
					sum(),
				);
				onComplete(result);
			},
		},
		"map-some": {
			test: (arr, onComplete) => {
				const result = pipe(
					fromIter(arr),
					map(kelvinToCelcius),
					some(isLiquid),
				);
				onComplete(result);
			},
		},
	},
};
