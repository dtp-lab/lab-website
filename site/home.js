(async function () {
  const { escapeHtml, loadJson, groupByYear, imageMarkup, showDataError } = DTPLab;
  const recruitment = document.querySelector("#recruitment-content");
  const research = document.querySelector("#research-grid");
  const news = document.querySelector("#news-groups");
  try {
    const [homeData, researchData, newsData] = await Promise.all([loadJson("home.json"), loadJson("research.json"), loadJson("news.json")]);
    recruitment.innerHTML = `<p class="recruitment-intro">${escapeHtml(homeData.recruitment.intro)}</p><div class="recruitment-grid">${homeData.recruitment.sections.map((section) => `<section class="recruitment-block"><h3>${escapeHtml(section.title)}</h3><ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`).join("")}</div>`;
    research.innerHTML = researchData.research.map((item, index) => `<article class="research-card">${imageMarkup(item.image, item.title)}<span class="index">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("");
    const groups = groupByYear(newsData.news);
    news.innerHTML = Object.entries(groups).map(([year, items]) => `<section class="year-group"><header class="year-heading"><h2>${escapeHtml(year)}</h2><span>${items.length}건</span></header><div class="news-list">${items.map((item) => `<article class="news-item"><time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time><span class="category-label">${escapeHtml(item.category)}</span><p>${escapeHtml(item.text)}</p></article>`).join("")}</div></section>`).join("");
  } catch (error) { showDataError(recruitment || research || news, error); }
})();
