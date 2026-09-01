import nextConfigCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextConfigTypescript from "eslint-config-next/typescript";

const eslintConfig = [
	{
		ignores: [
			".next/**",
			".open-next/**",
			".vscode/**",
			".wrangler/**",
			"node_modules/**",
			"migrations/**",
			"references/**",
			"docs/**",
			"public/**",
			"**/*.d.ts",
			"cloudflare-env.d.ts",
		],
	},
	...nextConfigCoreWebVitals,
	...nextConfigTypescript,
];

export default eslintConfig;
