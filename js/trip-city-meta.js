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
    heroLede: "Explore the canals, cafés, and historic character of Amsterdam's De Pijp neighborhood.",
    boardTitle: "The De Pijp Experience",
    boardLede: "Tap any card for details. Explore the board to see sights in Paris or London.",
    splitTitle: "A neighborhood to wander",
    splitText:
      "De Pijp is a vibrant district known for its diverse culinary scene, the Albert Cuyp Market, and traditional Amsterdam architecture.",
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
    heroLede: "Experience the historic boulangeries, classic streetscapes, and cultural landmarks of Le Marais.",
    boardTitle: "Le Marais Highlights",
    boardLede: "Tap any card for details. Explore the board to see sights in Amsterdam or London.",
    splitTitle: "A quarter to explore",
    splitText:
      "Le Marais is Paris's historic Jewish quarter, now a center for fashion, art galleries, and well-preserved medieval architecture.",
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
    heroLede: "Visit the historic markets, West End theatres, and iconic landmarks of Covent Garden.",
    boardTitle: "Covent Garden Sights",
    boardLede: "Tap any card for details. Explore the board to see sights in Amsterdam or Paris.",
    splitTitle: "Theatre, lanes, and tea",
    splitText:
      "Covent Garden is a world-famous shopping and entertainment hub, located in the heart of London’s West End near the River Thames.",
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
