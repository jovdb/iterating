/** Combine all in one reduce */

import { kelvinToCelcius, isLiquid } from "../data";
import { testSets } from "../test";

testSets["while"] = {
	hasOperators: false,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				const length = arr.length;
				const doSomething = (_value: number) => count++;
				let i = 0;
				while (i < length) {
					const kelvin = arr[i];
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) doSomething(celcius);
					i++;
				}
				onComplete(count);
			},
		},
		"map-array": {
			test: (arr, onComplete) => {
				const newArr: number[] = [];
				const length = arr.length;
				let i = 0;
				while (i < length) {
					const kelvin = arr[i];
					newArr.push(kelvinToCelcius(kelvin));
					i++;
				}
				onComplete(newArr);
			},
		},
		"map-filter-array": {
			test: (arr, onComplete) => {
				const newArr: number[] = [];
				const length = arr.length;
				let i = 0;
				while (i < length) {
					const kelvin = arr[i];
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) newArr.push(celcius);
					i++;
				}
				onComplete(newArr);
			},
		},
		"map-filter-sum": {
			test: (arr, onComplete) => {
				let sum = 0;
				const length = arr.length;
				let i = 0;
				while (i < length) {
					const kelvin = arr[i];
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) sum += celcius;
					i++;
				}
				onComplete(sum);
			},
		},
		"map-some": {
			test: (arr, onComplete) => {
				let found = false;
				const length = arr.length;
				let i = 0;
				while (i < length) {
					const kelvin = arr[i];
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) {
						found = true;
						break;
					}
					i++;
				}
				onComplete(found);
			},
		},
	},
};