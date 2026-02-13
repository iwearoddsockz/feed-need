import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { name: "Home", path: "/" },
  { name: "Map", path: "/map" },
  { name: "Search", path: "/search" },
  { name: "Planner", path: "/planner" },
  { name: "About", path: "/about" },
];

for (const { name, path } of pages) {
  test(`${name} page (${path}) accessibility`, async ({ page }) => {
    await page.goto(path);

    // Wait for page to fully load
    if (path === "/map") {
      // Wait for map tiles or loading to settle
      await page.waitForTimeout(5000);
    } else if (path === "/search") {
      // Wait for location list to load
      await page.waitForSelector('[role="list"]', { timeout: 10000 }).catch(() => {});
    } else if (path === "/planner") {
      // Wait for hydration
      await page.waitForSelector("h1", { timeout: 10000 });
      await page.waitForTimeout(2000);
    } else {
      await page.waitForTimeout(1000);
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();

    // Log all violations for analysis
    if (results.violations.length > 0) {
      console.log(`\n=== ${name} page (${path}) ===`);
      for (const v of results.violations) {
        console.log(`\n[${v.impact}] ${v.id}: ${v.description}`);
        console.log(`  Help: ${v.helpUrl}`);
        console.log(`  Tags: ${v.tags.join(", ")}`);
        console.log(`  Nodes (${v.nodes.length}):`);
        for (const node of v.nodes.slice(0, 3)) {
          console.log(`    - ${node.html.substring(0, 120)}`);
          if (node.failureSummary) {
            console.log(`      ${node.failureSummary.split("\n")[0]}`);
          }
        }
        if (v.nodes.length > 3) {
          console.log(`    ... and ${v.nodes.length - 3} more`);
        }
      }
    }

    expect(results.violations).toHaveLength(0);
  });
}

// Dark mode accessibility
test("Dark mode accessibility", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByLabel(/switch to dark mode/i);
  await toggle.click();
  await page.waitForTimeout(500);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  if (results.violations.length > 0) {
    console.log("\n=== Home page (dark mode) ===");
    for (const v of results.violations) {
      console.log(`\n[${v.impact}] ${v.id}: ${v.description}`);
      console.log(`  Nodes (${v.nodes.length}):`);
      for (const node of v.nodes.slice(0, 3)) {
        console.log(`    - ${node.html.substring(0, 120)}`);
      }
    }
  }

  expect(results.violations).toHaveLength(0);
});
