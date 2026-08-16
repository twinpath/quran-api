import nextConfigCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextConfigTypescript from "eslint-config-next/typescript";

const eslintConfig = [
	{
		ignores: [
			"data/**",
			".next/**",
			".open-next/**",
			".vscode/**",
			".wrangler/**",
			"node_modules/**",
			"migrations/**",
			"cloudflare-env.d.ts",
		],
	},
	...nextConfigCoreWebVitals,
	...nextConfigTypescript,
];

export default eslintConfig;
