(async function () {
  const { escapeHtml, loadJson, groupByYear, renderKeywords, showDataError } = DTPLab;
  const root = document.querySelector("#publications-content");
  const buttons = [...document.querySelectorAll("[data-publication-type]")];
  let items = [], citations = { papers: {} };
  const renderAuthor = (author) => `<span class="author${author.isLabMember ? " lab-member" : ""}">${escapeHtml(author.name)}${author.isFirstAuthor ? '<span class="author-badge">제1저자</span>' : ""}${author.isCorrespondingAuthor ? '<span class="author-badge">교신저자</span>' : ""}</span>`;
  const renderMetrics = (item) => {
    const metrics = [];
    if (item.metrics?.indexing) metrics.push(`<span class="metric indexing">${escapeHtml(item.metrics.indexing)}</span>`);
    if (item.metrics?.quartile) metrics.push(`<span class="metric rank">${escapeHtml(item.metrics.quartile)}${item.metrics.metricYear ? ` · ${escapeHtml(item.metrics.metricYear)}` : ""}</span>`);
    if (item.metrics?.topPercent) metrics.push(`<span class="metric rank">Top ${escapeHtml(item.metrics.topPercent)}%</span>`);
    if (item.metrics?.award) metrics.push(`<span class="metric rank">${escapeHtml(item.metrics.award)}</span>`);
    const citation = citations.papers?.[item.id];
    if (Number.isInteger(citation?.citationCount)) metrics.push(`<span class="metric citations">Semantic Scholar citations ${citation.citationCount}${citation.checkedAt ? ` · ${escapeHtml(citation.checkedAt)}` : ""}</span>`);
    if (item.patentStatus) metrics.push(`<span class="metric patent">${escapeHtml(item.patentStatus)}</span>`);
    return metrics.length ? `<div class="metric-row">${metrics.join("")}</div>` : "";
  };
  const renderCard = (item) => {
    const links = [...(item.links || [])];
    if (item.doi) links.unshift({ label: "DOI", url: `https://doi.org/${item.doi}` });
    const citation = citations.papers?.[item.id];
    if (citation?.url && !links.some((link) => link.url === citation.url)) links.push({ label: "S2", url: citation.url });
    return `<article class="publication-card"><div class="publication-top"><div><span class="category-label">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3></div>${links.length ? `<nav class="publication-links" aria-label="외부 링크">${links.map((link) => `<a class="icon-link" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer" title="${escapeHtml(link.label)}">${escapeHtml(link.label)}</a>`).join("")}</nav>` : ""}</div>${item.authors?.length ? `<p class="authors">${item.authors.map(renderAuthor).join(", ")}</p>` : ""}<p class="publication-venue">${[item.venue, item.details, item.publishedAt].filter(Boolean).map(escapeHtml).join(" · ")}</p>${renderMetrics(item)}${renderKeywords(item.keywords)}</article>`;
  };
  const render = (type) => {
    const groups = groupByYear(items.filter((item) => item.type === type), (item) => item.publishedAt);
    root.innerHTML = Object.entries(groups).map(([year, publications]) => `<section class="year-group"><header class="year-heading"><h2>${escapeHtml(year)}</h2><span>${publications.length}건</span></header>${publications.map(renderCard).join("")}</section>`).join("") || '<p class="empty-state">등록된 실적이 없습니다.</p>';
  };
  try { const [data, cache] = await Promise.all([loadJson("publications.json"), loadJson("citations.json")]); items = data.items || []; citations = cache; render("journal"); } catch (error) { showDataError(root, error); }
  buttons.forEach((button) => button.addEventListener("click", () => { buttons.forEach((item) => { item.classList.toggle("active", item === button); item.setAttribute("aria-pressed", String(item === button)); }); render(button.dataset.publicationType); }));
})();
