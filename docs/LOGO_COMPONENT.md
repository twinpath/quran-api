# Logo Component Documentation

## Overview

The `Logo` component is a reusable, TypeScript-based React component that renders the application logo with **dynamic theming support** via `next-themes`. It automatically adapts colors based on the current light/dark theme and supports extensive customization.

**Features:**
- Automatic theme detection (light/dark mode)
- TypeScript support with full type safety
- Customizable colors, size, and variants
- Prevents hydration mismatch with proper client-side mounting
- Reusable across the entire application
- Zero emoji - uses SVG paths only (LucideReact icons for UI indicators)

## Installation & Location

The component is located at:
```
src/components/common/logo.tsx
```

It's already exported and ready to use.

## Usage

### Basic Usage (With Theme Detection)

The simplest way to use the Logo - it automatically adapts to the current theme:

```tsx
import { Logo } from "@/components/common/logo";

export default function App() {
  return <Logo />;  // Default size: 40px
}
```

### With Custom Size

```tsx
import { Logo } from "@/components/common/logo";

export default function Navbar() {
  return <Logo size={48} />;  // 48px
}
```

### Icon-Only Variant

Use just the icon without the text elements:

```tsx
import { Logo } from "@/components/common/logo";

export default function Favicon() {
  return <Logo size={32} variant="icon" />;
}
```

### With Custom Colors (Overrides Theme)

When you provide custom colors, the component ignores the theme:

```tsx
import { Logo } from "@/components/common/logo";

export default function BrandedLogo() {
  return (
    <Logo
      size={64}
      primaryColor="#0B5F4C"      // Teal green
      secondaryColor="#292728"    // Dark gray/charcoal
      accentColor="#C0A576"       // Gold/tan
    />
  );
}
```

### With Tailwind CSS Classes

Add Tailwind classes for animations and styling:

```tsx
import { Logo } from "@/components/common/logo";

export default function InteractiveLogo() {
  return (
    <Logo
      size={48}
      className="transition-transform hover:scale-110 cursor-pointer"
    />
  );
}
```

### Disabling Theme Colors

Force the component to never apply theme colors:

```tsx
import { Logo } from "@/components/common/logo";

export default function StaticLogo() {
  return (
    <Logo
      size={48}
      primaryColor="#0B5F4C"
      secondaryColor="#292728"
      accentColor="#C0A576"
      useThemeColors={false}  // Always use these colors
    />
  );
}
```

## Props

```typescript
interface LogoProps extends SVGProps<SVGSVGElement> {
  /**
   * Size of the logo in pixels
   * @default 40
   */
  size?: number;

  /**
   * Primary color (main shape). Uses theme color if not provided.
   */
  primaryColor?: string;

  /**
   * Secondary color (text/accents). Uses theme color if not provided.
   */
  secondaryColor?: string;

  /**
   * Accent color (highlight). Uses theme color if not provided.
   */
  accentColor?: string;

  /**
   * Variant: 'full' shows full logo, 'icon' shows icon only
   * @default 'full'
   */
  variant?: "full" | "icon";

  /**
   * Whether to apply theme-aware colors
   * @default true
   */
  useThemeColors?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;

  // ... all standard SVGProps (aria-label, etc.)
}
```

## Default Colors

### Light Theme
- **Primary:** `#0B5F4C` (Teal green) - oklch(0.508 0.118 165.612)
- **Secondary:** `#292728` (Dark gray) - oklch(0.145 0 0)
- **Accent:** `#C0A576` (Gold/tan) - oklch(0.67 0.15 70)

### Dark Theme
- **Primary:** `#1B7168` (Lighter teal) - oklch(0.432 0.095 166.913)
- **Secondary:** `#FAFAF8` (Off white) - oklch(0.985 0 0)
- **Accent:** `#D4C5A9` (Lighter gold) - oklch(0.74 0.18 70)

## Common Use Cases

### Header/Navigation Logo

```tsx
import { Logo } from "@/components/common/logo";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="flex items-center gap-3 p-4">
        <Logo size={40} variant="icon" />
        <h1 className="text-xl font-bold">Quran API</h1>
      </div>
    </header>
  );
}
```

### Favicon in HTML Head

```tsx
// In your layout.tsx or metadata
import { Logo } from "@/components/common/logo";

export const metadata = {
  icons: {
    // For dynamic favicons, use the SVG file directly
    icon: "/favicon.svg",
  },
};
```

Or render as a React component for client-side use:

```tsx
export function FaviconComponent() {
  return (
    <Logo
      size={32}
      variant="icon"
      className="fixed top-0 left-0 -z-10"
    />
  );
}
```

### Hero Section

```tsx
import { Logo } from "@/components/common/logo";

export function Hero() {
  return (
    <section className="py-20 text-center">
      <Logo size={120} className="mx-auto mb-6" />
      <h1 className="text-5xl font-bold">Welcome</h1>
      <p className="text-xl text-muted-foreground mt-4">
        Your Islamic Knowledge Resource
      </p>
    </section>
  );
}
```

### Sidebar Navigation

```tsx
import { Logo } from "@/components/common/logo";

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar p-4 rounded-lg">
      <Logo size={48} variant="icon" className="mb-8" />
      <nav className="space-y-2">
        {/* Navigation items */}
      </nav>
    </aside>
  );
}
```

### With Hover Animation

```tsx
import { Logo } from "@/components/common/logo";

export function AnimatedLogo() {
  return (
    <Logo
      size={64}
      className="transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer"
    />
  );
}
```

## Theme Integration

The component uses `next-themes` `useTheme()` hook for automatic theme detection:

```tsx
const { theme, systemTheme } = useTheme();

// Automatically detects:
// - "light" theme
// - "dark" theme
// - "system" theme (uses systemTheme preference)
```

**Hydration Safety:** The component prevents SSR/hydration mismatches by:
1. Using `useState` to track mount status
2. Rendering empty SVG on server/initial render
3. Properly rendering with theme colors only after client-side mount

## Styling with CSS

You can style the Logo component using standard CSS/Tailwind utilities:

```tsx
// Make it a circle with border
<Logo
  size={48}
  className="rounded-full border-2 border-primary p-2"
/>

// Add shadow
<Logo
  size={48}
  className="drop-shadow-lg"
/>

// Responsive sizing with Tailwind
<Logo
  size={48}
  className="w-12 h-12 md:w-16 md:h-16"
/>
```

## Accessibility

The component extends standard SVGProps, so you can add ARIA attributes:

```tsx
<Logo
  size={48}
  aria-label="Quran API Logo"
  role="img"
/>
```

## TypeScript Support

Full type safety with TypeScript:

```tsx
import { Logo } from "@/components/common/logo";
import type { FC } from "react";

const MyLogo: FC = () => {
  return (
    <Logo
      size={48}
      variant="icon"
      className="text-primary"
      // TypeScript knows all available props
    />
  );
};
```

## Color Customization for Branding

If you need to change the default theme colors globally, edit the color definitions in `src/components/common/logo.tsx`:

```typescript
// Light theme defaults
const defaultPrimaryLight = "#0B5F4C";
const defaultSecondaryLight = "#292728";
const defaultAccentLight = "#C0A576";

// Dark theme defaults
const defaultPrimaryDark = "#1B7168";
const defaultSecondaryDark = "#FAFAF8";
const defaultAccentDark = "#D4C5A9";
```

## Examples File

A complete examples file is available at:
```
src/components/common/logo-examples.tsx
```

Contains 7 different usage examples showing various patterns and use cases.

## Troubleshooting

### Logo colors not changing with theme?

Ensure your layout includes `ThemeProvider`:

```tsx
import { ThemeProvider } from "@/components/common/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Logo not displaying on first load?

This is normal hydration behavior. The component renders empty on server, then hydrates properly on client. If this is an issue, you can:

1. Wrap in `<Suspense />` with a fallback
2. Use `dynamic()` import with `ssr: false`

```tsx
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("@/components/common/logo").then(m => ({ default: m.Logo })), {
  ssr: false,
});
```

## Best Practices

1. **Use theme colors by default** - Don't override colors unless necessary
2. **Keep size reasonable** - Use 32-120px for most use cases
3. **Use variant="icon" for favicons** - More compact and cleaner
4. **Add aria-label for accessibility** - Help screen readers understand the logo
5. **Test in both themes** - Verify colors look good in light and dark modes

---

For more examples, see `src/components/common/logo-examples.tsx`
