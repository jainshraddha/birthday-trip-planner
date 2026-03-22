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
    document.body.className = m.bodyClass;
    document.body.dataset.city = m.dataCity;
    document.title = m.title;
    document.querySelectorAll("[data-trip-visible]").forEach(function (el) {
      el.hidden = el.getAttribute("data-trip-visible") !== k;
    });
    document.getElementById("trip-masthead-h1").textContent = m.h1;
    document.getElementById("trip-masthead-kicker").textContent = m.kicker;
    document.getElementById("trip-feed").setAttribute("aria-label", m.feedAriaLabel);
    document.getElementById("trip-map-block").setAttribute("aria-label", m.mapAriaLabel);
    var ifr = document.getElementById("trip-map-iframe");
    ifr.src = m.mapEmbedSrc;
    ifr.title = m.mapIframeTitle;
    document.getElementById("trip-map-link").href = m.mapLinkHref;
    document.getElementById("trip-footer-text").textContent = m.footerText;
  };

  window.TripApp.applyCityUI(window.TripApp.parseCityKey());
})();
