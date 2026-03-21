(function () {
  function tripCityKey() {
    return new URLSearchParams(location.search).get("city") === "paris" ? "paris" : "amsterdam";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const cityKey = tripCityKey();
    if (!window.TripApp) return;

    const mainEl = document.getElementById("trip-feed");
    if (!mainEl) return;

    const script = document.createElement("script");
    script.src = new URL("js/feed-" + cityKey + ".js", location.href).href;
    script.onload = function () {
      const html = window.TRIP_FEED_HTML;
      delete window.TRIP_FEED_HTML;
      if (typeof html !== "string") {
        mainEl.innerHTML =
          '<p class="trip-feed-error" role="alert">This city’s board didn’t load correctly. Try refreshing the page.</p>';
        return;
      }
      mainEl.innerHTML = html;
      window.TripApp.initFeedPins();
    };
    script.onerror = function () {
      mainEl.innerHTML =
        '<p class="trip-feed-error" role="alert">Couldn’t find the board script for this city. If you’re developing, run <code>python3 scripts/embed-feeds.py</code> after editing <code>feed/*.html</code>.</p>';
    };
    document.head.appendChild(script);
  });
})();
