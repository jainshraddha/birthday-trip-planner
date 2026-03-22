/**
 * Shared config for city.html — feed markup lives in /feed/{amsterdam|paris|london}.html
 *
 * Maps: create one Google My Map per city (with your pins), then:
 * 1. Share → “Embed a map” → copy the iframe’s src URL → mapMyMapsEmbedSrc
 * 2. Share → “Send a link” (or open the map in Google Maps) → mapLinkHref for “Open this map in Google Maps”
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
    mapAriaLabel: "Map of ideas around De Pijp, Amsterdam",
    mapIframeTitle: "Ideas map — Amsterdam",
    mapMyMapsEmbedSrc:
      "https://www.google.com/maps/d/embed?mid=11qOQntT-Z-7lhU0myLArMsdFKVYE3cc",
    mapLinkHref: "https://www.google.com/maps/d/viewer?mid=11qOQntT-Z-7lhU0myLArMsdFKVYE3cc",
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
    mapAriaLabel: "Map of ideas around Le Marais, Paris",
    mapIframeTitle: "Ideas map — Paris",
    mapMyMapsEmbedSrc:
      "https://www.google.com/maps/d/embed?mid=1HA2-F5cgwR1Ov5nepN1gi4I6t0ABAiA",
    mapLinkHref: "https://www.google.com/maps/d/viewer?mid=1HA2-F5cgwR1Ov5nepN1gi4I6t0ABAiA",
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
    mapAriaLabel: "Map of ideas around Covent Garden, London",
    mapIframeTitle: "Ideas map — London",
    mapMyMapsEmbedSrc:
      "https://www.google.com/maps?q=Covent+Garden,+London,+United+Kingdom&z=15&hl=en&output=embed",
    mapLinkHref: "https://www.google.com/maps/search/?api=1&query=Covent+Garden+London+United+Kingdom",
    footerText: "Covent Garden",
  },
};
