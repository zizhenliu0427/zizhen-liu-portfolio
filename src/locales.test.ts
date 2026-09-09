import { describe, it, expect } from "vitest";
import { en } from "./locales/en";
import { zh } from "./locales/zh";

/**
 * Recursively collect all leaf keys from a nested object as dot-separated paths.
 * e.g. { nav: { work: "..." } } → ["nav.work"]
 */
function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...collectKeys(value as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

describe("translation completeness", () => {
  const enKeys = collectKeys(en).sort();
  const zhKeys = collectKeys(zh).sort();

  it("zh.ts has every key that en.ts has", () => {
    const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));
    expect(missingInZh).toEqual([]);
  });

  it("en.ts has every key that zh.ts has (no orphan zh keys)", () => {
    const missingInEn = zhKeys.filter((k) => !enKeys.includes(k));
    expect(missingInEn).toEqual([]);
  });

  it("en.ts has no empty-string values (en is the source of truth)", () => {
    const emptyKeys: string[] = [];
    function checkEmpty(obj: Record<string, unknown>, prefix = "") {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          checkEmpty(value as Record<string, unknown>, path);
        } else if (value === "") {
          emptyKeys.push(path);
        }
      }
    }
    checkEmpty(en);
    expect(emptyKeys).toEqual([]);
  });

  it("zh.ts only uses empty strings for Sydney/visa-related keys", () => {
    const allowedEmpty = new Set([
      "hero.sydneyBadge",
      "hero.locationLabel",
      "hero.locationValue",
      "hero.accessLabel",
      "hero.accessValue",
      "about.accessLabel",
      "about.accessSuffix",
      "desktop.visaStatus",
      "oobe.welcomeLocation",
      "oobe.welcomeRolePrefix",
    ]);

    const unexpectedEmpty: string[] = [];
    function checkEmpty(obj: Record<string, unknown>, prefix = "") {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          checkEmpty(value as Record<string, unknown>, path);
        } else if (value === "" && !allowedEmpty.has(path)) {
          unexpectedEmpty.push(path);
        }
      }
    }
    checkEmpty(zh);
    expect(unexpectedEmpty).toEqual([]);
  });
});
