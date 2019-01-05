export function map<T, U>(transform: (value: T) => U): SinkConnector<T, U>;
export function map(f) {
	return source => (start, sink) => {
		if (start !== 0) return;
		source(0, (t, d) => {
			sink(t, t === 1 ? f(d) : d);
		});
	};
}