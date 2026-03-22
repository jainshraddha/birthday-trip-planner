/**
 * Shared config for city.html — feed markup lives in /feed/{amsterdam|paris|london}.html
 */
window.TRIP_CITY_META = {
  amsterdam: {
    bodyClass: "page-amsterdam",
    dataCity: "amsterdam",
    title: "Amsterdam — De Pijp",
    h1: "Amsterdam",
    kicker: "De Pijp",
    heroEyebrow: "Your birthday trip",
    heroLede: "Canals, cafés, and corners we saved for you—no homework, just vibes.",
    boardTitle: "Ideas we loved",
    boardLede: "Tap any card to open it. Swipe the edges or use the dots above to peek at Paris or London.",
    splitTitle: "A neighborhood to wander",
    splitText:
      "De Pijp is walkable and full of small pleasures—markets, terraces, and museums within an easy stroll.",
    splitImage: "assets/amsterdam-stroopwafels-van-wonderen.png",
    splitImageAlt: "Fresh stroopwafels at an Amsterdam market stall",
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
    heroEyebrow: "Your birthday trip",
    heroLede: "Boulangeries, bouquinistes, and golden-hour streets—picked to feel easy and special.",
    boardTitle: "Ideas we loved",
    boardLede: "Tap any card to open it. Swipe the edges or use the dots above to peek at Amsterdam or London.",
    splitTitle: "A quarter to lose yourself in",
    splitText:
      "Le Marais folds history, small shops, and long café afternoons into a few walkable blocks.",
    splitImage: "assets/paris-bouquiniste-notre-dame.png",
    splitImageAlt: "Paris bouquiniste stalls along the river",
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
    heroEyebrow: "Your birthday trip",
    heroLede: "Markets, museums, and classic London moments—curated so you can enjoy, not plan.",
    boardTitle: "Ideas we loved",
    boardLede: "Tap any card to open it. Swipe the edges or use the dots above to peek at Amsterdam or Paris.",
    splitTitle: "Theatre, lanes, and tea",
    splitText:
      "Covent Garden puts you near the river, the West End, and endless corners worth wandering.",
    splitImage: "assets/london-leadenhall-market.png",
    splitImageAlt: "Leadenhall Market covered arcade in London",
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
