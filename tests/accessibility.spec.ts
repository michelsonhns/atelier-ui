import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
const index = JSON.parse(
  readFileSync("storybook-static/index.json", "utf8"),
) as { entries: Record<string, { id: string; type: string }> };
const gallery = `http://127.0.0.1:5174${process.env.GALLERY_BASE_PATH ?? "/"}`;
for (const story of Object.values(index.entries).filter(
  (entry) => entry.type === "story",
)) {
  test(`Storybook ${story.id} : accessibilité et interactions`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const mode = testInfo.project.name === "sombre" ? "dark" : "light";
    await page.goto(
      `http://127.0.0.1:6006/iframe.html?id=${story.id}&viewMode=story&globals=mode:${mode}`,
    );
    await expect(page.locator("#storybook-root")).toHaveCount(1);
    await page.waitForFunction(() => {
      const preview = window as unknown as {
        __STORYBOOK_PREVIEW__?: { storyRenders?: Array<{ phase: string }> };
      };
      return preview.__STORYBOOK_PREVIEW__?.storyRenders?.some(
        (render) => render.phase === "finished" || render.phase === "errored",
      );
    });
    await expect(page.locator(".sb-errordisplay")).not.toBeVisible();
    expect(errors).toEqual([]);
    const result = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await testInfo.attach("audit-axe", {
      body: JSON.stringify(result, null, 2),
      contentType: "application/json",
    });
    expect(result.violations).toEqual([]);
  });
}
test("Galerie : audit et parcours clavier", async ({ page }, testInfo) => {
  const dark = testInfo.project.name === "sombre";
  await page.addInitScript(
    (value) => localStorage.setItem("atelier-mode", value ? "dark" : "light"),
    dark,
  );
  await page.goto(gallery);
  await expect(
    page.getByRole("button", {
      name: dark ? "Activer le mode clair" : "Activer le mode sombre",
    }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Aller au contenu" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  for (const name of [
    "Vue d’ensemble",
    "Couleurs",
    "Typographie",
    "Composants",
    "Espacements",
  ]) {
    await page.getByRole("button", { name, exact: true }).first().click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, name).toEqual([]);
  }
  await page
    .getByRole("button", { name: "Composants", exact: true })
    .first()
    .click();
  const name = page.getByRole("textbox", { name: "Nom complet" });
  await name.focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("textbox", { name: "Adresse e-mail" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("Camille Martin");
  await page
    .getByRole("textbox", { name: "Adresse e-mail" })
    .fill("camille@example.fr");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("alert").filter({ hasText: "Profil enregistré" }),
  ).toBeVisible();
  const trigger = page.getByRole("button", { name: "Guide d’installation" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.evaluate(async (element) => {
    const animations =
      element.closest(".MuiModal-root")?.getAnimations({ subtree: true }) ?? [];
    await Promise.all(
      animations
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished.catch(() => undefined)),
    );
  });
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  const tab = page.getByRole("tab", { name: "Aperçu", exact: true });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("tabpanel")).toHaveAccessibleName(
    "Principes & usage",
  );
  const docs = page.getByRole("link", {
    name: "Consulter les composants dans Storybook",
  });
  await expect(docs).toHaveAttribute(
    "href",
    `${process.env.GALLERY_BASE_PATH ?? "/"}storybook/`,
  );
});
test("Galerie : navigation mobile et thème persistant", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const dark = testInfo.project.name === "sombre";
  await page.addInitScript((value) => {
    if (!localStorage.getItem("atelier-mode"))
      localStorage.setItem("atelier-mode", value ? "dark" : "light");
  }, dark);
  await page.goto(gallery);
  const toggle = page.getByRole("button", {
    name: dark ? "Activer le mode clair" : "Activer le mode sombre",
  });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await page.reload();
  await expect(
    page.getByRole("button", {
      name: dark ? "Activer le mode sombre" : "Activer le mode clair",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: dark ? "Activer le mode sombre" : "Activer le mode clair",
    })
    .click();
  await page.getByRole("button", { name: "Composants", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Composants", exact: true }).first(),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
