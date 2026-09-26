// Regenerate the CV PDFs from cv.html:
//   assets/cv/Keshav_Aggarwal_CV.pdf        (full)
//   assets/cv/Keshav_Aggarwal_CV_short.pdf  (short)
//   npm install playwright && npx playwright install chromium
//   node tools/cv_pdf.mjs [FONTIN_DIR]
// FONTIN_DIR: folder with Fontin.otf, Fontin-Bold.otf, Fontin-Italic.otf and
// Fontin-SmallCaps.otf (the fonts of long_cv.tex). Without it the site serif is used.
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fontDir = process.argv[2] && path.resolve(process.argv[2]);
// Fonts are inlined as data URLs: a page opened from file:// cannot load file:// fonts.
const dataUrl = (file) => "data:font/otf;base64," + fs.readFileSync(path.join(fontDir, file)).toString("base64");
const face = (file, extra) => `@font-face { font-family: "Fontin"; src: url("${dataUrl(file)}"); ${extra} }`;
const fontCss = fontDir && fs.existsSync(path.join(fontDir, "Fontin.otf")) ? [
  face("Fontin.otf", "font-weight: 400; font-style: normal;"),
  face("Fontin-Bold.otf", "font-weight: 700; font-style: normal;"),
  face("Fontin-Italic.otf", "font-weight: 400; font-style: italic;"),
  `@font-face { font-family: "Fontin SC"; src: url("${dataUrl("Fontin-SmallCaps.otf")}"); }`,
  `.cvx { font-family: "Fontin", serif; } .cvx-sec h2, .cvx .bar th, .cvx-pd th { font-family: "Fontin SC", "Fontin", serif; font-variant: normal; }`,
].join("\n") : "";

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [mode, name] of [["long", "Keshav_Aggarwal_CV.pdf"], ["short", "Keshav_Aggarwal_CV_short.pdf"]]) {
  await page.goto(pathToFileURL(path.join(root, "cv.html")).href + (mode === "short" ? "#short" : ""), { waitUntil: "networkidle" });
  await page.evaluate((m) => { const b = document.querySelector(`button[data-cv="${m}"]`); if (b) b.click(); }, mode);
  if (fontCss) await page.addStyleTag({ content: fontCss });
  if (fontCss) await page.evaluate(() => Promise.all(["16px Fontin", "bold 16px Fontin", "italic 16px Fontin", '16px "Fontin SC"'].map((f) => document.fonts.load(f))));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  const out = path.join(root, "assets/cv", name);
  await page.pdf({
    path: out, format: "A4", printBackground: false,
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: '<div style="font:8px serif;color:#666;width:100%;text-align:center"><span class="pageNumber"></span></div>',
    margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
  });
  console.log("Wrote", path.relative(root, out));
}
await browser.close();
