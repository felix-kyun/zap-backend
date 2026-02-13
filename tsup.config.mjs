import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/**/*.ts"],
	format: ["esm"],
	bundle: false,
	dts: false,
	sourcemap: true,
	clean: true,
	minify: false,
	target: "node20",
	outDir: "dist",
	splitting: false,
});
