import { testSets } from "../test";
import { kelvinToCelcius, isLiquid } from "../data";

import { pipe, filter, map, sum, toArray, forEach, some } from "./generators";

testSets["generators"] = {
	hasOperators: true,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				const doSomething = (_value: number) => count++;
				pipe(
					arr,
					map(kelvinToCelcius),
					filter(isLiquid),
					forEach(doSomething),
				);
				onComplete(count);
			},
		},
		"map-array": {
			test: (arr, onComplete) => {
				const result = pipe(
					arr,
					map(kelvinToCelcius),
					toArray(),
				);
				onComplete(result);
			},
		},
		"map-filter-array": {
			test: (arr, onComplete) => {
				const result = pipe(
					arr,
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
					arr,
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
					arr,
					map(kelvinToCelcius),
					some(isLiquid),
				);
				onComplete(result);
			},
		},
	},
};