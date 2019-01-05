/** Combine all in one reduce */

import { kelvinToCelcius, isLiquid } from "../data";
import { testSets } from "../test";

testSets["for"] = {
	hasOperators: false,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				let length = arr.length;
				const doSomething = (_value: number) => count++;
				for (let i = 0; i < length; i++) {
					const kelvin = arr[i];
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) doSomething(celcius);
				}
				onComplete(count);
			},
		},
		"map-array": {
			test: (arr, onComplete) => {
				const newArr: number[] = [];
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
				const newArr: number[] = [];
				let length = arr.length;
				for (let i = 0; i < length; i++) {
					const kelvin = arr[i];
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) newArr.push(celcius);
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
					if (isLiquid(celcius)) sum += celcius;
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