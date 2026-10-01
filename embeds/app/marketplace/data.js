// Classic-search data for Stage 11 (marketplace_web template). Neutral tiles, no listing photos.
(function () {
  const TILE = window.AIMODE_DATA.TILE;
  const L = window.AIMODE_DATA.listings;
  window.EBAY_DATA = {
    categories: ["Saved", "Cameras & Photo", "Electronics", "Motors", "Fashion", "Collectibles", "Sporting Goods", "Home & Garden", "Deals", "Sell"],
    pills: ["All", "Auction", "Buy It Now", "Best Offer", "Returns accepted", "Free shipping", "Local pickup"],
    products: L.map((l, i) => ({ id: i + 1, title: l.title, price: "$" + l.price.toFixed(2), cond: l.cond, ship: l.ship ? "+ $" + l.ship.toFixed(2) + " shipping" : "Free shipping", img: TILE, badge: window.AIMODE_DATA.bySeller(l.seller).trp ? "Top Rated Plus" : undefined, urgency: l.watching > 12 ? l.watching + " watching" : undefined, rating: 4.5, reviews: window.AIMODE_DATA.bySeller(l.seller).feedback, sold: "" })),
  };
})();
