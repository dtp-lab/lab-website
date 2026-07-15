const members = {
  phd: [
    ["최호진", "Ho-Jin Choi", "Digital Twin Simulation · Robotics", "tiger981228@pusan.ac.kr"],
    ["이지혜", "Ji-Hye Lee", "RL · Digital Twin Simulation", "dlwlgp2920@pusan.ac.kr"],
    ["김준원", "Jun-Won Kim", "Unmanned Vehicle · Sensing", "kjw4156@naver.com"],
    ["최현석", "Hyun-Suk Choi", "Autonomous Manufacturing", "hschoi@rims.re.kr"],
  ],
  ms: [
    ["이창민", "Chang-Min Lee", "RL · Robotics", "lak0192@pusan.ac.kr"],
    ["고은성", "Eun-Seong Ko", "Computer Vision · Sim2Real", "eunseong624@pusan.ac.kr"],
    ["김민재", "Min-Jae Kim", "World Model · Robotics", "ysicka@pusan.ac.kr"],
    ["이창주", "Chang-Ju Lee", "RL · Embedded Systems", "busbtvi@pusan.ac.kr"],
    ["하서현", "Seo-Hyun Ha", "Digital Twin · Optimization", "bluelily811@pusan.ac.kr"],
  ],
  undergrad: [
    ["김성민", "Seong-Min Kim", "Digital Twin · Computer Vision", "dan1626@pusan.ac.kr"],
    ["여채언", "Chae-Eon Yeo", "Physical AI · Robotics", "codjs2659@pusan.ac.kr"],
    ["옥소미", "So-Mi Ok", "World Model · Physical AI", "osm0071@pusan.ac.kr"],
    ["홍석기", "Seok-Gi Hong", "RL · Digital Twin", "hongseokgi00@pusan.ac.kr"],
    ["홍세민", "Se-Min Hong", "World Model · Digital Twin", "semin73@pusan.ac.kr"],
    ["윤태호", "Tae-Ho Yun", "RL · Digital Twin", "taeho2004@pusan.ac.kr"],
    ["김범수", "Bum-Soo Kim", "Digital Twin · Physical AI", "cacaki@pusan.ac.kr"],
  ],
};

const publications = [
  { year: "2026", type: "SCIE", title: "A lightweight fusion localization framework integrating improved PDR and BLE location fingerprinting", authors: "Kaku Muto, Nobuyoshi Komuro, <b>Won-Suk Kim</b>, Younghwan Yoo", venue: "IEICE Nonlinear Theory and Its Applications, Vol. 17" },
  { year: "2026", type: "SCIE Q2", title: "Branch-Parallel Simulated Annealing for Energy-Efficient Multi-Compressor Operation", authors: "<b>Min-Jae Kim</b>, <b>Ho-Jin Choi</b>, Nobuyoshi Komuro, Jaeyoung Han, <b>Won-Suk Kim</b>", venue: "Electronics, Vol. 15, 214" },
  { year: "2025", type: "SCIE Q1", title: "Rehandling-aware stowage planning for RoRo ships using exclusive subgraph modeling and affinity-based cargo ordering", authors: "<b>Chang-Min Lee</b>, Hoon Lee, <b>Won-Suk Kim</b>", venue: "Scientific Reports, Vol. 15, 32841" },
  { year: "2025", type: "SCIE Q1", title: "Comparative study of thermal management systems in electric vehicles under cold climate conditions", authors: "Yebin Lee, <b>Won-Suk Kim</b>, Jaeyoung Han", venue: "Renewable Energy, Vol. 253, 123926" },
  { year: "2025", type: "SCIE Q1", title: "Optimization of Fuel Cell Bipolar Plate Using Genetic Algorithm and Lumped Parameter Method", authors: "Daeil Hyun, <b>Won-Suk Kim</b>, Jaeyoung Han", venue: "Energy, Vol. 334, 137801" },
  { year: "2025", type: "KCI", title: "Design of a Robust Digital Twin Simulator for Generating Noise-Resilient Welding Data in Shipyard Block Assembly", authors: "<b>Jeong-Ho Kim</b>, In-Oh Park, <b>Chang-Min Lee</b>, Hee-Jun Kim et al.", venue: "Journal of Korea Multimedia Society, Vol. 28" },
  { year: "2024", type: "SCIE Q2", title: "Microservice-oriented container provisioning framework for multi-user cloud virtual reality", authors: "<b>Ho-Jin Choi</b>, <b>Won-Suk Kim</b>", venue: "Applied Sciences" },
];

document.querySelectorAll("[data-members]").forEach((container) => {
  container.innerHTML = members[container.dataset.members].map(([ko, en, topic, email]) => `
    <article class="member">
      <h4>${ko} <span>${en}</span></h4>
      <p>${topic}</p>
      <a href="mailto:${email}">${email}</a>
    </article>`).join("");
});

const publicationList = document.querySelector("#publication-list");
publicationList.innerHTML = publications.map((publication) => `
  <article class="publication" data-publication-year="${publication.year}">
    <div class="pub-year">${publication.year}</div>
    <div><h3>${publication.title}</h3><p>${publication.authors} · ${publication.venue}</p></div>
    <div class="pub-type">${publication.type}</div>
  </article>`).join("");

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll("[data-publication-year]").forEach((item) => {
      item.hidden = button.dataset.year !== "all" && item.dataset.publicationYear !== button.dataset.year;
    });
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  siteNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("#site-nav a[href^='#']")];
const setActiveLink = () => {
  const current = sections.filter((section) => section.getBoundingClientRect().top < 180).at(-1)?.id;
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
};
window.addEventListener("scroll", setActiveLink, { passive: true });
document.querySelector("#year").textContent = new Date().getFullYear();
