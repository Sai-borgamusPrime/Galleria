(function () {
  "use strict";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".art-card"));
  var search = document.getElementById("artSearch");
  var queryLabel = document.getElementById("queryLabel");
  var visibleCount = document.getElementById("visibleCount");
  var clearFilters = document.getElementById("clearFilters");
  var filters = Array.prototype.slice.call(document.querySelectorAll("input[name='classification']"));
  var modal = document.getElementById("artModal");
  var modalImage = document.getElementById("modalImage");
  var caption = document.getElementById("caption");
  var close = modal ? modal.querySelector(".close") : null;

  function getActiveFilters() {
    return filters.filter(function (filter) {
      return filter.checked;
    }).map(function (filter) {
      return filter.value;
    });
  }

  function updateGallery() {
    if (!cards.length) return;

    var query = search ? search.value.trim().toLowerCase() : "";
    var activeFilters = getActiveFilters();
    var count = 0;

    cards.forEach(function (card) {
      var title = (card.dataset.title || "").toLowerCase();
      var classifications = (card.dataset.classification || "").toLowerCase();
      var matchesSearch = !query || title.indexOf(query) !== -1 || classifications.indexOf(query) !== -1;
      var matchesFilter = !activeFilters.length || activeFilters.some(function (filter) {
        return classifications.indexOf(filter) !== -1;
      });
      var visible = matchesSearch && matchesFilter;

      card.classList.toggle("is-hidden", !visible);
      if (visible) count += 1;
    });

    if (visibleCount) visibleCount.textContent = count;
    if (queryLabel) queryLabel.textContent = query || "all works";
  }

  function openModal(trigger) {
    if (!modal || !modalImage || !caption) return;

    var image = trigger.querySelector("img");
    var title = trigger.querySelector("h2");
    var meta = trigger.querySelector("p");
    if (!image) return;

    modalImage.src = image.src;
    modalImage.alt = image.alt;
    caption.textContent = [title && title.textContent, meta && meta.textContent].filter(Boolean).join(" / ");
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  cards.forEach(function (card) {
    var trigger = card.querySelector(".art-trigger");
    if (trigger) {
      trigger.addEventListener("click", function () {
        openModal(trigger);
      });
    }
  });

  if (search) search.addEventListener("input", updateGallery);
  filters.forEach(function (filter) {
    filter.addEventListener("change", updateGallery);
  });
  if (clearFilters) {
    clearFilters.addEventListener("click", function () {
      filters.forEach(function (filter) {
        filter.checked = false;
      });
      updateGallery();
    });
  }

  if (close) close.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });

  updateGallery();
}());
