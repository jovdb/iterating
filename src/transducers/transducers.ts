// TODO: If we replace reduce with for loop = faster?
// TODO: Do the operators need an accumulator, or only the sink?

// Operators
// ----------
export function map<T, U>(transform: (value: T) => U): IChainableReducer<T, U> {
	return function mapStep<TNext>(nextReducer: IReducer<U, TNext>) {
		return (acc: TNext, val: T) => nextReducer(acc, transform(val));
	};
}

export function filter<T>(predicate: (value: T) => boolean): IChainableReducer<T, T> {
	return function filterStep<TNext>(nextReducer: IReducer<T, TNext>) {
		return (acc: TNext, val: T) => predicate(val) ? nextReducer(acc, val) : acc;
	};
}

// Sinks
// ----------
export function toArray<T>(seed: T[] = []) {

	function appendStepper(acc, value) {
		acc.push(value);
		return acc;
	}

	return function toArrayIterating(iterable: Iterable<T>, reducer: IChainableReducer<T, T[]>) {
		let arr = seed ? seed : [];
		for (const value of iterable) {
			arr = reducer(appendStepper)(arr, value);
		}
		return arr;
	};
}

export function some<T>(predicate: (value: T) => boolean) {

	function predicateStepper(_acc, value) {
		return predicate(value);
	}

	return function someStep(iterable: Iterable<T>, reducer: IChainableReducer<T, boolean>) {
		for (const value of iterable) {
			if (reducer(predicateStepper)(false, value)) {
				return true;
			}
		}
		return false;
	};
}

export function sum<T>() {

	function sumStepper(acc, value) {
		return acc + value;
	}

	return function sumIterating(iterable: Iterable<T>, reducer: IChainableReducer<T, number>) {
		let sum = 0;
		for (const value of iterable) {
			sum = reducer(sumStepper)(sum, value);
		}
		return sum;
	};
}

export function count() {

	function countStepper(acc, _value) {
		return acc + 1;
	}

	return function countIterating<T>(iterable: Iterable<T>, reducer: IChainableReducer<T, number>) {
		let count = 0;
		for (const value of iterable) {
			count = reducer(countStepper)(count, value);
		}
		return count;
	};
}

export function forEach<T>(cb: (value: T, index: number) => any) {

	let index = 0;
	function actionStepper(_acc, value) {
		cb(value, index++);
	}

	return function forEachIterating(iterable: Iterable<T>, reducer: any) {
		for (const value of iterable) {
			reducer(actionStepper)(undefined, value);
		}
		return iterable;
	};
}

// -----------------------
function chainReducers(...reducers: Function[]) {
	return reducers.reduceRight(
		(prevReducer, reducer) => (...args) => reducer(prevReducer(...args)), // args = acc, val
	);
}

export type IReducer<T, TResult> = (acc: TResult, val: T) => TResult;
export type IChainableReducer<TIn, TResult> = (nextReducer: IReducer<any, TResult>) => IReducer<TIn, TResult>;

export function pipe<TIn, TResult, T1, T2, T3>(
	iterable: Iterable<TIn>,
	operator1: IChainableReducer<TIn, T1>,
	operator2: IChainableReducer<T1, T2>,
	operator3: IChainableReducer<T2, T3>,
	transform: (iterable: Iterable<TIn>, reducer: IChainableReducer<T3, TResult>) => TResult,
): TResult;

export function pipe<TIn, TResult, T1, T2>(
	iterable: Iterable<TIn>,
	operator1: IChainableReducer<TIn, T1>,
	operator2: IChainableReducer<T1, T2>,
	transform: (iterable: Iterable<TIn>, reducer: IChainableReducer<T2, TResult>) => TResult,
): TResult;

export function pipe<
	TIn,
	TResult,
	T1,
>(
	iterable: Iterable<TIn>,
	operator1: IChainableReducer<TIn, T1>,
	transform: (iterable: Iterable<TIn>, reducer: IChainableReducer<T1, TResult>) => TResult,
): TResult;

export function pipe<TIn, TResult>(
	iterable: Iterable<TIn>,
	transform: (iterable: Iterable<TIn>, reducer: IChainableReducer<TIn, TResult>) => TResult,
): TResult;

export function pipe(iterable: Iterable<any>, ...args: any[]) {
	const transformer = args.pop(); // get the last argument
	const reducer = chainReducers(...args); // Chain operators as 1 new reducer function
	return transformer(iterable, reducer);
}
