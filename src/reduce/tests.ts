/** Combine all in one reduce */

import { testSets } from "../test";
import { kelvinToCelcius , isLiquid } from "../data";

testSets["reduce"] = {
	hasOperators: false,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				const doSomething = (_value: number) => count++;
				arr.reduce((_acc, kelvin) => {
					const celcius = kelvinToCelcius(kelvin);
					if (isLiquid(celcius)) doSomething(celcius);
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
				}, [] as number[]);
				onComplete(result);
			},
		},
		"map-filter-array": {
			test: (arr, onComplete) => {
				const result = arr
					.reduce((acc, kelvin) => {
						const celcius = kelvinToCelcius(kelvin);
						if (isLiquid(celcius)) acc.push(celcius);
						return acc;
					}, [] as number[]);
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
						if (result) return result;
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