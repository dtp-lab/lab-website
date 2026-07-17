(async function () {
  const { escapeHtml, loadJson, dateValue, imageMarkup, showDataError } = DTPLab;
  const root = document.querySelector("#projects-content");
  const buttons = [...document.querySelectorAll("[data-project-category]")];
  const categoryLabels = { industry: "산학", rnd: "R&D", talent: "인재" };
  let projects = [];
  const icons = {
    program: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V8l8-4 8 4v12M8 20v-5h8v5M8 10h.01M12 10h.01M16 10h.01"/></svg>',
    agency: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V9h14v12M3 9l9-6 9 6M9 13h6M9 17h6"/></svg>',
    period: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
    keyword: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3 8 21M16 3l-2 18M4 9h16M3 15h16"/></svg>',
  };
  const metaPart = (kind, label, value) => value ? `<span class="project-meta-part meta-${kind}">${icons[kind]}<span class="sr-only">${label}: </span><span>${escapeHtml(value)}</span></span>` : "";
  const renderCard = (project) => {
    const period = [project.period?.start, project.period?.end].filter(Boolean).join(" – ");
    const images = (project.images || []).filter((image) => typeof image === "string" ? image : image?.src);
    const hashtags = project.keywords?.length ? `<span class="project-meta-part meta-keyword">${icons.keyword}<span class="sr-only">키워드: </span><span class="project-hashtags">${project.keywords.map((keyword) => `<span>#${escapeHtml(keyword)}</span>`).join("")}</span></span>` : "";
    const meta = `${metaPart("program", "사업명 및 과제유형", project.program)}${metaPart("agency", "지원 및 발주기관", project.sponsor)}${metaPart("agency", "전담 및 관리기관", project.managingAgency)}${metaPart("period", "연구기간", period)}${hashtags}`;
    return `<article class="project-card"><header class="project-head"><div><div class="chip-row"><span class="chip category-${escapeHtml(project.category)}">${categoryLabels[project.category] || escapeHtml(project.category)}</span></div><h3>${escapeHtml(project.title)}</h3></div></header>${meta ? `<div class="project-meta-line">${meta}</div>` : ""}${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ""}${project.details?.length ? `<ol class="project-details">${project.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ol>` : ""}${images.length ? `<div class="record-gallery">${images.map((image) => imageMarkup(image, project.title)).join("")}</div>` : ""}</article>`;
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
