import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "site", "data");
const read = async (name) => JSON.parse(await readFile(path.join(dataDir, name), "utf8"));
const write = async (name, value) => writeFile(path.join(dataDir, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const normalizeDate = (value = "") => {
  const match = String(value).match(/(20\d{2})[.\-/]\s*(\d{1,2})(?:[.\-/]\s*(\d{1,2}))?/);
  return match ? [match[1], match[2].padStart(2, "0"), match[3]?.padStart(2, "0")].filter(Boolean).join(".") : "";
};
const lastDate = (value = "") => {
  const matches = [...String(value).matchAll(/(20\d{2})[.\-/]\s*(\d{1,2})(?:[.\-/]\s*(\d{1,2}))?/g)];
  const match = matches.at(-1);
  return match ? [match[1], match[2].padStart(2, "0"), match[3]?.padStart(2, "0")].filter(Boolean).join(".") : "";
};
const controlledKeywords = [
  ["Digital Twin", /digital twin|twin simulator|simulation|디지털트윈|시뮬레이터/i], ["Physical AI", /physical ai|embodied|피지컬\s*ai/i],
  ["Sim2Real", /sim.?2.?real|domain random|synthetic|전이학습/i], ["Robotics", /robot|unmanned|autonomous|로봇|무인|자율/i],
  ["Reinforcement Learning", /reinforcement|reward|policy|mbrl|강화학습/i], ["Optimization", /optimi|annealing|genetic algorithm|stowage|scheduling|최적화|배치|경로생성/i],
  ["Surrogate Modeling", /surrogate|pde|approximation|대체모델|근사모델/i], ["Computer Vision", /vision|imagery|image|segmentation|detection|localization|fingerprint|비전|영상|인식|카메라/i],
  ["Synthetic Data", /synthetic data|synthetic imagery|합성데이터/i], ["Energy Systems", /energy|compressor|fuel cell|thermal management|power consumption|전력|열관리|에너지/i],
  ["AI Education", /인재양성|교육훈련/i]
];
const keywordsFor = (text) => controlledKeywords.filter(([, pattern]) => pattern.test(text)).map(([keyword]) => keyword).slice(0, 5);

const people = await read("people.json");
for (const group of Object.values(people.groups || {})) for (const person of group) person.image = "";
people.migrated = "2026-07-17";
await write("people.json", people);

const research = await read("research.json");
for (const item of research.research || []) item.image = "";
research.images = [];
await write("research.json", research);

const gallery = await read("gallery.json");
gallery.migrated = "2026-07-17";
gallery.events = (gallery.events || []).map((event) => {
  if (event.date) return { ...event, images: (event.images || []).filter((image) => typeof image === "object" && image.src) };
  return { date: normalizeDate(event.title), title: String(event.title || "").replace(/^20\d{2}[.\-/]\d{1,2}\s*/, "").trim(), description: event.description || "", images: [] };
});
await write("gallery.json", gallery);

const rawProjects = await read("projects.json");
if (!rawProjects.projects) {
  const sourceProjects = [...(rawProjects.current || []), ...(rawProjects.completed || [])];
  const projects = sourceProjects.map((project, index) => {
    const parts = String(project.meta || "").split("|").map((part) => part.trim()).filter(Boolean);
    const dates = [...String(project.meta || "").matchAll(/20\d{2}[.]\d{1,2}/g)].map((match) => normalizeDate(match[0]));
    const budgetPart = parts.find((part) => /^\s*[\d,]+\s*\(/.test(part));
    const amount = budgetPart?.match(/[\d,]+/)?.[0] || "";
    const institution = parts.find((part) => part !== budgetPart && !/20\d{2}[.]\d{1,2}/.test(part)) || "";
    const text = `${project.title || ""} ${project.description || ""} ${(project.details || []).join(" ")}`;
    let category = "rnd";
    if (/RISE|LG|Samsung|한화|산학|Electronics|Heavy Industries/i.test(`${project.meta} ${project.title}`)) category = "industry";
    if (/AI.*대학원|인재|교육|양성/i.test(`${project.meta} ${project.title}`)) category = "talent";
    return { id: `project-${String(index + 1).padStart(2, "0")}`, status: project.status === "completed" ? "completed" : "current", category, title: project.title || "", program: institution, sponsor: "", managingAgency: "", period: { start: dates[0] || "", end: dates[1] || "" }, budget: amount ? { amount, unit: "천원" } : null, keywords: keywordsFor(text), description: project.description || "", details: project.details || [], images: [], rawMeta: project.meta || "" };
  });
  await write("projects.json", { source: rawProjects.source, migrated: "2026-07-17", projects });
}
const structuredProjects = await read("projects.json");
for (const project of structuredProjects.projects || []) {
  const categoryText = `${project.program || ""} ${project.title || ""}`;
  project.category = /인재양성|AI대학원/i.test(categoryText) ? "talent" : /RISE|LG|Samsung|삼성|한화|토탈소프트|산학|Electronics|Heavy Industries/i.test(categoryText) ? "industry" : "rnd";
  project.keywords = keywordsFor(`${project.title || ""} ${project.description || ""} ${(project.details || []).join(" ")}`);
}
await write("projects.json", structuredProjects);

const publications = await read("publications.json");
if (!publications.items) {
  const labNames = new Set(["Won-Suk Kim"]);
  for (const group of Object.values(people.groups || {})) for (const person of group) labNames.add(String(person.name || "").split("(")[0].trim().replace(/, Ph[.]D[.]?$/i, ""));
  const parseAuthors = (value) => String(value || "").replace(/,?\s+and\s+/g, ", ").split(",").map((raw) => raw.trim()).filter(Boolean).map((raw) => {
    const isCorrespondingAuthor = raw.endsWith("*");
    const withoutCorresponding = raw.replace(/\*+$/, "").trim();
    const isFirstAuthor = /1$/.test(withoutCorresponding);
    const name = withoutCorresponding.replace(/1$/, "").trim();
    return { name, isLabMember: labNames.has(name), isFirstAuthor, isCorrespondingAuthor };
  });
  const parseMetrics = (citation) => {
    const note = citation.match(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*$/)?.[1] || "";
    return { indexing: note.match(/\b(SCIE|ESCI|KCI)\b/i)?.[1]?.toUpperCase() || "", quartile: note.match(/\bQ[1-4]\b/i)?.[0]?.toUpperCase() || "", topPercent: note.match(/(?:JCR\s*)?(\d+(?:[.]\d+)?)\s*%/i)?.[1] || "", award: note.match(/BK[^,)]*|IF\s*\d+/i)?.[0] || "", metricYear: "" };
  };
  const parsePaper = (record, type, index) => {
    const citation = record.citation || "";
    const quoted = citation.match(/"([\s\S]*?)"/);
    const title = quoted?.[1]?.trim().replace(/\s+,$/, "") || citation;
    const beforeTitle = quoted ? citation.slice(0, quoted.index) : "";
    const afterTitle = quoted ? citation.slice((quoted.index || 0) + quoted[0].length).replace(/^\s*,\s*/, "") : "";
    const publishedAt = normalizeDate(citation) || `${record.year || ""}.01`;
    const cleanAfter = afterTitle.replace(/\s*\([^()]*\)\s*$/, "").replace(/,?\s*20\d{2}[.]\d{1,2}[.]?\s*$/, "");
    const parts = cleanAfter.split(",").map((part) => part.trim()).filter(Boolean);
    const venue = parts.shift() || "";
    return { id: `${type}-${publishedAt.replaceAll(".", "")}-${String(index + 1).padStart(2, "0")}`, type, publishedAt, title, authors: parseAuthors(beforeTitle), venue, details: parts.join(", "), metrics: parseMetrics(citation), keywords: keywordsFor(`${title} ${venue}`), doi: "", semanticScholarId: "", links: [], rawCitation: citation };
  };
  const journal = (publications.articles || []).map((record, index) => parsePaper(record, "journal", index));
  const conference = (publications.conferences || []).map((record, index) => parsePaper(record, "conference", index));
  const patent = (publications.patents || []).map((record, index) => {
    const citation = record.citation || "";
    const status = citation.match(/^\[([^\]]+)\]/)?.[1] || "";
    const withoutStatus = citation.replace(/^\[[^\]]+\]\s*/, "");
    const parts = withoutStatus.split(",").map((part) => part.trim()).filter(Boolean);
    const date = lastDate(citation) || `${record.year || ""}.01`;
    return { id: `patent-${date.replaceAll(".", "")}-${String(index + 1).padStart(2, "0")}`, type: "patent", publishedAt: date, title: parts[0] || withoutStatus, authors: [], venue: "대한민국 특허", details: parts.slice(1, -1).join(", "), patentStatus: status, patentNumber: parts[1] || "", metrics: {}, keywords: keywordsFor(parts[0] || ""), doi: "", semanticScholarId: "", links: [], rawCitation: citation };
  });
  await write("publications.json", { source: publications.source, migrated: "2026-07-17", items: [...journal, ...conference, ...patent] });
}
else {
  for (const item of publications.items) {
    if (item.type === "patent") item.publishedAt = lastDate(item.rawCitation) || item.publishedAt;
    item.title = String(item.title || "").replace(/,\s*$/, "");
  }
  await write("publications.json", publications);
}

try { await read("citations.json"); } catch { await write("citations.json", { source: "Semantic Scholar", updatedAt: null, papers: {} }); }
console.log("Structured people, research, gallery, projects, and publications data.");
