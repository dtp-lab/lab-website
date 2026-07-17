(async function () {
  const { escapeHtml, loadJson, groupByYear, showDataError } = DTPLab;
  const root = document.querySelector("#seminars-content");
  try {
    const data = await loadJson("seminars.json");
    const groups = groupByYear(data.seminars);
    root.innerHTML = Object.entries(groups).map(([year, seminars]) => `<section class="year-group"><header class="year-heading"><h2>${escapeHtml(year)}</h2><span>${seminars.length}회</span></header><div class="seminar-list">${seminars.map((seminar) => `<details class="seminar-card"><summary><time datetime="${escapeHtml(seminar.date)}">${escapeHtml(seminar.date)}</time><span class="seminar-title">${escapeHtml(seminar.title)}</span><span class="speaker">${escapeHtml(seminar.speaker)}</span></summary><p class="seminar-summary">${escapeHtml(seminar.summary)}</p></details>`).join("")}</div></section>`).join("");
    root.querySelectorAll("details").forEach((details) => { const summary = details.querySelector("summary"); const update = () => summary.setAttribute("aria-expanded", String(details.open)); update(); details.addEventListener("toggle", update); });
  } catch (error) { showDataError(root, error); }
})();
