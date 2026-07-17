import fs from "node:fs";
import path from "node:path";

const requestedDir = process.argv[2] || "_site";
const siteDir = path.resolve(requestedDir);
if (!fs.existsSync(siteDir)) {
  console.error(`Link and markup check failed: directory does not exist (${requestedDir})`);
  process.exit(1);
}
const pages = fs.readdirSync(siteDir).filter((file) => file.endsWith(".html"));
const errors = [];
for (const page of pages) {
  const html = fs.readFileSync(path.join(siteDir, page), "utf8");
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(value)) continue;
    const file = value.split(/[?#]/)[0];
    if (!file) continue;
    const resolved = path.resolve(siteDir, file);
    if (!resolved.startsWith(siteDir) || !fs.existsSync(resolved)) errors.push(`${page}: missing ${value}`);
  }
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (page !== "archive.html" && h1Count !== 1) errors.push(`${page}: expected one H1, found ${h1Count}`);
  if (page !== "archive.html" && !/<head>[\s\S]*<\/head>/i.test(html)) errors.push(`${page}: missing rendered head`);
  if (page !== "archive.html" && !/<header class="site-header"/i.test(html)) errors.push(`${page}: missing rendered header`);
  if (page !== "archive.html" && !/<footer class="site-footer"/i.test(html)) errors.push(`${page}: missing rendered footer`);
  if (html.includes("[object Promise]")) errors.push(`${page}: unresolved EJS include promise`);
}
if (errors.length) { console.error(`Link and markup check failed (${errors.length})`); errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log(`Link and markup check passed for ${pages.length} HTML pages.`);
