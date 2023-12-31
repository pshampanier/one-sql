import tailwindColors from "tailwindcss/colors";
import { raise } from "@/utils/telemetry";

/*
 * IMPORTANT: this application is partially using dynamic classnames, in order to force tailwinds to generate the
 * classes that are used by the ColorPreview component, for each text or border color, we need to add the counterpart
 * background color into the safelist of the tailwind.config.js file.
 */

export function colors<T extends string>(colors: Record<T, string>, ...names: T[]): string {
  if (names.length === 1) return colors[names[0]];
  return names.map((c) => colors[c]).join(" ");
}

/**
 * Convert a short hex color to a full hex color (ex: #faf -> #ffaaff).
 *
 * @param color the color to be converted (ex: #fff, #000, white, #ffffff)
 * @returns the given color in full hex format if the given color is a short hex color, otherwise the given color.
 */
export function convertShortToFullcolor(color: string): string {
  if (color.length === 4 && color[0] === "#") {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  } else {
    return color;
  }
}

/**
 * Get the tailwind color value.
 *
 * @param colors the color palette (PRIMARY_COLORS, SECONDARY_COLORS, etc.)
 * @param name the name of the color in the palette (ex: "background")
 * @param colorScheme the color scheme (ex: "light")
 * @returns the tailwind color value (ex: "#111827")
 */
export function rgbColor<T extends string>(colors: Record<T, string>, name: T, colorScheme: "light" | "dark"): string {
  // get the tailwind classes for given color name (ex: background -> "bg-white dark:bg-gray-800")
  const tailwindClasses = colors[name].split(" ");
  // get the tailwind color for given color scheme (ex: dark -> "dark:bg-gray-800")
  const tailwindClass = tailwindClasses[colorScheme === "light" ? 0 : 1];
  // get the tailwind color name (ex: "gray-800")
  const tailwindColorName = tailwindClass.slice(tailwindClass.indexOf("-") + 1);

  const fragment = tailwindColorName.split("-");
  const colorFamily = fragment[0] as keyof typeof tailwindColors;
  if (colorFamily in tailwindColors) {
    const color = tailwindColors[colorFamily];
    if (fragment.length === 1 && typeof color === "string") {
      return convertShortToFullcolor(color);
    } else if (fragment.length === 2 && typeof color === "object") {
      const colorShade = fragment[1] as keyof typeof color;
      const finalColor = color[colorShade];
      if (finalColor) return convertShortToFullcolor(finalColor);
    }
  }
  raise(`'${tailwindColorName}' is not a valid tailwind color name (from '${name}: ${colors[name]}')`);
}

/**
 * Primary colors
 *
 * These colors are used for the default colors of the application.
 */
export const COLOR_NAMES = [
  "background",
  "hover:background",
  "selected:background",
  "text",
  "hover:text",
  "selected:text",
  "border",
  "hover:border",
  "heading-text",
  "hover:ghost-background",
  "hover:ghost-text",
  "selected:ghost-background",
] as const;

export type Colors = (typeof COLOR_NAMES)[number];
export type ColorsFunction = (...names: Colors[]) => string;

export const PRIMARY_COLORS: Record<Colors, string> = {
  background: "bg-white dark:bg-gray-800",
  "hover:background": "hover:bg-blue-700 dark:hover:bg-blue-600",
  "selected:background": "bg-blue-600 dark:bg-blue-500",
  text: "text-gray-600 dark:text-gray-100",
  "hover:text": "hover:text-white dark:hover:text-white",
  "selected:text": "text-white dark:text-gray-200",
  border: "border-gray-200 dark:border-gray-700",
  "hover:border": "hover:border-blue-700 dark:hover:border-blue-600",
  "heading-text": "text-gray-800 dark:text-white",
  "hover:ghost-background": "hover:bg-gray-100 hover:dark:bg-gray-700",
  "hover:ghost-text": "text-gray-600 dark:text-gray-100",
  "selected:ghost-background": undefined, // FIXME: this is not yet used
};

export function primary(...names: Colors[]): string {
  return colors(PRIMARY_COLORS, ...names);
}

export const SECONDARY_COLORS: Record<Colors, string> = {
  background: "bg-gray-100 dark:bg-gray-700",
  "hover:background": primary("hover:background"),
  "selected:background": primary("selected:background"),
  text: "text-gray-600 dark:text-gray-300",
  "hover:text": primary("hover:text"),
  "selected:text": primary("selected:text"),
  border: "border-gray-300 dark:border-gray-600",
  "hover:border": primary("hover:border"),
  "heading-text": primary("heading-text"),
  "hover:ghost-background": "hover:bg-gray-200 dark:hover:bg-gray-600",
  "hover:ghost-text": "text-gray-600 dark:text-gray-300",
  "selected:ghost-background": "bg-gray-200 dark:bg-gray-800",
};

export function secondary(...names: Colors[]): string {
  return colors(SECONDARY_COLORS, ...names);
}

/**
 * Tertiary colors.
 *
 * Used by the titlebar.
 */
export const TERTIARY_COLORS: Record<Colors, string> = {
  background: "bg-blue-500 dark:bg-blue-800",
  "hover:background": primary("hover:background"),
  "selected:background": primary("selected:background"),
  text: "text-white dark:text-white",
  "hover:text": primary("hover:text"),
  "selected:text": "text-white dark:text-gray-200",
  border: "border-blue-600 dark:border-blue-500",
  "hover:border": primary("hover:border"),
  "heading-text": primary("heading-text"),
  "hover:ghost-background": "hover:bg-blue-700 dark:hover:bg-blue-700",
  "hover:ghost-text": "text-white dark:text-white",
  "selected:ghost-background": undefined, // FIXME: this is not yet used
};

export function tertiary(...names: Colors[]): string {
  return colors(TERTIARY_COLORS, ...names);
}
