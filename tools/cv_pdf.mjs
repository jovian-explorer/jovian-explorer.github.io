// Regenerate assets/cv/Keshav_Aggarwal_CV.pdf from cv.html.
//   npm install playwright && npx playwright install chromium
//   node tools/cv_pdf.mjs
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "assets/cv/Keshav_Aggarwal_CV.pdf");
const browser = await chromium.launch();
const page = await browser.newPage();
for (let i = 0; i < 4; i++) {
  await page.goto(pathToFileURL(path.join(root, "cv.html")).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (await page.evaluate(() => (async () => { await document.fonts.load('600 16px "Source Serif 4"'); await document.fonts.load('16px "Source Sans 3"'); await document.fonts.load('16px "IBM Plex Mono"'); return [...document.fonts].filter(f => f.status === 'loaded' && /Source Serif 4|Source Sans 3|IBM Plex Mono/.test(f.family)).map(f => f.family).filter((x, i, a) => a.indexOf(x) === i).length === 3; })())) break;
}
await page.emulateMedia({ media: "print", colorScheme: "light" });
await page.pdf({
  path: out, format: "A4", printBackground: false,
  displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: '<div style="font:8px sans-serif;color:#666;width:100%;padding:0 15mm;display:flex;justify-content:space-between"><span>Keshav Aggarwal · jovian-explorer.github.io</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  margin: { top: "16mm", bottom: "18mm", left: "15mm", right: "15mm" },
});
await browser.close();
console.log("Wrote", path.relative(root, out));
