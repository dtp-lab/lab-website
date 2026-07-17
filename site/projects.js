(async function () {
  const { escapeHtml, loadJson, dateValue, renderKeywords, imageMarkup, showDataError } = DTPLab;
  const root = document.querySelector("#projects-content");
  const buttons = [...document.querySelectorAll("[data-project-category]")];
  const categoryLabels = { industry: "산학", rnd: "R&D", talent: "인재" };
  let projects = [];
  const metaItem = (label, value) => value ? `<div class="meta-item"><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>` : "";
  const renderCard = (project) => {
    const period = [project.period?.start, project.period?.end].filter(Boolean).join(" – ");
    const budget = project.budget?.amount ? `${project.budget.amount} ${project.budget.unit || ""}` : "";
    const images = (project.images || []).filter((image) => typeof image === "string" ? image : image?.src);
    return `<article class="project-card"><header class="project-head"><div><div class="chip-row"><span class="chip ${project.status === "current" ? "green" : ""}">${project.status === "current" ? "CURRENT" : "COMPLETED"}</span><span class="chip blue">${categoryLabels[project.category] || escapeHtml(project.category)}</span></div><h3>${escapeHtml(project.title)}</h3></div></header><dl class="project-meta-grid">${metaItem("사업명 · 과제유형", project.program)}${metaItem("지원 · 발주기관", project.sponsor)}${metaItem("전담 · 관리기관", project.managingAgency)}${metaItem("연구기간", period)}${metaItem("연구비", budget)}</dl>${renderKeywords(project.keywords)}${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ""}${project.details?.length ? `<ol class="project-details">${project.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ol>` : ""}${images.length ? `<div class="record-gallery">${images.map((image) => imageMarkup(image, project.title)).join("")}</div>` : ""}</article>`;
  };
  const render = (category = "all") => {
    const filtered = category === "all" ? projects : projects.filter((project) => project.category === category);
    const current = filtered.filter((project) => project.status === "current").sort((a, b) => dateValue(b.period?.start) - dateValue(a.period?.start));
    const completed = filtered.filter((project) => project.status === "completed").sort((a, b) => dateValue(b.period?.end) - dateValue(a.period?.end));
    const section = (title, items) => `<section class="project-section"><header class="year-heading"><h2>${title}</h2><span>${items.length}건</span></header>${items.length ? items.map(renderCard).join("") : '<p class="empty-state">해당 카테고리의 프로젝트가 없습니다.</p>'}</section>`;
    root.innerHTML = section("Current Projects", current) + section("Completed Projects", completed);
  };
  try { const data = await loadJson("projects.json"); projects = data.projects || []; render(); } catch (error) { showDataError(root, error); }
  buttons.forEach((button) => button.addEventListener("click", () => { buttons.forEach((item) => { item.classList.toggle("active", item === button); item.setAttribute("aria-pressed", String(item === button)); }); render(button.dataset.projectCategory); }));
})();
