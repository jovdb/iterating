export function getTemperaturesKelvin(length: number) {
	let count = 0;
	const result: number[] = [];
	const modulo = Math.floor(length / 100);
	while (count < length) {
		result[count] = count % modulo === 0
			? 273 + 37 // 37°C
			: Math.floor(Math.random() * 1000) + 374; // Above 100°C
		count++;
	}
	return result;
}

export function kelvinToCelcius(degKelvin: number) {
	return degKelvin - 273;
}

export function isLiquid(degCelcius: number) {
	return degCelcius > 0 && degCelcius < 100;
}