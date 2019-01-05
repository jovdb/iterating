/**
 * Incomplete test operation that (now) only works on pullable sources
 */

export function some<T>(predicate: (value: T) => boolean): Sink<T, boolean>;
export function some (predicate) {
	return source => {
		let found = false;
		let talkback;
		source(0, (t, d) => {
			if (found) return;
			if (t === 0) {
				talkback = d;
				talkback(1); // Get value
			}
			if (t === 1) {
				if (predicate(d)) {
					found = true;
					talkback(2); // Unsubscribe
				} else {
					talkback(1); // Get value
				}
				return;
			}
		});
		return found;
	};
}
