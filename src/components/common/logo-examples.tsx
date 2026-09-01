import type { FC } from "react";
import { Logo } from "@/components/common/logo";

/**
 * Logo Usage Examples
 *
 * This file demonstrates various ways to use the Logo component
 */

/**
 * Example 1: Basic usage with automatic theming
 * - Automatically adapts colors based on light/dark theme
 * - Uses default size of 40px
 */
export const BasicLogoExample: FC = () => {
  return <Logo />;
};

/**
 * Example 2: Logo as navigation icon with custom size
 * - Commonly used in header/navbar
 * - Size 48px
 */
export const NavbarLogoExample: FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Logo size={48} variant="icon" />
      <span className="text-xl font-bold">Quran API</span>
    </div>
  );
};

/**
 * Example 3: Logo with custom colors (overrides theme)
 * - Useful when you need specific branding colors
 * - Ignores current theme when custom colors are provided
 */
export const CustomColorLogoExample: FC = () => {
  return (
    <div className="flex gap-4">
      <Logo
        size={64}
        primaryColor="#0B5F4C"
        secondaryColor="#292728"
        accentColor="#C0A576"
      />
    </div>
  );
};

/**
 * Example 4: Icon variant (just the main symbol)
 * - Perfect for favicons, tabs, or compact displays
 * - No text elements
 */
export const IconOnlyLogoExample: FC = () => {
  return (
    <div className="flex gap-4 items-center">
      <Logo size={32} variant="icon" />
      <Logo size={48} variant="icon" />
      <Logo size={64} variant="icon" />
    </div>
  );
};

/**
 * Example 5: Logo with CSS classes for styling
 * - Add Tailwind classes directly
 * - Useful for animations or custom styling
 */
export const StyledLogoExample: FC = () => {
  return (
    <div className="flex gap-4">
      <Logo
        size={48}
        className="transition-transform hover:scale-110 cursor-pointer"
      />
      <Logo
        size={48}
        className="opacity-75 hover:opacity-100 transition-opacity"
      />
      <Logo
        size={48}
        className="animate-pulse"
      />
    </div>
  );
};

/**
 * Example 6: Disabling automatic theme colors
 * - Always uses provided colors, never applies theme
 * - Useful for brand-consistent logos
 */
export const NoThemeLogoExample: FC = () => {
  return (
    <Logo
      size={48}
      primaryColor="#0B5F4C"
      secondaryColor="#292728"
      useThemeColors={false}
    />
  );
};

/**
 * Example 7: Logo in different contexts
 */
export const MultiContextLogoExample: FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border py-4">
        <Logo size={48} variant="icon" className="mx-auto" />
      </div>

      {/* Sidebar */}
      <div className="bg-card p-4">
        <Logo size={40} variant="icon" className="mb-4" />
        <nav className="space-y-2">
          <div className="px-2 py-1 hover:bg-primary/10">
            Home
          </div>
        </nav>
      </div>

      {/* Hero */}
      <div className="text-center py-12">
        <Logo size={96} className="mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Welcome to Quran API</h1>
      </div>
    </div>
  );
};
