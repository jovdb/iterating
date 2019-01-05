export function filter<T>(predicate: (value: T) => boolean): SinkConnector<T, T>;
export function filter(condition) {
	return source => (start, sink) => {
		if (start !== 0) return;
		let talkback;
		source(0, (t, d) => {
			if (t === 0) {
				talkback = d;
				sink(t, d);
			} else if (t === 1) {
				if (condition(d)) sink(t, d);
				else talkback(1);
			}
			else sink(t, d);
		});
	};
}
