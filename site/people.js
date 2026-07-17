(async function () {
  const { escapeHtml, loadJson, imageMarkup, showDataError } = DTPLab;
  const root = document.querySelector("#people-content");
  const labels = { professor: "Professor", phd: "Ph.D. Students", ms: "M.S. Students", undergrad: "Undergraduate Researchers", alumni: "Alumni" };
  const fieldLabels = { "e-mail": "Email", email: "Email", affiliation: "Affiliation", research_topic: "Research topic", interests: "Interests", office: "Office", "tel.": "Tel." };
  const renderPhoto = (person) => `<div class="person-photo">${imageMarkup(person.image, `${person.name} 프로필`)}</div>`;
  const renderFields = (person, omitCareer = false) => Object.entries(person.fields || {})
    .filter(([key]) => key !== "interests" && (!omitCareer || !/^\d{4}_/.test(key)))
    .map(([key, value]) => `<div><dt>${escapeHtml(fieldLabels[key] || key.replaceAll("_", " "))}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
  const renderPerson = (person) => `<article class="person-card">${renderPhoto(person)}<div class="person-body"><h3>${escapeHtml(person.name)}</h3><dl>${renderFields(person)}</dl></div></article>`;
  try {
    const data = await loadJson("people.json");
    const professor = data.groups.professor?.[0];
    const professorHtml = professor ? `<section class="people-section"><header><h2>${labels.professor}</h2><span>01</span></header><article class="professor-card">${renderPhoto(professor)}<div class="person-body"><h3>${escapeHtml(professor.name)}</h3><dl>${renderFields(professor, true)}</dl><div class="career-list">${Object.entries(professor.fields || {}).filter(([key]) => /^\d{4}_/.test(key)).map(([key, value]) => `<div><time>${escapeHtml(key.replaceAll("_", " "))}</time><span>${escapeHtml(value)}</span></div>`).join("")}</div></div></article></section>` : "";
    const groupsHtml = ["phd", "ms", "undergrad", "alumni"].map((key) => { const people = data.groups[key] || []; return `<section class="people-section"><header><h2>${labels[key]}</h2><span>${String(people.length).padStart(2, "0")}</span></header><div class="people-grid">${people.map(renderPerson).join("")}</div></section>`; }).join("");
    root.innerHTML = professorHtml + groupsHtml;
  } catch (error) { showDataError(root, error); }
})();
