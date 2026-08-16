import { useTheme } from "next-themes";
import { themes } from "prism-react-renderer";

/**
 * Returns the appropriate PrismTheme based on the currently resolved
 * next-themes theme (dark or light). Defaults to the light theme when
 * resolvedTheme is not yet available (SSR / first render).
 */
export function usePrismTheme() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? themes.vsDark : themes.vsLight;
}
