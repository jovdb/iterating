import { hooks } from "./test";

function getTableHook(): IHook<HTMLElement> {

	let tableEl: Element;
	let rowEls: HTMLElement[] = [];
	let columnIndex = 0;

	return {
		onStart(lengths: ReadonlyArray<number>) {

			const headerRowEl = document.querySelector("table thead tr")!;
			tableEl = document.querySelector("table tbody")!;
			rowEls = [];

			// Remove Cols
			for (const el of Array.from(headerRowEl.children)) {el.remove();}
			headerRowEl.appendChild(document.createElement("td"));

			// Remove Rows
			for (const el of Array.from(tableEl.children)) {el.remove();}

			// Draw headers
			lengths.forEach(length => {
				const tdEl = document.createElement("td");
				tdEl.innerText = `#${length.toExponential()}`;
				headerRowEl.appendChild(tdEl);
			});
		},

		onNewSet(setName: string, fnString: string) {

			// Update table
			const rowEl = document.createElement("tr");
			rowEl.setAttribute("title", fnString);
			tableEl.appendChild(rowEl);

			// Add name of test set
			const tdEl = document.createElement("td");
			tdEl.innerText = setName;
			rowEl.appendChild(tdEl);

			rowEls.push(rowEl);

			columnIndex = 0;
			return rowEl;
		},

		onNewSetValue(durationInMs: number, rowEl: HTMLElement) {
			// Update table
			const tdEl = document.createElement("td");
			tdEl.innerText = `${Math.round(durationInMs * 10) / 10}ms`;
			rowEl.appendChild(tdEl);

			columnIndex++;

			// Highlight fastest
			if (rowEls.length > 1) {
				const colEls = rowEls.map(el => el.children[columnIndex] as HTMLTableCellElement);
				const durations = colEls.map(el => parseFloat(el.innerText));
				const fastest = Math.min(...durations);
				const slowest = Math.max(...durations);

				colEls.forEach(el => {
					const isFastest = parseFloat(el.innerText) === fastest;
					const isSlowest = rowEls.length > 2 && (parseFloat(el.innerText) === slowest);

					el.style.backgroundColor = isFastest
						? "green"
						: isSlowest
							? "red"
							: null; // for tslint
					el.style.color = (isSlowest || isFastest)
						? "white"
						: null; // for tslint

				});
			}

		},
	};

}

hooks.push(getTableHook());