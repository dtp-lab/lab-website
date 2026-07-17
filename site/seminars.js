(async function () {
  const { escapeHtml, loadJson, groupByYear, renderKeywords, showDataError } = DTPLab;
  const root = document.querySelector("#seminars-content");
  try {
    const data = await loadJson("seminars.json");
    const groups = groupByYear(data.seminars);
    root.innerHTML = Object.entries(groups).map(([year, seminars]) => `<section class="year-group"><header class="year-heading"><h2>${escapeHtml(year)}</h2><span>${seminars.length}회</span></header><div class="seminar-list">${seminars.map((seminar) => `<article class="seminar-card"><header class="seminar-head"><time datetime="${escapeHtml(seminar.date)}">${escapeHtml(seminar.date)}</time><span class="speaker">${escapeHtml(seminar.speaker)}</span></header><h3 class="seminar-title">${escapeHtml(seminar.title)}</h3>${renderKeywords(seminar.keywords)}<p class="seminar-summary">${escapeHtml(seminar.summary)}</p></article>`).join("")}</div></section>`).join("");
  } catch (error) { showDataError(root, error); }
})();
