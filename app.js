(function () {
  const parallax = document.querySelector(".page-bg__parallax");
  if (parallax && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;
    function applyParallax() {
      const y = window.scrollY * 0.2;
      parallax.style.transform = `translate3d(0, ${y}px, 0)`;
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

  const backdrop = document.getElementById("feed-backdrop");
  const pins = document.querySelectorAll(".feed__pin--interactive");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  /**
   * Largest axis-aligned rectangle with the same aspect ratio as the (visual) viewport
   * that fits inside padded safe bounds — maximizes modal size on screen.
   */
  function modalViewportBox() {
    const vv = window.visualViewport;
    const iw = vv ? vv.width : window.innerWidth;
    const ih = vv ? vv.height : window.innerHeight;
    const vx = vv ? vv.offsetLeft : 0;
    const vy = vv ? vv.offsetTop : 0;
    const pad = Math.max(10, Math.min(24, Math.round(Math.min(iw, ih) * 0.04)));
    const maxW = Math.max(120, iw - pad * 2);
    const maxH = Math.max(160, ih - pad * 2);
    const ar = iw / Math.max(1, ih);
    let w;
    let h;
    if (maxW / maxH > ar) {
      h = maxH;
      w = h * ar;
    } else {
      w = maxW;
      h = w / ar;
    }
    w = Math.floor(w);
    h = Math.floor(h);
    const left = vx + pad + (maxW - w) / 2;
    const top = vy + pad + (maxH - h) / 2;
    return { w, h, left: Math.round(left), top: Math.round(top) };
  }

  function positionModalCentered(card) {
    const { w, h, left, top } = modalViewportBox();
    card.style.width = `${w}px`;
    card.style.height = `${h}px`;
    card.style.maxHeight = `${h}px`;
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
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

  pins.forEach((article) => {
    const card = article.querySelector(".feed__pin__card");
    if (!card) return;

    card.addEventListener("click", (e) => {
      if (openCard === card) return;
      e.preventDefault();
      openFromCard(card);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (openCard === card) return;
        e.preventDefault();
        openFromCard(card);
      }
    });
  });

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
})();
