// AI Mode — in-memory mock data. Real, plausible values; no listing photos (neutral tiles).
(function () {
  const TILE = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#F7F7F7"/></svg>');
  const sellers = {
    camera_corner_nyc: { id: "camera_corner_nyc", name: "camera_corner_nyc", feedback: 2310, positive: 99.4, since: "2011", location: "New York, NY", trp: true, returns: "30-day free returns", initials: "CC", color: "#0968F6", ships: "1 business day",
      criteria: [["Accepts returns", true, "30-day free returns"], ["Ships to 10001 by Fri, Sep 19", true, "1-day handling, 2-day ground"], ["Top Rated Plus", true, "99.4% positive, 2,310 ratings"], ["Shutter count stated", true, "18,420 in listing photos"], ["Under $700", true, "$655 Buy It Now"], ["Original box and charger", false, "Charger yes, box not listed"]], match: [5, 6] },
    lensloft_photo: { id: "lensloft_photo", name: "lensloft_photo", feedback: 5842, positive: 99.8, since: "2008", location: "Portland, OR", trp: true, returns: "30-day free returns", initials: "LL", color: "#288034", ships: "same day",
      criteria: [["Accepts returns", true, "30-day free returns"], ["Ships to 10001 by Fri, Sep 19", true, "Same-day handling, 3-day ground"], ["Top Rated Plus", true, "99.8% positive, 5,842 ratings"], ["Shutter count stated", true, "31,050 in description"], ["Under $700", true, "$689 Buy It Now"], ["Original box and charger", false, "Charger yes, no box"]], match: [5, 6] },
    shutterhouse_pa: { id: "shutterhouse_pa", name: "shutterhouse_pa", feedback: 1106, positive: 98.9, since: "2014", location: "Lancaster, PA", trp: false, returns: "30-day returns, buyer pays", initials: "SH", color: "#8F8F8F", ships: "2 business days", criteria: [["Accepts returns", true, "30-day, buyer pays shipping"], ["Ships to 10001 by Fri, Sep 19", true, "2-day handling"], ["Top Rated Plus", false, "98.9% positive"], ["Shutter count stated", true, "44,900"], ["Under $700", false, "$720"]], match: [3, 5] },
    nyc_gear_exchange: { id: "nyc_gear_exchange", name: "nyc_gear_exchange", feedback: 412, positive: 97.8, since: "2019", location: "Brooklyn, NY", trp: false, returns: "14-day returns", initials: "NG", color: "#707070", ships: "1 business day", criteria: [["Accepts returns", true, "14-day"], ["Ships to 10001 by Fri, Sep 19", true, "Local, 1-day"], ["Top Rated Plus", false, "97.8% positive"], ["Shutter count stated", true, "62,300 (above your limit)"], ["Under $700", true, "$598"]], match: [3, 5] },
    pixel_pawn_ohio: { id: "pixel_pawn_ohio", name: "pixel_pawn_ohio", feedback: 873, positive: 98.2, since: "2016", location: "Dayton, OH", trp: false, returns: "No returns", initials: "PP", color: "#707070", ships: "3 business days", criteria: [["Accepts returns", false, "No returns accepted"], ["Ships to 10001 by Fri, Sep 19", false, "3-day handling, arrives Mon, Sep 22"], ["Top Rated Plus", false, "98.2% positive"], ["Shutter count stated", true, "48,700"], ["Under $700", true, "$615"]], match: [2, 5] },
    midwest_camera_co: { id: "midwest_camera_co", name: "midwest_camera_co", feedback: 2004, positive: 99.1, since: "2012", location: "Madison, WI", trp: true, returns: "30-day free returns", initials: "MC", color: "#288034", ships: "1 business day", criteria: [["Accepts returns", true, "30-day free returns"], ["Ships to 10001 by Fri, Sep 19", true, "1-day handling"], ["Top Rated Plus", true, "99.1% positive"], ["Shutter count stated", false, "Not stated, asked seller"], ["Under $700", true, "$609"]], match: [4, 5] },
  };
  const listings = [
    { id: "l1", itemNo: "295512038114", title: "Nikon D750 24.3MP DSLR Camera Body Only, 18,420 shutter count, charger included", price: 655, cond: "Pre-owned", shutter: 18420, seller: "camera_corner_nyc", ship: 0, delivery: "Fri, Sep 19", band: "typical", watching: 14, pick: true },
    { id: "l2", itemNo: "295498771020", title: "Nikon D750 body, excellent condition, 31,050 clicks, 2 batteries", price: 689, cond: "Pre-owned", shutter: 31050, seller: "lensloft_photo", ship: 0, delivery: "Fri, Sep 19", band: "typical", watching: 9 },
    { id: "l3", itemNo: "295470112877", title: "Nikon D750 DSLR body, 44,900 actuations, MB-D16 grip included", price: 720, cond: "Pre-owned", shutter: 44900, seller: "shutterhouse_pa", ship: 14.9, delivery: "Thu, Sep 18", band: "typical", watching: 6 },
    { id: "l4", itemNo: "295501990233", title: "Nikon D750 body, works great, cosmetic wear, 62,300 shutter", price: 598, cond: "Pre-owned", shutter: 62300, seller: "nyc_gear_exchange", ship: 12, delivery: "Wed, Sep 17", band: "budget", watching: 21 },
    { id: "l5", itemNo: "295488120455", title: "Nikon D750 camera body only, 48,700 shutter, no charger", price: 615, cond: "Pre-owned", shutter: 48700, seller: "pixel_pawn_ohio", ship: 0, delivery: "Mon, Sep 22", band: "budget", watching: 4 },
    { id: "l6", itemNo: "295509334812", title: "Nikon D750 body with strap and charger, shutter count not stated", price: 609, cond: "Pre-owned", shutter: null, seller: "midwest_camera_co", ship: 0, delivery: "Fri, Sep 19", band: "budget", watching: 11 },
    { id: "l7", itemNo: "295515667301", title: "Nikon D750 body, 4,120 shutter count, MB-D16 grip, original box", price: 779, cond: "Pre-owned", shutter: 4120, seller: "camera_corner_nyc", ship: 0, delivery: "Fri, Sep 19", band: "premium", watching: 27 },
    { id: "l8", itemNo: "295492208819", title: "Nikon D750 body, 12,800 shutter, 2 batteries, boxed with warranty card", price: 745, cond: "Pre-owned", shutter: 12800, seller: "lensloft_photo", ship: 0, delivery: "Fri, Sep 19", band: "premium", watching: 8 },
    { id: "l9", itemNo: "295476551190", title: "Nikon D750 body, low shutter 7,900, mint, hot shoe cover", price: 799, cond: "Pre-owned", shutter: 7900, seller: "shutterhouse_pa", ship: 14.9, delivery: "Thu, Sep 18", band: "premium", watching: 3 },
  ];
  const bands = [
    { key: "budget", label: "Budget", range: "$590–$630", count: 61, note: "Higher shutter counts or missing accessories", spark: [612, 598, 605, 620, 601, 609, 596, 614, 603, 618, 599, 607] },
    { key: "typical", label: "Typical", range: "$640–$720", count: 112, note: "Under 50k shutter, returns accepted", spark: [688, 672, 695, 660, 681, 702, 668, 655, 690, 676, 684, 671] },
    { key: "premium", label: "Premium", range: "$740–$800", count: 41, note: "Under 15k shutter, boxed", spark: [760, 785, 772, 795, 751, 768, 790, 779, 762, 788, 774, 781] },
  ];
  const soldTitles = ["Nikon D750 DSLR body only, 22k shutter", "Nikon D750 body, 38,400 actuations", "Nikon D750 24.3MP body, boxed, 15k clicks", "Nikon D750 body, 41k shutter, strap", "Nikon D750 body only, 9,800 shutter", "Nikon D750 camera body, 55k shutter", "Nikon D750 body, 27,600 shutter, 2 batteries", "Nikon D750 body, 33k shutter, charger", "Nikon D750 DSLR body, 47k actuations", "Nikon D750 body, 19,200 shutter"];
  const soldPrices = [668, 640, 705, 632, 742, 604, 676, 661, 628, 690];
  const soldDates = ["Sep 2", "Sep 1", "Aug 30", "Aug 29", "Aug 27", "Aug 26", "Aug 24", "Aug 22", "Aug 20", "Aug 19", "Aug 17", "Aug 15", "Aug 14", "Aug 12", "Aug 10", "Aug 8", "Aug 6", "Aug 4", "Aug 2", "Jul 31", "Jul 29", "Jul 27", "Jul 25", "Jul 23", "Jul 21", "Jul 19", "Jul 17", "Jul 15", "Jul 12"];
  const soldSellers = ["photo_depot_tx", "gearloop", "nyc_camera_exchange", "lensloft_photo", "camera_corner_nyc", "used_glass_co", "shutterhouse_pa", "midwest_camera_co"];
  const sources = listings.map((l) => ({ id: "s-" + l.id, title: l.title, price: l.price, status: "active", seller: l.seller })).concat(soldDates.map((d, i) => ({ id: "s-sold-" + i, title: soldTitles[i % soldTitles.length], price: soldPrices[i % soldPrices.length] + ((i * 7) % 23) - 11, status: "sold " + d, seller: soldSellers[i % soldSellers.length] })));
  const memory = [
    { id: "m1", label: "Ships to 10001", detail: "You said, Sep 3", icon: "Location16" },
    { id: "m2", label: "Budget ≤ $700", detail: "You said, Sep 12", icon: "Dollar16" },
    { id: "m3", label: "Prefers sellers with free returns", detail: "Learned from 3 tasks, Aug 28", icon: "Return16" },
  ];
  const history = [
    { id: "h1", title: "Price check · Nikon D750", status: "needsApproval", label: "Plan ready", time: "Just now" },
    { id: "h2", title: "Parts · 2016 Civic brake pads", status: "done", label: "Done", time: "2 days ago" },
    { id: "h3", title: "Gift · fly-fishing dad", status: "working", label: "Watching", time: "5 days ago" },
    { id: "h4", title: "Compare · Sony a7 III vs a7C", status: "done", label: "Done", time: "1 week ago" },
  ];
  const plan = {
    title: "Find the best deal on a Nikon D750 body",
    eta: "Ready in about a minute",
    phases: [
      { id: "p1", label: "Understand what you need", steps: ["Read your request: body only, under $700, low shutter count", "Apply what I remember: ships to 10001, budget ≤ $700", "Set the delivery cutoff to Fri, Sep 19", "Treat “low shutter count” as under 50,000"] },
      { id: "p2", label: "Check what D750 bodies actually sell for", steps: ["Pull 214 sold listings from the last 90 days", "Group them into Budget, Typical and Premium bands", "Drop kits, for-parts units and outliers"] },
      { id: "p3", label: "Find and vet active listings", steps: ["Search active listings for Nikon D750 bodies", "Verify shutter counts in descriptions and photos", "Check each seller’s return policy and feedback", "Estimate delivery to 10001"] },
      { id: "p4", label: "Draft Best Offers to the top 2 sellers", locked: true, steps: ["Draft an offer near the typical sold price", "Write a short note to each seller", "Wait for your click before anything is sent"] },
    ],
  };
  const trace = [
    { phase: "Understood your request", status: "done", thought: "Body only, under $700, shutter under 50k, returns accepted, ship to 10001 by Fri, Sep 19. Skipping refurbished units as you asked.", sources: 0, queries: [] },
    { phase: "Checked 214 sold listings", status: "done", thought: "Most bodies under 50k shutter sold for $640–$720 in the last 90 days.", sources: 29, queries: ["nikon d750 body sold", "nikon d750 body used"] },
    { phase: "Comparing 9 active listings", status: "active", thought: "Reading shutter counts from photos and descriptions, then checking return policies.", sources: 9, queries: ["nikon d750 body used", "nikon d750 shutter count under 50k", "nikon d750 body only returns accepted"] },
    { phase: "Draft Best Offers to the top 2 sellers", status: "pending", thought: "Nothing is sent until you click Send offer.", sources: 0, queries: [], locked: true },
  ];
  const starters = [
    { label: "Find me a used [item] under [$max] shipped by [date]", slots: ["item", "$max", "date"] },
    { label: "Is [$price] a fair price for a used [item]?", slots: ["$price", "item"] },
    { label: "Alert me when a [item] drops under [$max]", slots: ["item", "$max"] },
    { label: "Compare the 3 best [item] listings under [$max]", slots: ["item", "$max"] },
  ];
  const QUERY = "Find me a used Nikon D750 body under $700 with low shutter count, from a seller who accepts returns, shipped to 10001 by next Friday.";
  const bySeller = (id) => sellers[id];
  window.AIMODE_DATA = { TILE, sellers, listings, bands, sources, memory, history, plan, trace, starters, QUERY, bySeller, fmt: (n) => "$" + Number(n).toLocaleString() };
})();
