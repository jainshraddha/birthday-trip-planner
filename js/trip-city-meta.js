/**
 * Shared config for city.html — feed markup lives in /feed/{amsterdam|paris}.html
 */
window.TRIP_CITY_META = {
  amsterdam: {
    bodyClass: "",
    dataCity: "amsterdam",
    title: "Amsterdam — De Pijp",
    h1: "Amsterdam",
    kicker: "De Pijp",
    feedAriaLabel: "Amsterdam vibes",
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
    feedAriaLabel: "Paris vibes",
    mapAriaLabel: "Map of Le Marais, Paris",
    mapIframeTitle: "Le Marais, Paris on Google Maps",
    mapEmbedSrc:
      "https://www.google.com/maps?q=Le+Marais,+75004+Paris,+France&z=14&hl=en&output=embed",
    mapLinkHref: "https://www.google.com/maps/search/?api=1&query=Le+Marais+Paris+France",
    footerText: "Le Marais",
  },
};
