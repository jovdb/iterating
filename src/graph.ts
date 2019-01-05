import { hooks } from "./test";

// Graph
// ==========================================
declare const echarts: any;
export function getGraphHook(): IHook<any> {

	let myChart: any;
	let graphOptions = {} as any;

	// based on prepared DOM, initialize echarts instance
	window.addEventListener("load", () => {
		myChart = echarts.init(document.getElementById("main"));
	});

	return {
		onStart(lengths: ReadonlyArray<number>) {

			myChart.clear();
			graphOptions = {
				animation: false, // disable to not influence duration measurement
				grid: {
					containLabel: true
				},
				legend: {
					data: [""],
				},
				tooltip: {
					trigger: "axis",
				},
				xAxis: {
					name: "#items",
					data: lengths.slice(0),
				},
				yAxis: {
					name: "ms",
					type: "log",
				},
				series: []
			};

			// Update
			myChart.setOption(graphOptions);

		},

		onNewSet(setName: string, _fnString: string) {

			graphOptions.legend.data.push(setName);

			const serie = {
				name: setName,
				type: "line",
				smooth: false,
				data: [],
			};
			graphOptions.series.push(serie);

			// Update
			myChart.setOption(graphOptions);

			return serie;
		},

		onNewSetValue(durationInMs: number, serie: any) {

			serie.data.push(durationInMs);

			// Update
			myChart.setOption(graphOptions);
		},

	};

}


hooks.push(getGraphHook());