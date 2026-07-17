(async function () {
  const { escapeHtml, loadJson, sortByDateDesc, imageMarkup, showDataError } = DTPLab;
  const root = document.querySelector("#gallery-content");
  const dialog = document.querySelector("#gallery-lightbox");
  const dialogImage = document.querySelector("#lightbox-image");
  const dialogCaption = document.querySelector("#lightbox-caption");
  let activeImages = [], activeIndex = 0, trigger = null;
  const showImage = () => { const image = activeImages[activeIndex]; dialogImage.src = image.src; dialogImage.alt = image.alt || ""; dialogCaption.textContent = image.caption || image.alt || ""; };
  const move = (direction) => { activeIndex = (activeIndex + direction + activeImages.length) % activeImages.length; showImage(); };
  const open = (images, index, button) => { activeImages = images; activeIndex = index; trigger = button; showImage(); dialog.showModal(); };
  try {
    const data = await loadJson("gallery.json");
    const events = sortByDateDesc(data.events);
    root.innerHTML = events.map((event, eventIndex) => `<article class="gallery-event"><time datetime="${escapeHtml(event.date)}">${escapeHtml(event.date)}</time><h2>${escapeHtml(event.title)}</h2>${event.description ? `<p>${escapeHtml(event.description)}</p>` : ""}${event.images?.length ? `<div class="gallery-grid">${event.images.map((image, imageIndex) => `<button class="gallery-thumb" type="button" data-event="${eventIndex}" data-image="${imageIndex}" aria-label="${escapeHtml(image.alt || event.title)} 크게 보기">${imageMarkup(image, event.title)}</button>`).join("")}</div>` : ""}</article>`).join("") || '<p class="empty-state">등록된 행사가 없습니다.</p>';
    root.querySelectorAll(".gallery-thumb").forEach((button) => button.addEventListener("click", () => open(events[Number(button.dataset.event)].images, Number(button.dataset.image), button)));
  } catch (error) { showDataError(root, error); }
  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".lightbox-prev").addEventListener("click", () => move(-1));
  dialog.querySelector(".lightbox-next").addEventListener("click", () => move(1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
    if (event.key === "Escape") { event.preventDefault(); dialog.close(); }
  });
  dialog.addEventListener("close", () => trigger?.focus());
})();
