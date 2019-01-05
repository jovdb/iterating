export function map<T, U>(transform: (v: T) => U): (arr: T[]) => U[] {
		return arr => arr.map(transform);
}

export function filter<T>(predicate: (v: T) => boolean): (arr: T[]) => T[] {
	return arr => arr.filter(predicate);
}

export function forEach<T>(action: (v: T) => any): (arr: T[]) => T[] {
	return arr => {
		arr.forEach(action);
		return arr;
	};
}

export function some<T>(predicate: (v: T) => boolean): (arr: T[]) => boolean {
	return arr => arr.some(predicate);
}

export function sum(): (arr: number[]) => number {
	return arr => arr.reduce((acc, val) => acc + val, 0);
}

export type OneArgFn<TIn, TOut> = (x: TIn) => TOut;

export function pipe<TIn, TOut, T1, T2, T3>(start: TIn, fn1: OneArgFn<TIn, T1>, fn2: OneArgFn<T1, T2>, fn3: OneArgFn<T2, T3>, fn4: OneArgFn<T3, TOut>): TOut;
export function pipe<TIn, TOut, T1, T2>(start: TIn, fn1: OneArgFn<TIn, T1>, fn2: OneArgFn<T1, T2>, fn3: OneArgFn<T2, TOut>): TOut;
export function pipe<TIn, TOut, T1>(start: TIn, fn1: OneArgFn<TIn, T1>, fn2: OneArgFn<T1, TOut>): TOut;
export function pipe<TIn, TOut>(start: TIn, fn1: OneArgFn<TIn, TOut>): TOut;
export function pipe<TIn>(start: TIn): TIn;
export function pipe<TIn>(start: TIn, ...fns: Function[]) {
	// For better type inference, I included the start value as argument
	return fns.reduce((y, f) => f(y), start);
}