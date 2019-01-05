/**
 * Iterate over elements and sums them
 * Does not (yet) work on push sources
 */
export function sum<T>(): Sink<T, number>;
export function sum () {
	return source => {
		let talkback;
		let sum = 0;
		source(0, (t, d) => {
			if (t === 0) talkback = d;
			if (t === 1) sum += d;
			if (t === 1 || t === 0) talkback(1);
		});
		return sum;
	};
}