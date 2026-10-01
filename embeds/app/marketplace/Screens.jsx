(function(){
// eBay marketplace web — screens (Home, Search results, Product, Cart).
const DSx = window.EBayEvoDesignSystem_61746e;
const { ItemTile, Button, Chip, Badge, Icon, Rating, Breadcrumb, Card, Divider, Tabs, Pagination, SegmentedButton } = DSx;

function Hero({ onShop }) {
  return (
    <div style={{ background: "linear-gradient(180deg, #f5f9ff, #fff)", borderRadius: 16, padding: 40, display: "flex", alignItems: "center", gap: 32, overflow: "hidden", border: "1px solid var(--border-primary)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "inline-flex" }}><Badge tone="expressive">Limited time</Badge></div>
        <h1 style={{ font: "700 44px/1.05 var(--font-brand)", letterSpacing: "-0.02em", margin: "12px 0 8px", color: "var(--foreground-primary)" }}>Up to 60% off refurbished tech</h1>
        <p style={{ font: "400 16px/1.5 var(--font-brand)", color: "var(--foreground-secondary)", maxWidth: 460, margin: "0 0 20px" }}>Certified Refurbished products from top brands, backed by a 2-year Allstate warranty and the eBay Money Back Guarantee.</p>
        <Button size="large" onClick={onShop}>Shop the deals</Button>
      </div>
      <img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=640&q=80" alt="" style={{ width: 360, height: 240, objectFit: "cover", borderRadius: 12 }} />
    </div>
  );
}

function ProductGrid({ products, onOpen, columns = 4 }) {
  const [watched, setWatched] = React.useState({});
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 20 }}>
      {products.map((p) => (
        <ItemTile key={p.id} image={p.img} title={p.title} price={p.price} originalPrice={p.was}
          condition={p.cond} shipping={p.ship} urgency={p.urgency}
          badge={p.badge ? <Badge tone="success">{p.badge}</Badge> : null}
          watched={watched[p.id] ?? p.watch} onWatch={() => setWatched((w) => ({ ...w, [p.id]: !(w[p.id] ?? p.watch) }))}
          onClick={() => onOpen(p)} />
      ))}
    </div>
  );
}

function HomeScreen({ onOpen, onShop }) {
  const data = window.EBAY_DATA;
  const rails = [
    { title: "Based on your recent views", items: data.products.slice(0, 4) },
    { title: "Today's deals", items: data.products.slice(4, 8) },
  ];
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: 16 }}>
      <Hero onShop={onShop} />
      <div style={{ display: "flex", gap: 10, margin: "24px 0 8px", flexWrap: "wrap" }}>
        {["Sneakers", "Trading cards", "Camera gear", "Power tools", "Home office", "Watches", "Vinyl records"].map((c, i) => (
          <Chip key={c} selected={i === 0}>{c}</Chip>
        ))}
      </div>
      {rails.map((rail) => (
        <section key={rail.title} style={{ marginTop: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ font: "700 22px/1.2 var(--font-brand)", margin: 0 }}>{rail.title}</h2>
            <Button level="tertiary" size="small" trailingIcon={<Icon name="ChevronRight16" size={14} />}>See all</Button>
          </div>
          <ProductGrid products={rail.items} onOpen={onOpen} />
        </section>
      ))}
    </main>
  );
}

function FilterRail() {
  const groups = [
    { h: "Condition", items: ["Brand New (1,204)", "Open box (88)", "Pre-owned (560)", "For parts (23)"] },
    { h: "Buying Format", items: ["All Listings", "Auction", "Buy It Now", "Best Offer"] },
    { h: "Shipping", items: ["Free shipping", "Free returns", "Local pickup"] },
  ];
  return (
    <aside style={{ width: 220, flexShrink: 0 }}>
      {groups.map((g) => (
        <div key={g.h} style={{ marginBottom: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{g.h}</div>
          {g.items.map((it) => (
            <label key={it} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--foreground-primary)", padding: "5px 0", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "var(--blue-500)", width: 16, height: 16 }} /> {it}
            </label>
          ))}
        </div>
      ))}
    </aside>
  );
}

function SearchScreen({ query, onOpen }) {
  const data = window.EBAY_DATA;
  const all = [...data.products, ...data.products.map((p) => ({ ...p, id: p.id + 100 }))];
  const [view, setView] = React.useState("grid");
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: 16 }}>
      <Breadcrumb items={[{ label: "Home", href: "#" }, { label: "Search results" }, { label: query || "all items" }]} />
      <div style={{ display: "flex", gap: 28, marginTop: 16 }}>
        <FilterRail />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: "var(--foreground-secondary)" }}><strong style={{ color: "var(--foreground-primary)" }}>2,438 results</strong> for "{query || "everything"}"</div>
            <SegmentedButton value={view} onChange={setView} size="small" items={[{ value: "grid", label: "Grid" }, { value: "list", label: "List" }]} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {data.pills.map((p, i) => <Chip key={p} selected={i === 0} dropdown={i > 2}>{p}</Chip>)}
          </div>
          <ProductGrid products={all} onOpen={onOpen} columns={view === "grid" ? 3 : 1} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
            <Pagination page={1} total={42} onChange={() => {}} />
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductScreen({ product, onAddToCart, onBuy }) {
  const p = product || window.EBAY_DATA.products[0];
  const [tab, setTab] = React.useState("about");
  const thumbs = [p.img, "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200&q=80", "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&q=80"];
  const [main, setMain] = React.useState(0);
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: 16 }}>
      <Breadcrumb items={[{ label: "Home", href: "#" }, { label: "Sneakers", href: "#" }, { label: p.title.slice(0, 28) + "…" }]} />
      <div style={{ display: "flex", gap: 32, marginTop: 16, alignItems: "flex-start" }}>
        {/* Gallery */}
        <div style={{ display: "flex", gap: 12, width: 480, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {thumbs.map((t, i) => (
              <button key={i} onClick={() => setMain(i)} style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", border: i === main ? "2px solid var(--neutral-800)" : "1px solid var(--border-primary)", padding: 0, cursor: "pointer", background: "none" }}>
                <img src={t} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-primary)" }}>
            <img src={thumbs[main]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        {/* Buy box */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {p.badge && <div style={{ display: "inline-flex", marginBottom: 10 }}><Badge tone="success" leadingIcon={<Icon name="AuthenticityGuarantee16" size={14} />}>{p.badge}</Badge></div>}
          <h1 style={{ font: "700 24px/1.3 var(--font-brand)", margin: "0 0 8px" }}>{p.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Rating value={p.rating || 4.5} count={p.reviews} />
            <span style={{ color: "var(--border-primary)" }}>·</span>
            <a href="#" style={{ fontSize: 13, color: "var(--blue-500)", textDecoration: "none" }}>{p.sold || "120 sold"}</a>
          </div>
          <Card padding={20} style={{ borderColor: "var(--border-primary)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ font: "700 32px/1 var(--font-brand)" }}>{p.price}</span>
              {p.was && <span style={{ fontSize: 14, color: "var(--foreground-secondary)", textDecoration: "line-through" }}>{p.was}</span>}
            </div>
            <div style={{ fontSize: 13, color: "var(--foreground-secondary)", margin: "6px 0 4px" }}>Condition: <strong style={{ color: "var(--foreground-primary)" }}>{p.cond}</strong></div>
            {p.urgency && <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red-600)", marginBottom: 8 }}>{p.urgency}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              <Button size="large" fullWidth onClick={onBuy}>Buy It Now</Button>
              <Button size="large" level="secondary" fullWidth onClick={onAddToCart}>Add to cart</Button>
              <Button size="large" level="tertiary" fullWidth leadingIcon={<Icon name="Heart24" size={18} />}>Add to watchlist</Button>
            </div>
          </Card>
          <div style={{ display: "flex", gap: 12, marginTop: 16, fontSize: 13, color: "var(--foreground-secondary)" }}>
            <Icon name="TruckShipped16" size={18} />
            <div><strong style={{ color: "var(--foreground-primary)" }}>{p.ship}</strong> · Est. delivery Mon, Jun 24 – Thu, Jun 27</div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 13, color: "var(--foreground-secondary)" }}>
            <Icon name="ConfirmationFilled16" size={18} />
            <div>Free returns within 30 days · eBay Money Back Guarantee</div>
          </div>
        </div>
      </div>
      {/* Details tabs */}
      <div style={{ marginTop: 32, maxWidth: 760 }}>
        <Tabs value={tab} onChange={setTab} items={[{ value: "about", label: "About this item" }, { value: "ship", label: "Shipping & payments" }, { value: "reviews", label: `Reviews (${p.reviews || 0})` }]} />
        <div style={{ padding: "20px 4px", fontSize: 14, lineHeight: "22px", color: "var(--foreground-primary)" }}>
          {tab === "about" && <p style={{ margin: 0 }}>Authentic, verified by eBay's Authenticity Guarantee team before it ships to you. Comes in original packaging with all accessories. Sold by a Top Rated Seller with a 99.2% positive feedback rating across 12,400+ transactions.</p>}
          {tab === "ship" && <p style={{ margin: 0 }}>{p.ship} via USPS Ground Advantage. Ships from California, United States. Returns accepted within 30 days, buyer pays return shipping unless item not as described. PayPal, Google Pay, Apple Pay, and all major cards accepted.</p>}
          {tab === "reviews" && <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ font: "700 40px/1 var(--font-brand)" }}>{p.rating || 4.5}</span><Rating value={p.rating || 4.5} count={p.reviews} /></div>}
        </div>
      </div>
    </main>
  );
}

function CartScreen({ items, onRemove, onCheckout, onContinue }) {
  const list = items.length ? items : [];
  const subtotal = list.reduce((s, p) => s + parseFloat(String(p.price).replace(/[$,]/g, "")), 0);
  if (!list.length) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 16px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", color: "var(--neutral-300)", marginBottom: 16 }}><Icon name="Cart24" size={64} /></div>
        <h1 style={{ font: "700 24px/1.2 var(--font-brand)", margin: "0 0 8px" }}>Your cart is empty</h1>
        <p style={{ color: "var(--foreground-secondary)", marginBottom: 24 }}>Browse deals and add items to get started.</p>
        <Button size="large" onClick={onContinue}>Continue shopping</Button>
      </main>
    );
  }
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16, display: "flex", gap: 28, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ font: "700 24px/1.2 var(--font-brand)", margin: "0 0 16px" }}>Shopping cart ({list.length})</h1>
        {list.map((p, i) => (
          <div key={i}>
            <div style={{ display: "flex", gap: 16, padding: "16px 0" }}>
              <img src={p.img} alt="" style={{ width: 110, height: 110, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, color: "var(--foreground-primary)", marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: "var(--foreground-secondary)" }}>{p.cond} · {p.ship}</div>
                {p.badge && <div style={{ display: "inline-flex", marginTop: 8 }}><Badge tone="success">{p.badge}</Badge></div>}
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  <button onClick={() => onRemove(i)} style={{ border: "none", background: "none", color: "var(--blue-500)", fontSize: 13, cursor: "pointer", padding: 0, fontFamily: "var(--font-brand)" }}>Remove</button>
                  <button style={{ border: "none", background: "none", color: "var(--blue-500)", fontSize: 13, cursor: "pointer", padding: 0, fontFamily: "var(--font-brand)" }}>Save for later</button>
                </div>
              </div>
              <div style={{ font: "700 18px/1 var(--font-brand)" }}>{p.price}</div>
            </div>
            <Divider />
          </div>
        ))}
      </div>
      <Card padding={20} style={{ width: 320, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 10 }}><span>Subtotal ({list.length} items)</span><strong>${subtotal.toFixed(2)}</strong></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 10, color: "var(--foreground-secondary)" }}><span>Shipping</span><span>Free</span></div>
        <Divider style={{ margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, marginBottom: 16 }}><span>Order total</span><span>${subtotal.toFixed(2)}</span></div>
        <Button size="large" fullWidth onClick={onCheckout}>Go to checkout</Button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 12, color: "var(--foreground-secondary)" }}>
          <Icon name="ConfirmationFilled16" size={16} /> eBay Money Back Guarantee
        </div>
      </Card>
    </main>
  );
}

Object.assign(window, { HomeScreen, SearchScreen, ProductScreen, CartScreen });

})();
