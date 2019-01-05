import { testSets } from "../test";
import { kelvinToCelcius , isLiquid } from "../data";

testSets["array"] = {
	hasOperators: true,
	tests: {
		"map-filter-forEach": {
			test: (arr, onComplete) => {
				let count = 0;
				const doSomething = (_value: number) => count++;
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