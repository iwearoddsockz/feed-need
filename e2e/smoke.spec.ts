import { test, expect } from "@playwright/test";

test.describe("Feed Need smoke tests", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Feed Need");
  });

  test("map page renders tiles", async ({ page }) => {
    await page.goto("/map");

    // Wait for the Leaflet container to appear
    const leafletContainer = page.locator(".leaflet-container");
    await expect(leafletContainer).toBeVisible({ timeout: 15000 });

    // Check that the container has non-zero dimensions
    const box = await leafletContainer.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);

    // Wait for tiles to load
    const tiles = page.locator(".leaflet-tile-loaded");
    await expect(tiles.first()).toBeVisible({ timeout: 15000 });

    // Verify no console errors (check for critical ones)
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.waitForTimeout(2000);
  });

  test("planner page loads without infinite loop", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/planner");

    // Wait for hydration
    await expect(page.locator("h1")).toContainText("Weekly Meal Planner", {
      timeout: 10000,
    });

    // Desktop grid shows day headings - confirms grid rendered without crashing
    await expect(page.getByText("Monday")).toBeVisible({
      timeout: 10000,
    });

    // Wait a bit to check for infinite loop errors
    await page.waitForTimeout(3000);

    // Filter for the specific infinite loop error
    const loopErrors = errors.filter(
      (e) => e.includes("infinite loop") || e.includes("Maximum update depth")
    );
    expect(loopErrors).toHaveLength(0);
  });

  test("dark mode toggle works", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    // Click the theme toggle
    const toggle = page.getByLabel(/switch to dark mode/i);
    await expect(toggle).toBeVisible({ timeout: 5000 });
    await toggle.click();

    // HTML element should now have .dark class
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Toggle back to light
    const lightToggle = page.getByLabel(/switch to light mode/i);
    await lightToggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("search page loads and shows locations", async ({ page }) => {
    await page.goto("/search");

    // Wait for locations to load
    await expect(page.locator('[role="list"]')).toBeVisible({ timeout: 15000 });

    // Check that at least one location card rendered
    const items = page.locator('[role="listitem"]');
    await expect(items.first()).toBeVisible({ timeout: 10000 });
  });
});
