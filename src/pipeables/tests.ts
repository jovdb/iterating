/*
* - Just the native array functions
* - Composed with a pipe function
* - easy to create extra operators without modifing Array prototype
* - should have similar duration as the native array functions
*/

import { testSets } from "../test";
import { kelvinToCelcius, isLiquid } from "../data";

import { map, filter, sum, forEach, some, pipe } from "./pipeables";


testSets["pipeables"] = {
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
					map(kelvinToCelcius)
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