(function () {
  function tripCityKey() {
    return window.TripApp && window.TripApp.parseCityKey
      ? window.TripApp.parseCityKey()
      : (function () {
          var q = new URLSearchParams(location.search).get("city");
          if (q === "paris") return "paris";
          if (q === "london") return "london";
          return "amsterdam";
        })();
  }

  /** Directory URL for resolving js/… (handles /repo vs /repo/ and *.html). */
  function tripAssetDirHref() {
    var u = new URL(location.href);
    var path = u.pathname;
    if (path.endsWith("/")) return u.href;
    if (/\.html?$/i.test(path)) {
      u.pathname = path.replace(/[^/]+$/, "");
      return u.href;
    }
    u.pathname = path + "/";
    return u.href;
  }

  var TRANSITION_MS = 340;
  var transitionFallbackTimer = null;
  var citySwitchInProgress = false;

  function removeFeedLoaderScripts() {
    document.querySelectorAll("script[data-trip-feed-loader]").forEach(function (n) {
      n.remove();
    });
  }

  function loadCityFeed(cityKey, done) {
    var mainEl = document.getElementById("trip-feed");
    if (!mainEl) {
      if (done) done(false);
      return;
    }
    if (window.TripApp.closeFeedModalIfOpen) window.TripApp.closeFeedModalIfOpen();

    removeFeedLoaderScripts();

    var script = document.createElement("script");
    script.setAttribute("data-trip-feed-loader", cityKey);
    script.src = new URL("js/feed-" + cityKey + ".js", tripAssetDirHref()).href;
    script.onload = function () {
      var html = window.TRIP_FEED_HTML;
      delete window.TRIP_FEED_HTML;
      if (typeof html !== "string") {
        mainEl.innerHTML =
          '<p class="trip-feed-error" role="alert">This city’s board didn’t load correctly. Try refreshing the page.</p>';
        if (done) done(false);
        return;
      }
      mainEl.innerHTML = html;
      window.TripApp.initFeedPins();
      if (done) done(true);
    };
    script.onerror = function () {
      mainEl.innerHTML =
        '<p class="trip-feed-error" role="alert">Couldn’t find the board script for this city. If you’re developing, run <code>python3 scripts/embed-feeds.py</code> after editing <code>feed/amsterdam.html</code>, <code>feed/paris.html</code>, or <code>feed/london.html</code>.</p>';
      if (done) done(false);
    };
    document.head.appendChild(script);
  }

  window.TripApp = window.TripApp || {};
  window.TripApp.loadCityFeed = loadCityFeed;

  /**
   * Client-side city change: updates UI, URL, feed, and music with a short crossfade (unless reduced motion).
   */
  window.TripApp.switchCity = function (cityKey) {
    if (!cityKey || !window.TRIP_CITY_META[cityKey]) return;
    var feed = document.getElementById("trip-feed");
    if (!feed) return;
    if (citySwitchInProgress) return;
    if (cityKey === document.body.dataset.city) return;

    if (transitionFallbackTimer != null) {
      clearTimeout(transitionFallbackTimer);
      transitionFallbackTimer = null;
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finishOnce = false;

    function finishSwap() {
      if (finishOnce) return;
      finishOnce = true;
      if (transitionFallbackTimer != null) {
        clearTimeout(transitionFallbackTimer);
        transitionFallbackTimer = null;
      }
      citySwitchInProgress = true;
      window.TripApp.applyCityUI(cityKey);
      try {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      try {
        history.pushState({ tripCity: cityKey }, "", "city.html?city=" + cityKey);
      } catch (e) {
        try {
          history.pushState({}, "", "city.html?city=" + cityKey);
        } catch (e2) {}
      }
      loadCityFeed(cityKey, function () {
        feed.classList.remove("trip-feed--transition-out");
        citySwitchInProgress = false;
        if (window.TripMusic && window.TripMusic.reinitForCity) window.TripMusic.reinitForCity();
      });
    }

    if (reduceMotion) {
      finishSwap();
      return;
    }

    feed.classList.add("trip-feed--transition-out");

    function onEnd(ev) {
      if (ev.target !== feed) return;
      if (ev.propertyName !== "opacity") return;
      feed.removeEventListener("transitionend", onEnd);
      finishSwap();
    }

    feed.addEventListener("transitionend", onEnd);
    transitionFallbackTimer = setTimeout(function () {
      feed.removeEventListener("transitionend", onEnd);
      transitionFallbackTimer = null;
      finishSwap();
    }, TRANSITION_MS + 80);
  };

  window.addEventListener("popstate", function () {
    var k = tripCityKey();
    if (!window.TRIP_CITY_META[k]) return;
    var feed = document.getElementById("trip-feed");
    if (feed && window.TripApp.applyCityUI) {
      window.TripApp.applyCityUI(k);
      loadCityFeed(k, function () {
        if (window.TripMusic && window.TripMusic.reinitForCity) window.TripMusic.reinitForCity();
      });
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.TripApp) return;
    loadCityFeed(tripCityKey(), null);
  });
})();
