import { Prism } from "prism-react-renderer";

// Assign the vendored Prism instance to the global scope so that
// prismjs language component files register themselves on the same
// instance used by prism-react-renderer.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global as any).Prism = Prism;

// Use require() instead of import to avoid ESM hoisting — the global
// assignment above MUST execute before these modules run.
/* eslint-disable @typescript-eslint/no-require-imports */
require("prismjs/components/prism-bash");
require("prismjs/components/prism-python");
require("prismjs/components/prism-markup-templating");
require("prismjs/components/prism-php");
require("prismjs/components/prism-json");
/* eslint-enable @typescript-eslint/no-require-imports */

export { Prism };
