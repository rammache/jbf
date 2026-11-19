import { prisma } from "../prisma.js";

/**
 * Converts a text string into a URL-friendly, sanitized slug.
 *
 * Operations:
 * 1. Unicode decomposition (NFKD) to strip accents and diacritics (e.g., "é" -> "e").
 * 2. Lowercase transformation.
 * 3. Replace non-alphanumeric characters with hyphens.
 * 4. Deduplicate hyphens and strip leading/trailing hyphens.
 * 5. Fallback to a default identifier if string is empty or stripped completely.
 *
 * @param input - The raw string to slugify (e.g., "Smartphones & Tablets").
 * @param fallback - Fallback string if sanitized output is empty (defaults to "category").
 * @returns Clean, URL-safe slug (e.g., "smartphones-tablets").
 */
export function slugify(input: string, fallback = "category"): string {
  if (typeof input !== "string") {
    return fallback;
  }

  const normalized = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Non-alphanumeric to hyphen
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens

  return normalized.length > 0 ? normalized : fallback;
}

/**
 * Validates whether a given string is a correctly formatted slug.
 * A valid slug consists of lowercase alphanumeric characters separated by single hyphens.
 *
 * @param slug - The slug string to check.
 */
export function isValidSlug(slug: string): boolean {
  if (typeof slug !== "string" || slug.length === 0) {
    return false;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Checks against the database whether a category slug is already in use,
 * optionally excluding a specific category ID (useful during updates).
 *
 * @param slug - The slug to test.
 * @param excludeId - Optional category ID to exclude from collision check.
 */
export async function isCategorySlugTaken(
  slug: string,
  excludeId?: number
): Promise<boolean> {
  const count = await prisma.category.count({
    where: {
      slug,
      ...(excludeId !== undefined ? { id: { not: excludeId } } : {})
    }
  });
  return count > 0;
}

export interface GenerateCategorySlugOptions {
  /** The primary name to generate the slug from (e.g. "Smartphones"). */
  name: string;
  /** Optional custom slug provided by user or client. */
  customSlug?: string | null;
  /** Category ID to exclude when checking for collisions (e.g. updating self). */
  currentId?: number;
  /** Fallback string if generated slug is empty. Defaults to "category". */
  fallback?: string;
  /** Custom check function to test for collisions (defaults to database query). */
  isSlugTaken?: (slug: string, excludeId?: number) => Promise<boolean> | boolean;
}

/**
 * Auto-generates a unique category slug.
 *
 * If the base slug already exists in the database for another category,
 * this function appends sequential numeric suffixes (-2, -3, -4, etc.)
 * until an available unique slug is found.
 */
export async function generateUniqueCategorySlug(
  options: GenerateCategorySlugOptions
): Promise<string> {
  const {
    name,
    customSlug,
    currentId,
    fallback = "category",
    isSlugTaken = isCategorySlugTaken
  } = options;

  const rawBase = customSlug && customSlug.trim().length > 0 ? customSlug : name;
  const baseSlug = slugify(rawBase, fallback);

  // Check if base slug is available
  const isTaken = await isSlugTaken(baseSlug, currentId);
  if (!isTaken) {
    return baseSlug;
  }

  // Resolve collisions by appending sequential numeric suffixes (-2, -3, ...)
  let counter = 2;
  const MAX_ATTEMPTS = 10000;

  while (counter <= MAX_ATTEMPTS) {
    const candidate = `${baseSlug}-${counter}`;
    const candidateTaken = await isSlugTaken(candidate, currentId);
    if (!candidateTaken) {
      return candidate;
    }
    counter++;
  }

  // Fallback timestamp suffix for theoretical extreme collisions
  return `${baseSlug}-${Date.now()}`;
}

export interface ResolveCategorySlugOnUpdateOptions {
  /** The existing category record before update. */
  currentCategory: {
    id: number;
    slug: string;
    name: string;
  };
  /** New name if category is being renamed. */
  newName?: string;
  /** Explicit new slug if provided in update payload. */
  newSlug?: string | null;
  /** Flag to explicitly request regenerating the slug from the new or existing name. */
  regenerateSlug?: boolean;
  /** Fallback string if generated slug is empty. Defaults to "category". */
  fallback?: string;
  /** Custom check function to test for collisions (defaults to database query). */
  isSlugTaken?: (slug: string, excludeId?: number) => Promise<boolean> | boolean;
}

/**
 * Resolves the category slug during a category update / rename operation.
 *
 * Core rule (Slug Stability on Rename):
 * - When a category is renamed (e.g., name changed from "Laptops" to "Notebooks"),
 *   the old slug ("laptops") is preserved by default to keep URLs, bookmarks,
 *   and SEO stable.
 * - The slug will only change if:
 *   1. An explicit `newSlug` is passed in the update payload.
 *   2. Or `regenerateSlug: true` is explicitly passed.
 */
export async function resolveCategorySlugOnUpdate(
  options: ResolveCategorySlugOnUpdateOptions
): Promise<string> {
  const {
    currentCategory,
    newName,
    newSlug,
    regenerateSlug = false,
    fallback = "category",
    isSlugTaken = isCategorySlugTaken
  } = options;

  // 1. Explicit new slug provided by caller
  if (typeof newSlug === "string" && newSlug.trim().length > 0) {
    return generateUniqueCategorySlug({
      name: newSlug,
      customSlug: newSlug,
      currentId: currentCategory.id,
      fallback,
      isSlugTaken
    });
  }

  // 2. Explicit regeneration requested
  if (regenerateSlug) {
    const targetName =
      newName && newName.trim().length > 0 ? newName : currentCategory.name;
    return generateUniqueCategorySlug({
      name: targetName,
      currentId: currentCategory.id,
      fallback,
      isSlugTaken
    });
  }

  // 3. Default: KEEP OLD SLUG STABLE ON RENAME
  // Even if newName changed, the existing slug remains unchanged
  return currentCategory.slug;
}

/**
 * Checks against the database whether a product handle is already in use,
 * optionally excluding a specific product ID.
 */
export async function isProductHandleTaken(
  handle: string,
  excludeId?: number
): Promise<boolean> {
  const count = await prisma.product.count({
    where: {
      handle,
      ...(excludeId !== undefined ? { id: { not: excludeId } } : {})
    }
  });
  return count > 0;
}

export interface GenerateProductHandleOptions {
  /** The primary title to generate the handle from (e.g. "iPhone 15 Pro"). */
  title: string;
  /** Optional custom handle provided by user or client. */
  customHandle?: string | null;
  /** Product ID to exclude when checking for collisions (e.g. updating self). */
  currentId?: number;
  /** Fallback string if generated handle is empty. Defaults to "product". */
  fallback?: string;
  /** Custom check function to test for collisions (defaults to database query). */
  isHandleTaken?: (handle: string, excludeId?: number) => Promise<boolean> | boolean;
}

/**
 * Auto-generates a unique product handle (slug).
 * Resolves collisions by appending sequential numeric suffixes (-2, -3, etc.).
 */
export async function generateUniqueProductHandle(
  options: GenerateProductHandleOptions
): Promise<string> {
  const {
    title,
    customHandle,
    currentId,
    fallback = "product",
    isHandleTaken = isProductHandleTaken
  } = options;

  const rawBase = customHandle && customHandle.trim().length > 0 ? customHandle : title;
  const baseHandle = slugify(rawBase, fallback);

  // Check if base handle is available
  const isTaken = await isHandleTaken(baseHandle, currentId);
  if (!isTaken) {
    return baseHandle;
  }

  // Resolve collisions by appending sequential numeric suffixes (-2, -3, ...)
  let counter = 2;
  const MAX_ATTEMPTS = 10000;

  while (counter <= MAX_ATTEMPTS) {
    const candidate = `${baseHandle}-${counter}`;
    const candidateTaken = await isHandleTaken(candidate, currentId);
    if (!candidateTaken) {
      return candidate;
    }
    counter++;
  }

  return `${baseHandle}-${Date.now()}`;
}

export interface ResolveProductHandleOnUpdateOptions {
  /** The existing product record before update. */
  currentProduct: {
    id: number;
    handle: string;
    title: string;
  };
  /** New title if product is being renamed. */
  newTitle?: string;
  /** Explicit new handle if provided in update payload. */
  newHandle?: string | null;
  /** Flag to explicitly request regenerating the handle from title. */
  regenerateHandle?: boolean;
  /** Fallback string if generated handle is empty. Defaults to "product". */
  fallback?: string;
  /** Custom check function to test for collisions (defaults to database query). */
  isHandleTaken?: (handle: string, excludeId?: number) => Promise<boolean> | boolean;
}

/**
 * Resolves the product handle during an update/rename.
 * Enforces URL/link stability: old handle is preserved by default when title changes.
 */
export async function resolveProductHandleOnUpdate(
  options: ResolveProductHandleOnUpdateOptions
): Promise<string> {
  const {
    currentProduct,
    newTitle,
    newHandle,
    regenerateHandle = false,
    fallback = "product",
    isHandleTaken = isProductHandleTaken
  } = options;

  // 1. Explicit new handle provided by caller
  if (typeof newHandle === "string" && newHandle.trim().length > 0) {
    return generateUniqueProductHandle({
      title: newHandle,
      customHandle: newHandle,
      currentId: currentProduct.id,
      fallback,
      isHandleTaken
    });
  }

  // 2. Explicit regeneration requested
  if (regenerateHandle) {
    const targetTitle =
      newTitle && newTitle.trim().length > 0 ? newTitle : currentProduct.title;
    return generateUniqueProductHandle({
      title: targetTitle,
      currentId: currentProduct.id,
      fallback,
      isHandleTaken
    });
  }

  // 3. Default: keep old handle stable on rename
  return currentProduct.handle;
}
