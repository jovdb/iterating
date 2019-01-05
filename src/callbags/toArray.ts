
/** Iterate over elements and return an array */
export function toArray<T>(): Sink<T, T[]>;
export function toArray () {
	return source => {
		let talkback;
		const arr: any[] = [];
		source(0, (t, d) => {
			if (t === 0) talkback = d;
			if (t === 1) arr.push(d);
			if (t === 1 || t === 0) talkback(1);
		});
		return arr;
	};
}