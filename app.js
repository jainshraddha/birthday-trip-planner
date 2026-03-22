(function () {
  const parallaxEls = document.querySelectorAll(".page-bg__parallax");
  if (parallaxEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;
    function applyParallax() {
      const y = window.scrollY * 0.2;
      const t = `translate3d(0, ${y}px, 0)`;
      parallaxEls.forEach((el) => {
        el.style.transform = t;
      });
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();

window.TripApp = window.TripApp || {};
let feedModalShellReady = false;

window.TripApp.initFeedPins = function () {
  const feedRoot = document.getElementById("trip-feed");
  const backdrop = document.getElementById("feed-backdrop");
  if (!feedRoot || !backdrop) return;
  const pins = feedRoot.querySelectorAll(".feed__pin--interactive");
  if (!pins.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!feedModalShellReady) {
    feedModalShellReady = true;
  const MODAL_EASE = "cubic-bezier(0.25, 0.9, 0.35, 1)";
  const OPEN_MS = 0.26;

  let openArticle = null;
  let openCard = null;
  let openSlot = null;
  let flyFallbackTimer = null;
  let modalGeneration = 0;

  function clearFlyTimer() {
    if (flyFallbackTimer != null) {
      clearTimeout(flyFallbackTimer);
      flyFallbackTimer = null;
    }
  }

  function onBackdropClick(e) {
    if (e.target === backdrop) closeModal();
  }

  function showBackdrop() {
    if (!backdrop) return;
    backdrop.hidden = false;
    backdrop.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => backdrop.classList.add("is-visible"));
    backdrop.addEventListener("click", onBackdropClick);
  }

  function hideBackdrop() {
    if (!backdrop) return;
    backdrop.classList.remove("is-visible");
    backdrop.removeEventListener("click", onBackdropClick);
    const done = () => {
      backdrop.hidden = true;
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.removeEventListener("transitionend", done);
    };
    backdrop.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 280);
  }

  function cleanupModalState() {
    modalGeneration += 1;
    clearFlyTimer();
    document.body.classList.remove("feed-modal-open");
    if (openCard) {
      const media = openCard.querySelector(".feed__pin__media");
      if (media) {
        media.style.maxHeight = "";
        media.style.height = "";
      }
      openCard.classList.remove("is-modal", "is-modal-expanded");
      openCard.removeAttribute("role");
      openCard.removeAttribute("aria-modal");
      openCard.style.cssText = "";
      openCard.setAttribute("aria-expanded", "false");
      const detail = openCard.querySelector(".feed__pin__detail");
      if (detail) detail.hidden = true;
    }
    if (openSlot && openSlot.parentNode) openSlot.remove();
    openArticle = null;
    openCard = null;
    openSlot = null;
    hideBackdrop();
  }

  function closeModal() {
    if (!openCard) return;
    cleanupModalState();
  }

  /** Padded usable viewport rect (visualViewport when available). */
  function modalViewportBounds() {
    const vv = window.visualViewport;
    const iw = vv ? vv.width : window.innerWidth;
    const ih = vv ? vv.height : window.innerHeight;
    const vx = vv ? vv.offsetLeft : 0;
    const vy = vv ? vv.offsetTop : 0;
    const short = Math.min(iw, ih);
    let padFrac = 0.04;
    if (short >= 734 && short <= 1024) {
      padFrac = 0.025;
    }
    const pad = Math.max(8, Math.min(24, Math.round(short * padFrac)));
    const maxW = Math.max(120, iw - pad * 2);
    const maxH = Math.max(160, ih - pad * 2);
    return { vx, vy, pad, maxW, maxH };
  }

  function getPinImageAspectRatio(card) {
    const img = card.querySelector(".feed__pin__media img");
    if (!img) return null;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      return img.naturalWidth / img.naturalHeight;
    }
    const w = parseFloat(img.getAttribute("width"));
    const h = parseFloat(img.getAttribute("height"));
    if (w > 0 && h > 0) return w / h;
    return null;
  }

  /** Pinterest reel embeds use a vertical frame (see styles: 9 / 16). */
  function getPinMediaAspectRatio(card) {
    if (card.querySelector(".feed__pin__media--video")) {
      return 9 / 16;
    }
    return getPinImageAspectRatio(card);
  }

  /**
   * Modal box snug to the photo + caption: same outer aspect as content, not the browser window.
   * Landscape photos get a wide-narrow card; portrait photos get a tall-narrow card.
   */
  function modalSnugImageBox(card) {
    const { vx, vy, pad, maxW, maxH } = modalViewportBounds();
    const imgAR = getPinMediaAspectRatio(card);
    if (imgAR == null) {
      const w = Math.floor(maxW);
      const h = Math.floor(maxH);
      return {
        w,
        h,
        left: Math.round(vx + pad + (maxW - w) / 2),
        top: Math.round(vy + pad + (maxH - h) / 2),
        mediaImgH: null,
      };
    }

    const cardPadX = 20;
    const cardPadY = 20;
    const innerMaxW = Math.max(80, maxW - cardPadX);
    const innerMaxH = Math.max(120, maxH - cardPadY);

    const detail = card.querySelector(".feed__pin__detail");
    let detailH = 200;
    if (detail && detail.offsetHeight > 0) {
      detailH = Math.ceil(detail.offsetHeight);
    }

    const maxImgH = Math.max(60, innerMaxH - detailH);
    const maxImgW = innerMaxW;

    /** At least this wide inside padding so ultra-portrait pins don’t feel pencil-thin. */
    const minInnerW = Math.min(innerMaxW, Math.max(300, Math.round(maxW * 0.4)));

    function containImg(aw, ah) {
      let iw;
      let ih;
      if (aw / ah > imgAR) {
        ih = ah;
        iw = ih * imgAR;
      } else {
        iw = aw;
        ih = iw / imgAR;
      }
      return { imgW: iw, imgH: ih };
    }

    let { imgW, imgH } = containImg(maxImgW, maxImgH);
    const innerW = Math.min(innerMaxW, Math.max(minInnerW, imgW));
    ({ imgW, imgH } = containImg(innerW, maxImgH));

    const w = Math.min(Math.ceil(innerW + cardPadX), maxW);
    const h = Math.min(Math.ceil(imgH + detailH + cardPadY), maxH);
    const left = vx + pad + (maxW - w) / 2;
    const top = vy + pad + (maxH - h) / 2;
    return {
      w,
      h,
      left: Math.round(left),
      top: Math.round(top),
      mediaImgH: imgH,
    };
  }

  function positionModalCentered(card) {
    const box = modalSnugImageBox(card);
    const { w, h, left, top } = box;
    const media = card.querySelector(".feed__pin__media");
    if (media) {
      if (box.mediaImgH != null) {
        const mh = `${Math.ceil(box.mediaImgH)}px`;
        media.style.maxHeight = mh;
        if (media.classList.contains("feed__pin__media--video")) {
          media.style.height = mh;
        } else {
          media.style.height = "";
        }
      } else {
        media.style.maxHeight = "";
        media.style.height = "";
      }
    }
    card.style.width = `${w}px`;
    card.style.height = `${h}px`;
    card.style.maxHeight = `${h}px`;
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function refineModalLayout(card, generation) {
    if (generation !== modalGeneration || openCard !== card) return;
    positionModalCentered(card);
  }

  function openFromCard(card) {
    if (openCard) closeModal();

    const generation = modalGeneration;
    const article = card.closest(".feed__pin");
    const detail = card.querySelector(".feed__pin__detail");
    if (!article || !detail) return;

    const first = card.getBoundingClientRect();

    const slot = document.createElement("div");
    slot.className = "feed__pin-slot";
    slot.style.height = `${Math.round(first.height)}px`;
    slot.setAttribute("aria-hidden", "true");
    article.insertBefore(slot, card);

    openArticle = article;
    openCard = card;
    openSlot = slot;

    document.body.classList.add("feed-modal-open");
    showBackdrop();

    card.setAttribute("aria-expanded", "true");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.classList.add("is-modal", "is-modal-expanded");
    detail.hidden = false;

    card.style.position = "fixed";
    card.style.margin = "0";
    card.style.boxSizing = "border-box";
    card.style.zIndex = "400";
    card.style.transformOrigin = "0 0";
    card.style.transition = "none";
    card.style.visibility = "hidden";

    positionModalCentered(card);
    void card.offsetWidth;
    for (let i = 0; i < 5; i++) {
      if (generation !== modalGeneration || openCard !== card) return;
      const bw = card.offsetWidth;
      const bh = card.offsetHeight;
      refineModalLayout(card, generation);
      void card.offsetWidth;
      if (card.offsetWidth === bw && card.offsetHeight === bh) break;
    }

    const img = card.querySelector(".feed__pin__media img");
    if (img && !img.complete) {
      img.addEventListener("load", () => refineModalLayout(card, generation), { once: true });
    }

    const last = card.getBoundingClientRect();

    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / last.width;
    const sy = first.height / last.height;

    card.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    card.style.visibility = "visible";

    if (reduceMotion) {
      card.style.transform = "none";
      return;
    }

    function settleOpen() {
      if (generation !== modalGeneration || openCard !== card) return;
      card.removeEventListener("transitionend", onEnd);
      clearFlyTimer();
      card.style.transition = "";
      card.style.transform = "none";
    }

    function onEnd(e) {
      if (e.propertyName !== "transform") return;
      settleOpen();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (generation !== modalGeneration || openCard !== card) return;
        card.style.transition = `transform ${OPEN_MS}s ${MODAL_EASE}`;
        card.style.transform = "none";
      });
    });

    card.addEventListener("transitionend", onEnd);
    flyFallbackTimer = window.setTimeout(settleOpen, Math.ceil(OPEN_MS * 1000) + 120);
  }

    function onFeedClick(e) {
      const expandBtn = e.target.closest(".feed__pin__video-expand");
      if (expandBtn) {
        e.preventDefault();
        e.stopPropagation();
        const card = expandBtn.closest(".feed__pin__card");
        if (card && openCard !== card) {
          openFromCard(card);
        }
        return;
      }
      const card = e.target.closest(".feed__pin__card");
      if (!card) return;
      const article = card.closest(".feed__pin--interactive");
      if (!article || article.classList.contains("feed__pin--video")) return;
      if (openCard === card) return;
      e.preventDefault();
      openFromCard(card);
    }

    function onFeedKeydown(e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target;
      if (!t || !t.closest) return;
      const card = t.closest(".feed__pin__card");
      if (!card) return;
      const article = card.closest(".feed__pin--interactive");
      if (!article || article.classList.contains("feed__pin--video")) return;
      if (openCard === card) return;
      e.preventDefault();
      openFromCard(card);
    }

    feedRoot.addEventListener("click", onFeedClick);
    feedRoot.addEventListener("keydown", onFeedKeydown);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && openCard) closeModal();
    });

    function onViewportChange() {
      if (!openCard || !openCard.classList.contains("is-modal-expanded")) return;
      positionModalCentered(openCard);
    }

    window.addEventListener("resize", onViewportChange, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportChange, { passive: true });
    }

    window.TripApp.closeFeedModalIfOpen = function () {
      closeModal();
    };
  }

  pins.forEach((article) => {
    if (!article.classList.contains("feed__pin--video")) return;
    const card = article.querySelector(".feed__pin__card");
    if (!card) return;
    card.setAttribute("aria-expanded", "false");
    card.setAttribute("aria-haspopup", "dialog");
    const wrap = card.querySelector(".feed__pin__media--video");
    if (wrap && !wrap.querySelector(".feed__pin__video-expand")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "feed__pin__video-expand";
      btn.setAttribute("aria-label", "Open reel in a larger view");
      btn.textContent = "Expand";
      wrap.appendChild(btn);
    }
  });
};

if (document.querySelector(".feed__pin--interactive")) {
  window.TripApp.initFeedPins();
}

(function citySlide() {
  const order = ["amsterdam", "paris", "london"];
  const city = document.body.dataset.city;
  if (order.indexOf(city) === -1) return;

  const SWIPE_MIN = 56;
  const SWIPE_VERTICAL_CAP = 110;

  function modalOpen() {
    return document.body.classList.contains("feed-modal-open");
  }

  function currentIdx() {
    return order.indexOf(document.body.dataset.city);
  }

  function goCity(key) {
    if (window.TripApp && typeof window.TripApp.switchCity === "function") {
      window.TripApp.switchCity(key);
      return;
    }
    window.location.href = "city.html?city=" + key;
  }

  function goNext() {
    const idx = currentIdx();
    if (idx === -1) return;
    goCity(order[(idx + 1) % order.length]);
  }

  function goPrev() {
    const idx = currentIdx();
    if (idx === -1) return;
    goCity(order[(idx - 1 + order.length) % order.length]);
  }

  function trySwipe(dx, dy) {
    if (modalOpen()) return;
    if (Math.abs(dx) < SWIPE_MIN) return;
    if (Math.abs(dy) > SWIPE_VERTICAL_CAP && Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) goNext();
    else goPrev();
  }

  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      const el = e.target;
      if (el.closest && el.closest("iframe, a, button, input, textarea, select, label")) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      if (e.changedTouches.length !== 1) return;
      const t = e.changedTouches[0];
      trySwipe(t.clientX - touchStartX, t.clientY - touchStartY);
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    if (modalOpen()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  });
})();

(function cityInternalNavSmooth() {
  if (!document.body.dataset.city) return;
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a) return;
    let url;
    try {
      url = new URL(a.getAttribute("href"), location.href);
    } catch (err) {
      return;
    }
    const page = (url.pathname.split("/").pop() || "").toLowerCase();
    if (page !== "city.html") return;
    const nextCity = url.searchParams.get("city");
    if (!nextCity || !window.TRIP_CITY_META || !window.TRIP_CITY_META[nextCity]) return;
    e.preventDefault();
    if (window.TripApp && typeof window.TripApp.switchCity === "function") {
      window.TripApp.switchCity(nextCity);
    }
  });
})();
