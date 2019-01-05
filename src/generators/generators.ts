// Combinators
// -----------
// Remark: Because generators return iterators (not iterables), combinators take also iterator

export function map<T, U>(transform: (item: T) => U) {
	return function *(iterable: Iterable<T>) {
		for (const val of iterable) {
			yield transform(val);
		}
	};
}

export function filter<T>(predicate: (item: T) => boolean) {
	return function *(iterable: Iterable<T>) {
		for (const val of iterable) {
			if (predicate(val)) yield val;
		}
	};
}

export function sum() {
	return function (iterable: Iterable<number>) {
		let sum = 0;
		for (const val of iterable) {
			sum += val;
		}
		return sum;
	};
}

export function some<T>(predicate: (item: T) => boolean) {
	return function (iterable: Iterable<T>) {
		for (const val of iterable) {
			if (predicate(val)) return true;
		}
		return false;
	};
}

export function toArray() {
	return function (iterable: Iterable<number>) {
		return Array.from(iterable);
	};
}

export function forEach<T>(action: (item: T) => void) {
	return function (iterable: Iterable<T>) {
		for (const val of iterable) {
			action(val);
		}
		return iterable;
	};
}

export type OneArgFn<TIn, TOut> = (x: TIn) => TOut;

export function pipe<TIn, TOut, T1, T2, T3>(start: TIn, fn1: OneArgFn<TIn, T1>, fn2: OneArgFn<T1, T2>, fn3: OneArgFn<T2, T3>, fn4: OneArgFn<T3, TOut>): TOut;
export function pipe<TIn, TOut, T1, T2>(start: TIn, fn1: OneArgFn<TIn, T1>, fn2: OneArgFn<T1, T2>, fn3: OneArgFn<T2, TOut>): TOut;
export function pipe<TIn, TOut, T1>(start: TIn, fn1: OneArgFn<TIn, T1>, fn2: OneArgFn<T1, TOut>): TOut;
export function pipe<TIn, TOut>(start: TIn, fn1: OneArgFn<TIn, TOut>): TOut;
export function pipe<TIn>(start: TIn): TIn;
export function pipe<TIn extends Iterable<any>>(start: TIn, ...fns: Function[]) {
	// For better type inference, I included the start value as argument
	return fns.reduce((y, f) => f(y), start);
}
