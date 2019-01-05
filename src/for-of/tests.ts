/** Combine all in one reduce */

import { kelvinToCelcius, isLiquid } from "../data";
import { testSets } from "../test";

testSets["for-of"] = {
	hasOperators: false,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				const doSomething = (_value: number) => count++;
				for (let kelvin of arr) {
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) doSomething(kelvin);
				}
				onComplete(count);
			},
		},
		"map-array": {
			test: (arr, onComplete) => {
				const newArr: number[] = [];
				for (let kelvin of arr) {
					newArr.push(kelvinToCelcius(kelvin));
				}
				onComplete(newArr);
			},
		},
		"map-filter-array": {
			test: (arr, onComplete) => {
				const newArr: number[] = [];
				for (let kelvin of arr) {
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) newArr.push(celcius);
				}
				onComplete(newArr);
			},
		},
		"map-filter-sum": {
			test: (arr, onComplete) => {
				let sum = 0;
				for (let kelvin of arr) {
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) sum += celcius;
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