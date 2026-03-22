/**
 * Runs synchronously on city.html so masthead, body class, and map match the URL before first paint.
 */
(function () {
  window.TripApp = window.TripApp || {};

  window.TripApp.parseCityKey = function () {
    var q = new URLSearchParams(location.search).get("city");
    if (q === "paris") return "paris";
    if (q === "london") return "london";
    return "amsterdam";
  };

  window.TripApp.applyCityUI = function (k) {
    var m = window.TRIP_CITY_META[k];
    if (!m) return;
    document.body.className = ["page-city", m.bodyClass].filter(Boolean).join(" ");
    document.body.dataset.city = m.dataCity;
    document.title = m.title;
    document.querySelectorAll("[data-trip-visible]").forEach(function (el) {
      el.hidden = el.getAttribute("data-trip-visible") !== k;
    });
    document.getElementById("trip-masthead-h1").textContent = m.h1;
    document.getElementById("trip-masthead-kicker").textContent = m.kicker;

    var eyebrow = document.getElementById("trip-hero-eyebrow");
    if (eyebrow) eyebrow.textContent = m.heroEyebrow || "";

    var lede = document.getElementById("trip-hero-lede");
    if (lede) lede.textContent = m.heroLede || "";

    var boardTitle = document.getElementById("trip-board-title");
    if (boardTitle) boardTitle.textContent = m.boardTitle || "";

    var boardLede = document.getElementById("trip-board-lede");
    if (boardLede) boardLede.textContent = m.boardLede || "";

    var splitH = document.getElementById("trip-split-h2");
    if (splitH) splitH.textContent = m.splitTitle || "";

    var splitP = document.getElementById("trip-split-p");
    if (splitP) splitP.textContent = m.splitText || "";

    var splitImg = document.getElementById("trip-split-img");
    if (splitImg) {
      splitImg.src = m.splitImage || "";
      splitImg.alt = m.splitImageAlt || "";
    }

    document.getElementById("trip-feed").setAttribute("aria-label", m.feedAriaLabel);
    document.getElementById("trip-map-block").setAttribute("aria-label", m.mapAriaLabel);
    var mapIframe = document.getElementById("trip-map-my-maps-embed");
    if (mapIframe) {
      mapIframe.title = m.mapIframeTitle || "Map";
      mapIframe.setAttribute("aria-label", m.mapAriaLabel || "");
      if (m.mapMyMapsEmbedSrc) {
        mapIframe.src = m.mapMyMapsEmbedSrc;
      } else {
        mapIframe.src = "about:blank";
      }
    }
    document.getElementById("trip-map-link").href = m.mapLinkHref;
    document.getElementById("trip-footer-text").textContent = m.footerText;
  };

  window.TripApp.applyCityUI(window.TripApp.parseCityKey());
})();
