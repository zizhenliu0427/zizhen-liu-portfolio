import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to set up the window/localStorage stubs BEFORE importing the module,
// but since Vitest hoists vi.mock we use dynamic imports instead.

describe("i18n utilities", () => {
  let getSystemLocale: typeof import("./i18n").getSystemLocale;
  let getStoredLocale: typeof import("./i18n").getStoredLocale;
  let setStoredLocale: typeof import("./i18n").setStoredLocale;
  let getCurrentLocale: typeof import("./i18n").getCurrentLocale;

  const storage: Record<string, string> = {};
  const localStorageMock = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { for (const k in storage) delete storage[k]; },
  };

  beforeEach(async () => {
    // Clean storage
    localStorageMock.clear();
    // Stub globals so `typeof window !== "undefined"` passes
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("localStorage", localStorageMock);
    // Re-import fresh module each time
    const mod = await import("./i18n");
    getSystemLocale = mod.getSystemLocale;
    getStoredLocale = mod.getStoredLocale;
    setStoredLocale = mod.setStoredLocale;
    getCurrentLocale = mod.getCurrentLocale;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getSystemLocale", () => {
    it("returns 'zh' when navigator.language starts with zh", () => {
      vi.stubGlobal("navigator", { language: "zh-CN" });
      expect(getSystemLocale()).toBe("zh");
    });

    it("returns 'zh' for zh-TW", () => {
      vi.stubGlobal("navigator", { language: "zh-TW" });
      expect(getSystemLocale()).toBe("zh");
    });

    it("returns 'zh' for plain 'zh'", () => {
      vi.stubGlobal("navigator", { language: "zh" });
      expect(getSystemLocale()).toBe("zh");
    });

    it("returns 'en' for English locales", () => {
      vi.stubGlobal("navigator", { language: "en-US" });
      expect(getSystemLocale()).toBe("en");
    });

    it("returns 'en' for non-Chinese locales (ja-JP)", () => {
      vi.stubGlobal("navigator", { language: "ja-JP" });
      expect(getSystemLocale()).toBe("en");
    });
  });

  describe("getStoredLocale / setStoredLocale", () => {
    it("returns null when nothing is stored", () => {
      expect(getStoredLocale()).toBeNull();
    });

    it("returns 'en' after storing 'en'", () => {
      setStoredLocale("en");
      expect(getStoredLocale()).toBe("en");
    });

    it("returns 'zh' after storing 'zh'", () => {
      setStoredLocale("zh");
      expect(getStoredLocale()).toBe("zh");
    });

    it("ignores invalid stored values", () => {
      localStorage.setItem("zl-portfolio-locale", "fr");
      expect(getStoredLocale()).toBeNull();
    });
  });

  describe("getCurrentLocale", () => {
    it("uses stored locale over system locale", () => {
      vi.stubGlobal("navigator", { language: "en-US" });
      setStoredLocale("zh");
      expect(getCurrentLocale()).toBe("zh");
    });

    it("falls back to system locale when nothing stored", () => {
      vi.stubGlobal("navigator", { language: "zh-CN" });
      expect(getCurrentLocale()).toBe("zh");
    });

    it("falls back to 'en' for non-Chinese system locale", () => {
      vi.stubGlobal("navigator", { language: "fr-FR" });
      expect(getCurrentLocale()).toBe("en");
    });
  });
});
