import { expect, test } from "@playwright/test";

test("home catalog can find and open a tool", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /MAKE ANYTHING MOVE/i })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search tools" }).fill("password");
  await page.getByRole("link", { name: "Open Secure Password Generator" }).click();
  await expect(page.getByRole("heading", { name: "Secure Password Generator" })).toBeVisible();
});

test("catalog exposes all categories", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /^AI/i })).toBeVisible();
  await expect(page.getByText(/Showing 24 of 200/i)).toBeVisible();
});

test("global command palette finds a tool from the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+K");
  const launcher = page.getByRole("dialog", { name: "Find a Rexer tool" });
  await expect(launcher).toBeVisible();
  await launcher.getByRole("searchbox", { name: "Search all 200 tools" }).fill("json formatter");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "JSON Formatter" })).toBeVisible({ timeout: 45_000 });
});

test("intent launcher narrows tools by user goal", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Work with a PDF/i }).click();
  await expect(page.getByRole("searchbox", { name: "Search tools" })).toHaveValue("pdf");
  await expect(page.getByRole("link", { name: "Open PDF Merge" })).toBeVisible();
});

test("live desk keeps a private note across reloads", async ({ page }) => {
  await page.goto("/");
  const note = page.getByRole("textbox", { name: "Local desk note" });
  await note.fill("Finish the Rexer launch");
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Local desk note" })).toHaveValue(
    "Finish the Rexer launch",
  );
});

test("smart start detects a file and recommends matching tools", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Choose a file for smart recommendations").setInputFiles({
    name: "campaign.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("sample"),
  });
  await expect(page.getByRole("heading", { name: "PDF detected" })).toBeVisible();
  await expect(page.getByRole("link", { name: "PDF Merge", exact: true })).toBeVisible();
});

test("workflow pin stays on this device", async ({ page }) => {
  await page.goto("/");
  const workflow = page.getByRole("article").filter({ hasText: "SHIP AN IMAGE" });
  await workflow.getByRole("button", { name: "Pin" }).click();
  await expect(workflow.getByRole("button", { name: "Pinned" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("article").filter({ hasText: "SHIP AN IMAGE" }).getByRole("button", { name: "Pinned" })).toBeVisible();
});
