declare global {
	type Callbag<T> = (type: 0 | 1 | 2, payload?: any) => void ;
	type SourceInitiator<T> = (type: 0, payload: Callbag<T>) => void ;
	type Sink<TIn, TOut> = (source: SourceInitiator<TIn>) => TOut;
	type SinkConnector<TIn, TOut> = (source: SourceInitiator<TIn>) => SourceInitiator<TOut>;
}

export function pipe<TIn, T2, T3, TOut>(start: SourceInitiator<TIn>, fn1: SinkConnector<TIn, T2>, fn2: SinkConnector<T2, T3>, fn3: Sink<T3, TOut>): TOut;
export function pipe<TIn, T2, TOut>(start: SourceInitiator<TIn>, fn1: SinkConnector<TIn, T2>, fn2: Sink<T2, TOut>): TOut;
export function pipe<TIn, TOut>(start: SourceInitiator<TIn>, fn1: Sink<TIn, TOut>): TOut;
export function pipe<T extends SourceInitiator<any>>(start: T): T;
export function pipe(...cbs) {
	let res = cbs[0];
	const n = cbs.length;
	for (let i = 1; i < n; i++) res = cbs[i](res);
	return res;
}