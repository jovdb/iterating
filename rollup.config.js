import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
	input: "docs/temp/index.js", 
	output: {
		name: "app",
		file: "docs/index.js",
		format: "iife",
	},

	onwarn: warning => {
		
		// Don't show the typescript warnings
		if (warning.code === "THIS_IS_UNDEFINED" && warning.frame) {
			if (warning.frame.indexOf("__extends") > -1) return;
			if (warning.frame.indexOf("__awaiter") > -1) return;
			if (warning.frame.indexOf("__decorate") > -1) return;
		}

		let line = ""
		if (warning.loc) line += `${warning.loc.file}:${warning.loc.line}:${warning.loc.column}\n`;
		line += warning.message;
		if (warning.frame) line += `\n${warning.frame}`;
		line += "\n";

		console.warn(line);
	},

	plugins: [

		// Allow node_modules resolution, so you can use 'external' to control
		// which external modules to include in the bundle
		// https://github.com/rollup/rollup-plugin-node-resolve#usage
		resolve(),

		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs()
	],
}