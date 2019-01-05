export function iterate<T>(action: (value: T) => any): Sink<T, undefined>;
export function iterate(operation) {
	return source => {
		let talkback;
		source(0, (t, d) => {
			if (t === 0) talkback = d;
			if (t === 1) operation(d);
			if (t === 1 || t === 0) talkback(1);
		});
	};
}
