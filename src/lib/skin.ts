export type { SkinConfig } from "@/skin.config";
export { default as skinConfig } from "@/skin.config";

/**
 * Resolves a skin-specific component variant.
 * Skins can override this to swap in custom visual treatments.
 */
export function resolveSkinComponent<T>(
  componentMap: Record<string, T>,
  variant: string,
  fallback: T
): T {
  return componentMap[variant] ?? fallback;
}
