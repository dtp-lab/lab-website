(async function () {
  const { escapeHtml, loadJson, groupByYear, imageMarkup, showDataError } = DTPLab;
  const recruitment = document.querySelector("#recruitment-content");
  const research = document.querySelector("#research-grid");
  const news = document.querySelector("#news-groups");
  const newsIcons = {
    project: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z"/><path d="M3 7.5V5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2.5"/></svg>',
    publication: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 12h7M9 16h7"/></svg>',
    member: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>',
    award: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v5a4 4 0 0 1-8 0V3Z"/><path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6"/></svg>',
  };
  try {
    const [homeData, researchData, newsData] = await Promise.all([loadJson("home.json"), loadJson("research.json"), loadJson("news.json")]);
    recruitment.innerHTML = `<p class="recruitment-intro">${escapeHtml(homeData.recruitment.intro)}</p><div class="recruitment-grid">${homeData.recruitment.sections.map((section) => `<section class="recruitment-block"><h3>${escapeHtml(section.title)}</h3><ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`).join("")}</div>`;
    research.innerHTML = researchData.research.map((item, index) => `<article class="research-card">${imageMarkup(item.image, item.title)}<span class="index">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("");
    const groups = groupByYear(newsData.news);
    news.innerHTML = Object.entries(groups).map(([year, items]) => `<section class="year-group news-year"><header class="year-heading"><h2>${escapeHtml(year)}</h2><span>${items.length}건</span></header><div class="news-list">${items.map((item) => `<article class="news-item news-${escapeHtml(item.category)}"><time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time><span class="news-type"><span class="news-icon" aria-hidden="true">${newsIcons[item.category] || ""}</span><span class="category-label">${escapeHtml(item.category)}</span></span><p>${escapeHtml(item.text)}</p></article>`).join("")}</div></section>`).join("");
  } catch (error) { showDataError(recruitment || research || news, error); }
})();
