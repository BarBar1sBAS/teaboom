import { test, expect } from "@playwright/test";
import { packs } from "../src/product.js";

const expected = [
  { id: "100", sku: "01306", price: "326,40 ₽", oldPrice: "349,20 ₽" },
  { id: "500", sku: "01307", price: "1 432 ₽", oldPrice: "1 646 ₽" },
  { id: "1000", sku: "01308", price: "2 064 ₽", oldPrice: "2 592 ₽" },
  { id: "5000", sku: "01309", price: "6 320 ₽", oldPrice: "8 710 ₽" },
];

async function expectPack(page, pack) {
  await expect(page.locator(`input[value="${pack.id}"]`)).toBeChecked();
  await expect(page.locator("[data-sku]")).toHaveText(pack.sku);
  await expect(page.locator("[data-price]")).toHaveText(pack.price);
  await expect(page.locator("[data-old-price]")).toHaveText(pack.oldPrice);
}

async function expectNoOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => window.innerWidth),
  );
}

test("initial state and all pack prices match the specification", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await expect(page.getByRole("radio", { name: "100 г", exact: true })).toBeEnabled();
  await expect(page.locator("#pack-status")).toBeHidden();
  expect(await page.locator('input[name="pack"]').evaluateAll((inputs) => inputs.map((input) => input.value)))
    .toEqual(packs.map((pack) => pack.id));
  await expectPack(page, expected[0]);
  for (const pack of expected) {
    await page.getByText(`${pack.id} г`, { exact: true }).click();
    await expectPack(page, pack);
  }
  await expect(page.locator("img")).toHaveJSProperty("complete", true);
  expect(await page.locator("img").evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("keyboard selection has visible focus and no motion", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("radio", { name: "100 г", exact: true })).toBeFocused();
  // Native radio groups differ across browsers at the first/last option.
  const steps = [
    ["ArrowRight", 1], ["ArrowRight", 2], ["ArrowRight", 3],
    ["ArrowLeft", 2], ["ArrowLeft", 1], ["ArrowLeft", 0],
  ];
  for (const [key, index] of steps) {
    const pack = expected[index];
    await page.keyboard.press(key);
    await expectPack(page, pack);
    await expect(page.locator(`input[value="${pack.id}"]`)).toBeFocused();
    const chip = page.locator("input:checked + .pack__chip");
    await expect(chip).toHaveCSS("outline-style", "solid");
    await expect(chip).toHaveCSS("outline-width", "2px");
    await expect(chip).toHaveCSS("transition-duration", "0s");
  }
  await page.keyboard.press("Tab");
  const button = page.getByRole("button", { name: "В корзину" });
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-width", "2px");
  await page.keyboard.down("Space");
  await expect(button).toHaveCSS("transform", "none");
  await page.keyboard.up("Space");
});

test("reload and history keep prices consistent with the selected radio", async ({ page }) => {
  await page.goto("/");
  await page.getByText("5000 г", { exact: true }).click();
  await page.reload();
  let id = await page.locator("input:checked").inputValue();
  await expectPack(page, expected.find((pack) => pack.id === id));
  await page.goto("/?other");
  await page.goBack();
  id = await page.locator("input:checked").inputValue();
  await expectPack(page, expected.find((pack) => pack.id === id));
});

test("an unknown pack preserves the last valid selection and prices", async ({ page }) => {
  await page.goto("/");
  await page.getByText("500 г", { exact: true }).click();
  await page.locator('input[value="5000"]').evaluate((input) => { input.value = "missing"; });
  await page.getByText("5000 г", { exact: true }).click();
  await expectPack(page, expected[1]);
  await expect(page.locator('input[value="missing"]')).not.toBeChecked();
});

async function expectStaticCard(page) {
  for (const radio of await page.getByRole("radio").all()) {
    await expect(radio).toBeDisabled();
  }
  await expect(page.locator("#pack-status")).toHaveText("Выбор фасовки недоступен. Показана цена за 100 г.");
  await expect(page.locator("#pack-status")).toBeVisible();
  await page.getByText("5000 г", { exact: true }).click({ force: true });
  await expectPack(page, expected[0]);
  expect(await page.locator('input[name="pack"]').evaluateAll((inputs) => inputs.map((input) => input.value)))
    .toEqual(packs.map((pack) => pack.id));
}

test("without JavaScript the HTML remains a consistent static card", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expectStaticCard(page);
  } finally {
    await context.close();
  }
});

test("a failed bundle load leaves pack selection disabled", async ({ page }) => {
  await page.goto("/");
  await page.getByText("5000 г", { exact: true }).click();
  await page.route("**/assets/*.js", (route) => route.abort());
  await page.reload();
  await expectStaticCard(page);
});

test("layout and selection work at breakpoints and zoom-equivalent widths", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 359, 360, 361, 375, 640, 720, 767, 768, 769, 1023, 1024, 1025, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const pack of expected) {
      await page.getByText(`${pack.id} г`, { exact: true }).click();
      await expectPack(page, pack);
      await expectNoOverflow(page);
    }
  }
});

test("200% text size does not overflow the page or title", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoOverflow(page);
    expect(await page.locator("h1").evaluate((title) => title.scrollWidth <= title.clientWidth)).toBe(true);
  }
});

test("hover, reduced motion and high contrast retain usable controls", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "В корзину" });
  await button.hover();
  await expect(button).toHaveCSS("background-color", "rgb(58, 80, 16)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(button).toHaveCSS("transition-duration", "0s");
  await expect(page.locator(".pack__chip").first()).toHaveCSS("transition-duration", "0s");
  await page.mouse.down();
  await expect(button).toHaveCSS("transform", "none");
  await page.mouse.up();
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator("input:checked + .pack__chip")).toHaveCSS("outline-width", "2px");
  await expect(button).toHaveCSS("border-top-width", "1px");
});
