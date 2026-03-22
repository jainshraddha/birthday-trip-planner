/**
 * Shared config for city.html — feed markup lives in /feed/{amsterdam|paris|london}.html
 */
window.TRIP_CITY_META = {
  amsterdam: {
    bodyClass: "",
    dataCity: "amsterdam",
    title: "Amsterdam — De Pijp",
    h1: "Amsterdam",
    kicker: "De Pijp",
    feedAriaLabel: "Ideas for Amsterdam",
    mapAriaLabel: "Map of De Pijp, Amsterdam",
    mapIframeTitle: "De Pijp, Amsterdam on Google Maps",
    mapEmbedSrc:
      "https://www.google.com/maps?q=De+Pijp,+Amsterdam,+Netherlands&z=14&hl=en&output=embed",
    mapLinkHref:
      "https://www.google.com/maps/search/?api=1&query=De+Pijp+Amsterdam+Netherlands",
    footerText: "De Pijp",
  },
  paris: {
    bodyClass: "page-paris",
    dataCity: "paris",
    title: "Paris — Le Marais",
    h1: "Paris",
    kicker: "Le Marais",
    feedAriaLabel: "Ideas for Paris",
    mapAriaLabel: "Map of Le Marais, Paris",
    mapIframeTitle: "Le Marais, Paris on Google Maps",
    /* Same pattern as Amsterdam (De Pijp): named neighborhood in q= so the embed pins the quarter, not generic city centre. */
    mapEmbedSrc:
      "https://www.google.com/maps?q=Le+Marais,+Paris,+France&z=15&hl=en&output=embed",
    mapLinkHref:
      "https://www.google.com/maps/search/?api=1&query=Le+Marais+Paris+France",
    footerText: "Le Marais",
  },
  london: {
    bodyClass: "page-london",
    dataCity: "london",
    title: "London — Covent Garden",
    h1: "London",
    kicker: "Covent Garden",
    feedAriaLabel: "Ideas for London",
    mapAriaLabel: "Map of Covent Garden, London",
    mapIframeTitle: "Covent Garden, London on Google Maps",
    mapEmbedSrc:
      "https://www.google.com/maps?q=Covent+Garden,+London,+United+Kingdom&z=15&hl=en&output=embed",
    mapLinkHref:
      "https://www.google.com/maps/search/?api=1&query=Covent+Garden+London+United+Kingdom",
    footerText: "Covent Garden",
  },
};
