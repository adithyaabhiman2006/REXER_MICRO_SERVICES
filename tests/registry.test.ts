import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { tools } from "@/lib/registry/tools";
import { searchTools } from "@/lib/search";

describe("tool registry", () => {
  it("contains exactly 200 unique, sequential tools", () => {
    expect(tools).toHaveLength(200);
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(200);
    expect(tools.map((tool) => tool.id)).toEqual(Array.from({ length: 200 }, (_, index) => index + 1));
  });

  it("uses route-safe slugs and complete searchable metadata", () => {
    for (const tool of tools) {
      expect(tool.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(tool.title.trim()).not.toBe("");
      expect(tool.short.trim()).not.toBe("");
      expect(tool.tags.length).toBeGreaterThan(0);
    }
  });

  it("maps every catalog route to an interactive component", () => {
    const componentRegistry = readFileSync(resolve(process.cwd(), "components/tools/index.ts"), "utf8");
    const mapped = new Set(
      [...componentRegistry.matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]),
    );
    expect(tools.filter((tool) => !mapped.has(tool.slug))).toEqual([]);
  });
});

describe("tool search", () => {
  it("finds exact and fuzzy title matches", () => {
    expect(searchTools("password", tools)[0]?.slug).toBe("password-generator");
    expect(searchTools("jsn format", tools).some((tool) => tool.slug === "json-formatter")).toBe(true);
  });

  it("returns the original source for an empty query", () => {
    expect(searchTools("  ", tools)).toEqual(tools);
  });
});
