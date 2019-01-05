/** Combine all in one reduce */

import { testSets } from "../test";
import { kelvinToCelcius, isLiquid } from "../data";

testSets["foreach"] = {
	hasOperators: false,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				const doSomething = (_value: number) => count++;
				arr.forEach(kelvin => {
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) doSomething(celcius);
				});
				onComplete(count);
			},
		},
		"map-array": {
			test: (arr, onComplete) => {
				const newArr: number[] = [];
				arr.forEach(kelvin => {
					newArr.push(kelvinToCelcius(kelvin));
				});
				onComplete(newArr);
			},
		},
		"map-filter-array": {
			test: (arr, onComplete) => {
				const newArr: number[] = [];
				arr.forEach(kelvin => {
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) newArr.push(celcius);
				});
				onComplete(newArr);
			},
		},
		"map-filter-sum": {
			test: (arr, onComplete) => {
				let sum = 0;
				arr.forEach(kelvin => {
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) sum += celcius;
				});
				onComplete(sum);
			},
		},
		"map-some": {
			test: (arr, onComplete) => {
				let found = false;
				arr.forEach(kelvin => {
					if (found) return;
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