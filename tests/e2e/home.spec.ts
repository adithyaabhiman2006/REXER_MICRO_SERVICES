import { expect, test } from "@playwright/test";

test("home catalog can find and open a tool", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Every micro-tool/i })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search tools" }).fill("password");
  await page.getByRole("link", { name: "Open Secure Password Generator" }).click();
  await expect(page.getByRole("heading", { name: "Secure Password Generator" })).toBeVisible();
});

test("catalog exposes all categories", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /AI & Smart Tools/i })).toBeVisible();
  await expect(page.getByText(/Showing .* of 200 tools/i)).toBeVisible();
});
