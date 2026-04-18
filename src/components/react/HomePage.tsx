import { useState, useRef, useMemo } from 'react';
import type { Product } from '@/schemas/product.schema';
import type { Meal } from '@/schemas/meal.schema';

interface HomePageProps {
  products: Product[];
  meals: Meal[];
}

const POPULAR_IDS = new Set(['ribblets', 'chicken-wings', 'prawn-tempura']);

const fmtZAR = (n: number) => `R${n % 1 === 0 ? Math.round(n) : n.toFixed(2)}`;

// ---- Icons ----
const WhatsappIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.5 14.3c-.3-.15-1.7-.84-2-.94-.27-.1-.47-.15-.66.15-.2.3-.76.94-.93 1.13-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.06 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.22 1.35.19 1.86.12.57-.08 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.95.56 3.77 1.53 5.31L2 22l4.79-1.49A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);
const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
);
const MinusIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
);
const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);
const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);
const PinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const StarIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
);
const SparkleIcon = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></svg>
);

// ---- Food placeholder SVG ----
function FoodPlaceholder({ id }: { id: string }) {
  const seed = useMemo(() => {
    let h = 0;
    for (const c of id) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
    return h;
  }, [id]);
  const hues = [28, 42, 18, 55, 35, 22, 48, 12];
  const hue = hues[seed % hues.length];
  const accent = `oklch(0.72 0.14 ${hue})`;
  const dark = `oklch(0.42 0.09 ${hue})`;
  const paper = `oklch(0.95 0.02 ${hue + 10})`;
  const rings = 3 + (seed % 3);
  const dots = 5 + (seed % 6);
  return (
    <svg viewBox="0 0 200 160" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`grain-${id}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill={paper} />
          <circle cx="1" cy="1" r="0.3" fill={dark} opacity="0.12" />
        </pattern>
        <radialGradient id={`plate-${id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={`oklch(0.78 0.12 ${hue})`} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      <rect width="200" height="160" fill={`url(#grain-${id})`} />
      <circle cx="100" cy="85" r="62" fill="white" stroke={dark} strokeOpacity="0.15" />
      <circle cx="100" cy="85" r="54" fill={`url(#plate-${id})`} opacity="0.92" />
      {Array.from({ length: rings }).map((_, i) => (
        <circle key={i} cx="100" cy="85" r={18 + i * 9} fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
      ))}
      {Array.from({ length: dots }).map((_, i) => {
        const a = (i / dots) * Math.PI * 2 + (seed % 7);
        const r = 22 + ((seed >> i) % 12);
        const cx = 100 + Math.cos(a) * r;
        const cy = 85 + Math.sin(a) * r;
        const rad = 5 + ((seed >> (i + 2)) % 6);
        return <circle key={i} cx={cx} cy={cy} r={rad} fill={accent} stroke={dark} strokeOpacity="0.2" />;
      })}
      <circle cx="100" cy="85" r="8" fill={accent} stroke={dark} strokeOpacity="0.25" />
    </svg>
  );
}

// ---- Ticker ----
const TICKER_ITEMS = ['Slow-cooked ribblets', 'Cape Malay bobotie', 'Cheesy wors bites', 'Prawn tempura', 'Flaky sausage rolls', 'Chicken wings', 'Fresh every day'];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} className="ticker-item">
            <SparkleIcon size={10} /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---- Hero ----
function Hero({ selectedCount, total, onScrollToPick }: {
  selectedCount: number;
  total: number;
  onScrollToPick: () => void;
}) {
  const complete = selectedCount === 6;
  return (
    <section className="hero-editorial" aria-label="Manna Kitchen - build your perfect platter">
      <div className="hero-grid">
        <div className="hero-meta">
          <span className="hero-eyebrow">
            <PinIcon size={12} /> Theresapark, Pretoria North
          </span>
          <span className="hero-eyebrow alt">
            <StarIcon size={12} /> Made-to-order, Fresh daily
          </span>
        </div>

        <h1 className="hero-title">
          Six treats.<br />
          <span className="ital">Zero filler.</span><br />
          One perfect platter.
        </h1>

        <p className="hero-lede">
          Traditional platters come with items nobody wants. Not ours. You pick
          every single thing that goes on your platter -- <em>lovingly made</em> by
          two sisters in a home kitchen in Pretoria North.
        </p>

        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={onScrollToPick}>
            Start building <ArrowIcon size={14} />
          </button>
          <a className="btn btn-ghost" href="#weekly-meals">
            See this week's meals
          </a>
        </div>

        <div className="hero-stats">
          <div><strong>6</strong><span>items per platter</span></div>
          <div><strong>R27+</strong><span>per item</span></div>
          <div><strong>24h</strong><span>order ahead</span></div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-plate">
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const r = 34;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              const filled = i < selectedCount;
              return (
                <div
                  key={i}
                  className={`hero-slot ${filled ? 'filled' : ''}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {filled ? <CheckIcon size={12} /> : <span>{i + 1}</span>}
                </div>
              );
            })}
            <div className="hero-plate-center">
              <div className="hpc-num">{selectedCount}<span>/6</span></div>
              <div className="hpc-label">{complete ? 'Ready to order' : 'Your platter'}</div>
              <div className="hpc-total">{fmtZAR(total)}</div>
            </div>
          </div>
          <div className="hero-plate-shadow" />
        </div>
      </div>
      <Ticker />
    </section>
  );
}

// ---- Pick Section ----
const FILTERS = [
  { id: 'all', label: 'All treats' },
  { id: 'popular', label: 'Popular' },
  { id: 'dairy-free', label: 'Dairy-free' },
  { id: 'vegetarian', label: 'Vegetarian' },
];

function PickSection({ products, selectedIds, platterFull, onToggle, sectionRef }: {
  products: Product[];
  selectedIds: string[];
  platterFull: boolean;
  onToggle: (p: Product) => void;
  sectionRef: React.RefObject<HTMLElement>;
}) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = products;
    if (filter === 'popular') list = list.filter(p => POPULAR_IDS.has(p.id));
    else if (filter === 'dairy-free') list = list.filter(p => p.dietary.includes('dairy-free'));
    else if (filter === 'vegetarian') list = list.filter(p => p.dietary.includes('vegetarian'));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [filter, query, products]);

  return (
    <section ref={sectionRef} id="pick" className="pick-section" aria-label="Choose your platter items">
      <header className="section-head">
        <span className="kicker">Step 1 - Choose what you love</span>
        <h2>Pick <em>your</em> six.</h2>
        <p className="section-lede">
          Every tap adds an item to your platter. Change your mind? Tap again to remove.
          No filler, ever.
        </p>
      </header>

      <div className="pick-controls">
        <div className="filter-pills" role="tablist" aria-label="Filter treats">
          {FILTERS.map(f => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`pill ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <input
            type="search"
            className="search"
            placeholder="Search treats..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search treats"
          />
        </div>
      </div>

      <div className="product-grid" role="list">
        {filtered.map(p => {
          const selected = selectedIds.includes(p.id);
          const disabled = !selected && platterFull;
          const popular = POPULAR_IDS.has(p.id);
          return (
            <article
              key={p.id}
              role="listitem"
              className={`product ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            >
              <div className="product-media">
                <FoodPlaceholder id={p.id} />
                {popular && <span className="badge-popular"><StarIcon size={10} /> Popular</span>}
                {selected && <span className="badge-selected"><CheckIcon size={12} /> Added</span>}
              </div>
              <div className="product-body">
                <div className="product-head">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-price">{fmtZAR(p.price)}</div>
                </div>
                <p className="product-desc">{p.description}</p>
                <div className="product-tags">
                  {p.dietary.map(d => <span key={d} className="tag diet">{d}</span>)}
                </div>
                <button
                  className={`product-btn ${selected ? 'remove' : ''}`}
                  onClick={() => onToggle(p)}
                  disabled={disabled}
                  aria-pressed={selected}
                >
                  {selected ? (
                    <><MinusIcon size={14} /> Remove from platter</>
                  ) : disabled ? (
                    'Platter full'
                  ) : (
                    <><PlusIcon size={14} /> Add to platter</>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-results">
          No treats match "<strong>{query}</strong>". Try another word.
        </div>
      )}
    </section>
  );
}

// ---- How It Works ----
function HowItWorks({ onScrollToPick, onWhatsapp }: { onScrollToPick: () => void; onWhatsapp: () => void }) {
  const steps = [
    { n: '01', t: 'Pick six treats', d: 'Tap what you want. Swap until it\'s perfect. No obligation.' },
    { n: '02', t: 'Send it on WhatsApp', d: 'One tap opens a chat with us. We confirm within the hour.' },
    { n: '03', t: 'Collect fresh', d: '71 Springbok St, Theresapark. Pay on pickup by EFT or cash.' },
  ];
  return (
    <section className="how-section" id="how">
      <header className="section-head">
        <span className="kicker">How it works</span>
        <h2>Three steps. No cart abandonment.</h2>
      </header>
      <ol className="how-steps">
        {steps.map(s => (
          <li key={s.n} className="how-step">
            <span className="how-num">{s.n}</span>
            <div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="how-cta">
        <button className="btn btn-primary lg" onClick={onScrollToPick}>
          Start your platter <ArrowIcon size={14} />
        </button>
        <button className="btn btn-ghost lg" onClick={onWhatsapp}>
          <WhatsappIcon size={16} /> Ask us anything
        </button>
      </div>
    </section>
  );
}

// ---- Meals Section ----
function MealsSection({ meals, onOrderMeal }: { meals: Meal[]; onOrderMeal: (m: Meal) => void }) {
  return (
    <section id="weekly-meals" className="meals-section">
      <header className="section-head meals-head">
        <span className="kicker">Don't want to build?</span>
        <h2>This week's <em>ready-made</em> meals.</h2>
        <p className="section-lede">
          Family meals, cooked fresh and packed for pickup. New menu every week.
        </p>
      </header>
      <div className="meal-grid">
        {meals.map(m => (
          <article key={m.id} className="meal-card">
            <div className="meal-media">
              <FoodPlaceholder id={m.id} />
              <span className="meal-week">{m.weekOf}</span>
            </div>
            <div className="meal-body">
              <h3>{m.name}</h3>
              <p>{m.description}</p>
              <div className="meal-meta">
                <span>{m.servings}</span>
                {m.dietary.length > 0 && m.dietary.map(d => <span key={d} className="tag diet">{d}</span>)}
              </div>
              <div className="meal-foot">
                <div className="meal-price">{fmtZAR(m.price)}</div>
                <button className="btn btn-primary sm" onClick={() => onOrderMeal(m)}>
                  <WhatsappIcon size={14} /> Order this meal
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---- Story Section ----
function StorySection() {
  return (
    <section className="story-section" id="about">
      <div className="story-grid">
        <div className="story-text">
          <span className="kicker">Our story</span>
          <h2>Born at a kitchen table.<br /><em>Still made there.</em></h2>
          <p>
            Manna started in a hard season: one sister was diagnosed with
            Guillain-Barre syndrome, and we needed a way through the medical bills.
            So we cooked. The food our gran made us. The platters our neighbours begged for.
          </p>
          <p>
            Word got around. People kept coming back -- not just for the food, but
            for the care in every dish. Today it's a family business, but every
            platter still leaves our home kitchen in Theresapark.
          </p>
          <p className="story-sign">-- Mariette &amp; Hannelie</p>
        </div>
        <aside className="story-figure">
          <div className="figure-note">
            <span className="fn-num">01</span>
            <span className="fn-text">Two sisters. One kitchen.</span>
          </div>
          <div className="figure-note offset">
            <span className="fn-num">02</span>
            <span className="fn-text">Nothing frozen. Nothing bought-in.</span>
          </div>
          <div className="figure-note">
            <span className="fn-num">03</span>
            <span className="fn-text">If we wouldn't feed it to our own kids, we don't sell it.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ---- Testimonials ----
const TESTIMONIALS = [
  { quote: 'Best platter we\'ve ordered in Pretoria North. Every item was a win -- no filler!', name: 'Lerato M.', context: 'Birthday, 40 guests' },
  { quote: 'Ordered weekly for six months. The bobotie tastes like Ouma\'s.', name: 'Johan V.', context: 'Regular since 2025' },
  { quote: 'They remember our kids\' favourites. You don\'t get that from a deli.', name: 'The Pretorius family', context: 'Theresapark' },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <header className="section-head">
        <span className="kicker">Kind words</span>
        <h2>The regulars keep coming back.</h2>
      </header>
      <div className="testimonial-grid">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="testimonial">
            <div className="stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, j) => <StarIcon key={j} size={12} />)}
            </div>
            <blockquote>"{t.quote}"</blockquote>
            <figcaption>
              <strong>{t.name}</strong>
              <span>{t.context}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ---- FAQ ----
const FAQ_ITEMS = [
  { q: 'How do I place an order?', a: 'Build your platter or pick a weekly meal, then send it straight to us on WhatsApp. We confirm details with you personally -- usually within the hour.' },
  { q: 'When do I need to order by?', a: 'Order 24 hours ahead for platters, 48 hours for weekly meals. For weekend orders, please message us by Thursday evening.' },
  { q: 'Do you deliver?', a: 'Collection from 71 Springbok St, Theresapark is free. We can arrange Uber or a courier on request -- we\'ll quote you a flat rate before you pay.' },
  { q: 'Can you cater dietary needs?', a: 'Yes -- most items are dairy-free or gluten-free. Let us know any allergies when you message and we\'ll steer you right.' },
  { q: 'How do I pay?', a: 'EFT or cash on collection. Details come with your WhatsApp confirmation.' },
];

function FAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section className="faq" id="faq">
      <header className="section-head">
        <span className="kicker">Good to know</span>
        <h2>Frequently asked.</h2>
      </header>
      <div className="faq-list">
        {FAQ_ITEMS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                className="faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{f.q}</span>
                <span className="faq-toggle" aria-hidden="true">{isOpen ? '-' : '+'}</span>
              </button>
              {isOpen && (
                <div className="faq-a">
                  <p>{f.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---- Footer CTA ----
function FooterCTA({ onWhatsapp }: { onWhatsapp: () => void }) {
  return (
    <section className="footer-cta" id="contact">
      <div className="fc-inner">
        <h2>Hungry yet?</h2>
        <p>One WhatsApp. No app downloads. No logins. Just a chat with the sisters.</p>
        <div className="fc-ctas">
          <button className="btn btn-whatsapp lg" onClick={onWhatsapp}>
            <WhatsappIcon size={18} /> +27 82 579 5210
          </button>
          <a className="btn btn-ghost lg inverse" href="#pick">
            Build a platter first
          </a>
        </div>
        <div className="fc-meta">
          <div><PinIcon size={14} /> 71 Springbok St, Theresapark, Pretoria</div>
          <div><StarIcon size={12} /> Order 24h ahead for platters, 48h for meals</div>
        </div>
      </div>
    </section>
  );
}

// ---- Platter Drawer ----
function PlatterDrawer({ items, onRemove, onClear, onOrder, onScrollTo, expanded, setExpanded }: {
  items: Product[];
  onRemove: (i: number) => void;
  onClear: () => void;
  onOrder: () => void;
  onScrollTo: () => void;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
  const slots = Array.from({ length: 6 }, (_, i) => items[i] || null);
  const complete = items.length === 6;
  const total = items.reduce((s, x) => s + x.price, 0);

  return (
    <div className={`drawer ${expanded ? 'expanded' : ''} ${complete ? 'complete' : ''}`}>
      <button
        className="drawer-handle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse platter' : 'Expand platter'}
      >
        <span className="handle-bar" />
      </button>

      <div className="drawer-row">
        <div className="drawer-meta">
          <div className="drawer-title">
            {complete ? 'Your platter is ready' : 'Your platter'}
          </div>
          <div className="drawer-sub">
            {items.length}/6 items <strong>{fmtZAR(total)}</strong>
          </div>
        </div>

        <div className="drawer-slots" role="list" aria-label="Platter slots">
          {slots.map((item, i) => (
            <div
              key={i}
              className={`drawer-slot ${item ? 'filled' : 'empty'}`}
              role="listitem"
              onClick={() => { if (!item) onScrollTo(); }}
              tabIndex={item ? -1 : 0}
              title={item ? item.name : `Slot ${i + 1} - tap to add`}
            >
              {item ? (
                <>
                  <span className="ds-num">{i + 1}</span>
                  <span className="ds-name">{item.name}</span>
                  <button
                    className="ds-remove"
                    onClick={e => { e.stopPropagation(); onRemove(i); }}
                    aria-label={`Remove ${item.name}`}
                  >
                    <XIcon size={10} />
                  </button>
                </>
              ) : (
                <span className="ds-empty-num">{i + 1}</span>
              )}
            </div>
          ))}
        </div>

        <div className="drawer-actions">
          {items.length > 0 && (
            <button className="btn btn-ghost sm" onClick={onClear}>Clear</button>
          )}
          <button
            className={`btn btn-order ${complete ? '' : 'disabled'}`}
            onClick={complete ? onOrder : onScrollTo}
          >
            {complete ? (
              <><WhatsappIcon size={14} /> Order on WhatsApp</>
            ) : (
              <>Pick {6 - items.length} more</>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="drawer-expanded">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your platter is empty. Tap any treat below to add it -- we'll track your 6 for you.</p>
              <button className="btn btn-primary sm" onClick={onScrollTo}>Browse treats</button>
            </div>
          ) : (
            <ul className="drawer-list">
              {items.map((it, i) => (
                <li key={i}>
                  <span className="dl-name"><span className="dl-num">{i + 1}.</span> {it.name}</span>
                  <span className="dl-price">{fmtZAR(it.price)}</span>
                  <button className="dl-remove" onClick={() => onRemove(i)} aria-label={`Remove ${it.name}`}>
                    <XIcon size={12} />
                  </button>
                </li>
              ))}
              <li className="dl-total">
                <span>Platter total</span>
                <strong>{fmtZAR(total)}</strong>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Main HomePage ----
export default function HomePage({ products, meals }: HomePageProps) {
  const [selected, setSelected] = useState<Product[]>(() => {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('manna-platter') : null;
      if (!raw) return [];
      const ids: string[] = JSON.parse(raw);
      return products.filter(p => ids.includes(p.id));
    } catch { return []; }
  });

  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const pickRef = useRef<HTMLElement>(null!);

  const total = selected.reduce((s, x) => s + x.price, 0);
  const complete = selected.length === 6;
  const selectedIds = selected.map(s => s.id);

  const toggle = (p: Product) => {
    setSelected(cur => {
      const ix = cur.findIndex(x => x.id === p.id);
      if (ix >= 0) return cur.filter((_, i) => i !== ix);
      if (cur.length >= 6) return cur;
      return [...cur, p];
    });
  };
  const remove = (i: number) => setSelected(cur => cur.filter((_, j) => j !== i));
  const clear = () => setSelected([]);

  const scrollToPick = () => {
    pickRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openWhatsapp = (msg?: string) => {
    const body = encodeURIComponent(msg || 'Hi Manna! I have a question about your platters.');
    window.open(`https://wa.me/27825795210?text=${body}`, '_blank', 'noopener,noreferrer');
  };

  const orderPlatter = () => {
    const lines = [
      'Hi Manna! I\'d like to order a platter:',
      '',
      ...selected.map((it, i) => `${i + 1}. ${it.name} (${fmtZAR(it.price)})`),
      '',
      `Total: ${fmtZAR(total)}`,
      '',
      'Name: ',
      'Pickup day: ',
    ];
    openWhatsapp(lines.join('\n'));
  };

  const orderMeal = (m: Meal) => {
    openWhatsapp(`Hi Manna! I'd like to order this week's ${m.name} (${fmtZAR(m.price)}).\n\nName: \nPickup day: `);
  };

  return (
    <>
      <a href="#pick" className="skip-link">Skip to menu</a>
      <main id="top">
        <Hero
          selectedCount={selected.length}
          total={total}
          onScrollToPick={scrollToPick}
        />

        <PickSection
          sectionRef={pickRef}
          products={products}
          selectedIds={selectedIds}
          platterFull={complete}
          onToggle={toggle}
        />

        <HowItWorks onScrollToPick={scrollToPick} onWhatsapp={() => openWhatsapp()} />

        <MealsSection meals={meals} onOrderMeal={orderMeal} />

        <StorySection />

        <Testimonials />

        <FAQ />

        <FooterCTA onWhatsapp={() => openWhatsapp()} />
      </main>

      <PlatterDrawer
        items={selected}
        onRemove={remove}
        onClear={clear}
        onOrder={orderPlatter}
        onScrollTo={scrollToPick}
        expanded={drawerExpanded}
        setExpanded={setDrawerExpanded}
      />

      <style>{`
        .skip-link { position: absolute; left: -9999px; }
        .skip-link:focus { left: 1rem; top: 1rem; background: var(--ink); color: var(--paper); padding: 0.5rem 1rem; z-index: 9999; border-radius: 6px; }

        /* Buttons */
        .btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: var(--font-body); font-weight: 600; font-size: 0.95rem;
          padding: 0.875rem 1.25rem; border-radius: 999px;
          transition: transform 120ms ease, background 200ms ease, color 200ms ease, box-shadow 200ms ease;
          min-height: 46px; white-space: nowrap; letter-spacing: -0.01em;
          text-decoration: none; border: none; cursor: pointer;
        }
        .btn.sm { padding: 0.55rem 0.9rem; font-size: 0.85rem; min-height: 38px; }
        .btn.lg { padding: 1.1rem 1.6rem; font-size: 1rem; min-height: 54px; }
        .btn-primary { background: var(--ink); color: var(--paper); }
        .btn-primary:hover { background: var(--accent-strong); transform: translateY(-1px); }
        .btn-ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
        .btn-ghost:hover { background: var(--paper-2); border-color: var(--ink-soft); }
        .btn-ghost.inverse { color: var(--paper); border-color: rgba(255,255,255,0.35); }
        .btn-ghost.inverse:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.6); }
        .btn-whatsapp { background: var(--wa); color: white; }
        .btn-whatsapp:hover { background: var(--wa-strong); transform: translateY(-1px); }
        .btn-order {
          background: var(--accent); color: var(--accent-ink);
          padding: 0.75rem 1.25rem; border-radius: 999px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: var(--font-body); cursor: pointer; border: none;
        }
        .btn-order:not(.disabled):hover { background: var(--ink); color: var(--paper); }
        .btn-order.disabled { background: var(--paper-3); color: var(--ink-mute); cursor: default; }

        /* Hero */
        .hero-editorial {
          position: relative; overflow: hidden;
          background: var(--paper);
          padding: 3.5rem 1.5rem 2rem;
          border-bottom: 1px solid var(--line-2);
        }
        .hero-editorial::before {
          content: ""; position: absolute; inset: 0;
          background:
            radial-gradient(900px 400px at 80% 0%, oklch(0.95 0.08 45) 0%, transparent 60%),
            radial-gradient(700px 500px at 10% 100%, var(--paper-2) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-grid {
          max-width: var(--content-w); margin: 0 auto; position: relative;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          grid-template-areas: "meta meta" "title visual" "lede visual" "cta visual" "stats visual";
          gap: 1.25rem 3rem; align-items: start; padding: 2rem 0 1rem;
        }
        .hero-meta { grid-area: meta; display: flex; gap: 1rem; flex-wrap: wrap; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-family: ui-monospace, monospace;
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--ink-soft);
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--line); border-radius: 999px; background: var(--paper-2);
        }
        .hero-eyebrow.alt { background: var(--accent-wash); border-color: oklch(0.85 0.08 45); color: var(--accent-ink); }
        .hero-title {
          grid-area: title;
          font-family: var(--font-display); font-weight: 600;
          font-size: clamp(2.8rem, 6.2vw, 5.8rem);
          line-height: 0.96; letter-spacing: -0.035em; margin: 0; color: var(--ink); text-wrap: balance;
        }
        .hero-title .ital { font-style: italic; color: var(--accent-strong); font-weight: 500; }
        .hero-lede {
          grid-area: lede;
          font-size: clamp(1.05rem, 1.25vw, 1.2rem); color: var(--ink-soft);
          max-width: 46ch; margin: 0.5rem 0 0; text-wrap: pretty;
        }
        .hero-lede em { font-family: var(--font-display); font-style: italic; font-weight: 500; color: var(--accent-strong); }
        .hero-ctas { grid-area: cta; display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .hero-stats {
          grid-area: stats;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;
          margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--line-2); max-width: 480px;
        }
        .hero-stats > div { display: flex; flex-direction: column; }
        .hero-stats strong { font-family: var(--font-display); font-weight: 700; font-size: 1.6rem; line-height: 1; color: var(--ink); }
        .hero-stats span { font-size: 0.78rem; color: var(--ink-mute); margin-top: 0.25rem; }
        .hero-visual {
          grid-area: visual; position: relative; aspect-ratio: 1;
          max-width: 520px; width: 100%; margin-left: auto; color: var(--accent-strong);
        }
        .hero-plate {
          position: absolute; inset: 6%; border-radius: 50%;
          background: radial-gradient(circle at 30% 25%, var(--paper-2), var(--paper-3));
          border: 1.5px dashed var(--accent);
          box-shadow: var(--shadow-md), inset 0 0 0 8px var(--paper);
        }
        .hero-plate-shadow {
          position: absolute; left: 8%; right: 8%; bottom: 0;
          height: 16px; border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.16), transparent 70%);
          filter: blur(6px); z-index: -1;
        }
        .hero-slot {
          position: absolute; width: 60px; height: 60px;
          transform: translate(-50%, -50%); border-radius: 50%;
          background: var(--paper); border: 1.5px solid var(--line);
          display: grid; place-items: center;
          font-family: var(--font-display); font-weight: 700; font-size: 1.15rem;
          color: var(--ink-mute); box-shadow: var(--shadow-sm);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hero-slot.filled {
          background: var(--ink); color: var(--paper); border-color: var(--ink);
          transform: translate(-50%, -50%) scale(1.08);
        }
        .hero-plate-center {
          position: absolute; inset: 0; display: grid; place-items: center;
          text-align: center; pointer-events: none;
        }
        .hpc-num {
          font-family: var(--font-display); font-weight: 700;
          font-size: clamp(3rem, 6vw, 5rem); line-height: 1; color: var(--ink); font-style: italic;
        }
        .hpc-num span { font-size: 0.4em; color: var(--ink-mute); font-style: normal; }
        .hpc-label { font-family: ui-monospace, monospace; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--ink-mute); margin-top: 0.25rem; }
        .hpc-total { font-family: var(--font-display); font-weight: 600; font-size: 1.4rem; color: var(--accent-strong); margin-top: 0.4rem; }

        /* Ticker */
        .ticker {
          margin-top: 2rem; overflow: hidden;
          border-top: 1px solid var(--line-2); border-bottom: 1px solid var(--line-2);
          padding: 0.75rem 0; background: var(--paper-2);
        }
        .ticker-track {
          display: flex; gap: 2.5rem;
          animation: ticker 40s linear infinite; white-space: nowrap;
        }
        .ticker-item {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-family: ui-monospace, monospace;
          font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-soft); flex-shrink: 0;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* Section heads */
        .section-head { max-width: 780px; margin: 0 auto 2.5rem; text-align: center; }
        .section-head.meals-head { border-top: 1px solid var(--line-2); padding-top: 2rem; }
        .kicker {
          display: inline-block; font-family: ui-monospace, monospace;
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.18em;
          color: var(--accent-strong); margin-bottom: 0.75rem;
        }
        .section-head h2 {
          font-family: var(--font-display); font-weight: 500;
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 0.75rem; text-wrap: balance;
        }
        .section-head h2 em { font-style: italic; color: var(--accent-strong); font-weight: 500; }
        .section-lede { font-size: 1.08rem; color: var(--ink-soft); margin: 0 auto; max-width: 52ch; text-wrap: pretty; }

        /* Pick section */
        .pick-section { padding: var(--density-pad) 1.5rem; max-width: var(--content-w); margin: 0 auto; }
        .pick-controls {
          display: flex; justify-content: space-between; align-items: center;
          gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2rem;
          padding-bottom: 1rem; border-bottom: 1px solid var(--line-2);
        }
        .filter-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .pill {
          padding: 0.55rem 1rem; border-radius: 999px;
          background: transparent; border: 1px solid var(--line);
          font-size: 0.88rem; font-weight: 500; color: var(--ink-soft);
          transition: all 180ms ease; cursor: pointer;
        }
        .pill:hover { border-color: var(--ink-soft); color: var(--ink); }
        .pill.active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .search-wrap { position: relative; flex-shrink: 0; }
        .search {
          padding: 0.6rem 1rem; border-radius: 999px;
          border: 1px solid var(--line); background: var(--paper);
          font-family: var(--font-body); font-size: 0.9rem; color: var(--ink); min-width: 220px;
          transition: border-color 180ms ease;
        }
        .search:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-wash); }
        .product-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--density-gap);
        }
        .product {
          background: var(--paper); border: 1px solid var(--line-2); border-radius: var(--radius-lg);
          overflow: hidden; display: flex; flex-direction: column;
          transition: all 240ms cubic-bezier(0.4, 0, 0.2, 1); position: relative;
        }
        .product:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--line); }
        .product.selected { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent), var(--shadow-md); }
        .product.disabled { opacity: 0.5; pointer-events: none; }
        .product.disabled .product-btn { pointer-events: auto; opacity: 0.7; }
        .product-media { aspect-ratio: 5/4; position: relative; overflow: hidden; background: var(--paper-2); }
        .badge-popular, .badge-selected {
          position: absolute; top: 0.75rem; left: 0.75rem;
          display: inline-flex; align-items: center; gap: 0.25rem;
          padding: 0.3rem 0.6rem;
          font-family: ui-monospace, monospace; font-size: 0.68rem; text-transform: uppercase;
          letter-spacing: 0.08em; font-weight: 600; border-radius: 999px;
          background: var(--paper); color: var(--accent-ink); border: 1px solid oklch(0.85 0.1 45);
        }
        .badge-selected {
          top: auto; bottom: 0.75rem; left: 0.75rem;
          background: var(--ink); color: var(--paper); border-color: var(--ink);
        }
        .product-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
        .product-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; }
        .product-name {
          font-family: var(--font-display); font-weight: 600; font-size: 1.2rem; line-height: 1.2;
          margin: 0; letter-spacing: -0.02em; text-wrap: balance;
        }
        .product-price {
          font-family: var(--font-display); font-weight: 600; font-size: 1.15rem;
          color: var(--accent-strong); font-variant-numeric: tabular-nums; flex-shrink: 0;
        }
        .product-desc { font-size: 0.9rem; color: var(--ink-mute); margin: 0; line-height: 1.5; }
        .product-tags { display: flex; gap: 0.35rem; flex-wrap: wrap; }
        .tag { font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 999px; background: var(--paper-2); color: var(--ink-soft); border: 1px solid var(--line-2); }
        .tag.diet { background: transparent; color: oklch(0.52 0.15 150); border-color: oklch(0.85 0.08 150); }
        .product-btn {
          margin-top: auto; padding: 0.7rem 1rem; border-radius: 999px;
          background: var(--accent-wash); color: var(--accent-ink);
          border: 1px solid oklch(0.85 0.1 45);
          font-weight: 600; font-size: 0.9rem; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
          transition: all 180ms ease;
        }
        .product-btn:hover:not(:disabled) { background: var(--accent); color: var(--accent-ink); }
        .product-btn.remove { background: var(--ink); color: var(--paper); border-color: var(--ink); }
        .product-btn.remove:hover { background: var(--accent-strong); }
        .product-btn:disabled { cursor: not-allowed; }
        .empty-results { text-align: center; color: var(--ink-mute); padding: 3rem; }

        /* How it works */
        .how-section {
          padding: var(--density-pad) 1.5rem; max-width: var(--content-w); margin: 0 auto;
          border-top: 1px solid var(--line-2);
        }
        .how-steps {
          list-style: none; padding: 0; margin: 0 0 2rem;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;
        }
        .how-step {
          display: flex; gap: 1rem; padding: 1.5rem;
          background: var(--paper); border: 1px solid var(--line-2); border-radius: var(--radius-lg);
        }
        .how-num {
          font-family: var(--font-display); font-weight: 700; font-size: 2.6rem;
          line-height: 1; color: var(--accent-strong); font-style: italic; flex-shrink: 0;
        }
        .how-step h3 { font-family: var(--font-display); font-weight: 600; font-size: 1.3rem; margin: 0 0 0.35rem; letter-spacing: -0.02em; }
        .how-step p { margin: 0; color: var(--ink-soft); font-size: 0.95rem; }
        .how-cta { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

        /* Meals */
        .meals-section {
          padding: var(--density-pad) 1.5rem; background: var(--paper-2);
          border-top: 1px solid var(--line-2); border-bottom: 1px solid var(--line-2);
        }
        .meal-grid {
          max-width: var(--content-w); margin: 0 auto;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;
        }
        .meal-card {
          background: var(--paper); border: 1px solid var(--line-2); border-radius: var(--radius-lg);
          overflow: hidden; display: grid; grid-template-columns: 180px 1fr;
        }
        .meal-media { position: relative; aspect-ratio: 1; overflow: hidden; }
        .meal-week {
          position: absolute; top: 0.75rem; left: 0.75rem;
          font-family: ui-monospace, monospace; font-size: 0.68rem;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 0.3rem 0.6rem; background: var(--paper); color: var(--ink);
          border-radius: 999px; border: 1px solid var(--line);
        }
        .meal-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .meal-body h3 { font-family: var(--font-display); font-weight: 600; font-size: 1.25rem; margin: 0; letter-spacing: -0.02em; text-wrap: balance; }
        .meal-body p { margin: 0; color: var(--ink-mute); font-size: 0.9rem; line-height: 1.5; }
        .meal-meta { display: flex; gap: 0.4rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--ink-soft); }
        .meal-foot { display: flex; justify-content: space-between; align-items: center; margin-top: auto; gap: 0.75rem; }
        .meal-price { font-family: var(--font-display); font-weight: 700; font-size: 1.4rem; color: var(--accent-strong); }

        /* Story */
        .story-section { padding: var(--density-pad) 1.5rem; max-width: var(--content-w); margin: 0 auto; }
        .story-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center; }
        .story-text h2 {
          font-family: var(--font-display); font-weight: 500;
          font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1.05; letter-spacing: -0.03em;
          margin: 0 0 1.5rem; text-wrap: balance;
        }
        .story-text h2 em { font-style: italic; color: var(--accent-strong); font-weight: 500; }
        .story-text p { font-size: 1.05rem; color: var(--ink-soft); margin: 0 0 1rem; max-width: 52ch; }
        .story-sign { font-family: var(--font-display); font-style: italic; font-size: 1.3rem; color: var(--ink); margin-top: 1.5rem !important; }
        .story-figure { display: flex; flex-direction: column; gap: 1rem; padding-left: 2rem; }
        .figure-note {
          display: flex; align-items: baseline; gap: 1rem; padding: 1.25rem 1.5rem;
          background: var(--paper); border-left: 2px solid var(--accent);
          border-radius: 0 12px 12px 0; box-shadow: var(--shadow-sm);
        }
        .figure-note.offset { margin-left: 2rem; background: var(--accent-wash); border-left-color: var(--ink); }
        .fn-num { font-family: var(--font-display); font-weight: 700; font-style: italic; font-size: 1.6rem; color: var(--accent-strong); }
        .fn-text { font-family: var(--font-display); font-weight: 500; font-size: 1.05rem; line-height: 1.35; text-wrap: pretty; }

        /* Testimonials */
        .testimonials {
          padding: var(--density-pad) 1.5rem; background: var(--paper-2);
          border-top: 1px solid var(--line-2); border-bottom: 1px solid var(--line-2);
        }
        .testimonial-grid {
          max-width: var(--content-w); margin: 0 auto;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;
        }
        .testimonial {
          background: var(--paper); padding: 1.75rem; border-radius: var(--radius-lg);
          border: 1px solid var(--line-2); margin: 0; display: flex; flex-direction: column; gap: 0.75rem;
        }
        .stars { display: inline-flex; gap: 0.1rem; color: var(--accent); }
        .testimonial blockquote {
          font-family: var(--font-display); font-weight: 500; font-size: 1.15rem;
          line-height: 1.4; margin: 0; color: var(--ink); letter-spacing: -0.01em; text-wrap: pretty;
        }
        .testimonial figcaption { display: flex; flex-direction: column; font-size: 0.85rem; color: var(--ink-mute); }
        .testimonial figcaption strong { color: var(--ink); font-weight: 600; }

        /* FAQ */
        .faq { padding: var(--density-pad) 1.5rem; max-width: 820px; margin: 0 auto; }
        .faq-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .faq-item { border-bottom: 1px solid var(--line-2); }
        .faq-q {
          width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 1rem;
          padding: 1.25rem 0; font-family: var(--font-display); font-weight: 500;
          font-size: 1.2rem; text-align: left; color: var(--ink); letter-spacing: -0.015em;
          background: none; border: none; cursor: pointer;
        }
        .faq-toggle { font-family: var(--font-display); font-size: 1.5rem; color: var(--accent-strong); width: 28px; height: 28px; display: grid; place-items: center; flex-shrink: 0; }
        .faq-a { padding: 0 0 1.25rem; color: var(--ink-soft); max-width: 60ch; }
        .faq-a p { margin: 0; }

        /* Footer CTA */
        .footer-cta {
          padding: calc(var(--density-pad) * 1.1) 1.5rem;
          background: var(--ink); color: var(--paper); position: relative; overflow: hidden;
        }
        .footer-cta::before {
          content: ""; position: absolute; inset: 0;
          background:
            radial-gradient(500px 300px at 20% 10%, oklch(0.35 0.12 45) 0%, transparent 60%),
            radial-gradient(400px 400px at 90% 80%, oklch(0.30 0.05 45 / 0.5) 0%, transparent 60%);
          pointer-events: none;
        }
        .fc-inner { position: relative; max-width: 720px; margin: 0 auto; text-align: center; }
        .fc-inner h2 {
          font-family: var(--font-display); font-weight: 500;
          font-size: clamp(2.6rem, 6vw, 4.5rem); line-height: 1; letter-spacing: -0.04em;
          margin: 0 0 1rem; font-style: italic; color: var(--paper);
        }
        .fc-inner > p { font-size: 1.15rem; color: oklch(0.8 0.02 70); margin: 0 0 2rem; text-wrap: pretty; }
        .fc-ctas { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem; }
        .fc-meta {
          display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
          padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.12);
          font-size: 0.85rem; color: oklch(0.75 0.02 70);
        }
        .fc-meta > div { display: inline-flex; align-items: center; gap: 0.4rem; }

        /* Platter Drawer */
        .drawer {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--paper); border-top: 1px solid var(--line);
          box-shadow: var(--shadow-lg); z-index: 40;
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .drawer.complete { background: linear-gradient(to bottom, var(--accent-wash), var(--paper)); }
        .drawer-handle {
          position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
          width: 60px; height: 22px;
          background: var(--paper); border: 1px solid var(--line); border-bottom: none;
          border-radius: 12px 12px 0 0; display: grid; place-items: center; cursor: pointer;
        }
        .handle-bar { width: 28px; height: 3px; background: var(--ink-mute); border-radius: 2px; }
        .drawer-row {
          max-width: var(--content-w); margin: 0 auto; padding: 0.75rem 1.25rem;
          display: grid; grid-template-columns: auto 1fr auto; gap: 1.25rem; align-items: center;
        }
        .drawer-meta { flex-shrink: 0; min-width: 140px; }
        .drawer-title { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; letter-spacing: -0.02em; line-height: 1.1; }
        .drawer-sub { font-size: 0.8rem; color: var(--ink-mute); margin-top: 0.15rem; }
        .drawer-sub strong { color: var(--accent-strong); font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; }
        .drawer-slots { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.4rem; min-width: 0; }
        .drawer-slot {
          aspect-ratio: 1.4; border-radius: 10px; position: relative;
          padding: 0.35rem 0.5rem; display: flex; flex-direction: column; justify-content: space-between;
          font-size: 0.72rem; transition: all 200ms ease; overflow: hidden; cursor: default;
        }
        .drawer-slot.empty {
          background: var(--paper-2); border: 1.5px dashed var(--line); color: var(--ink-mute);
          cursor: pointer; display: grid; place-items: center;
        }
        .drawer-slot.empty:hover { border-color: var(--accent); background: var(--accent-wash); }
        .drawer-slot.filled {
          background: var(--ink); color: var(--paper);
          animation: pop 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .ds-num { font-family: var(--font-display); font-weight: 700; font-style: italic; font-size: 0.9rem; color: var(--accent); }
        .ds-empty-num { font-family: var(--font-display); font-weight: 700; font-style: italic; font-size: 1.3rem; color: var(--line); }
        .ds-name { font-size: 0.68rem; line-height: 1.15; font-weight: 500; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .ds-remove {
          position: absolute; top: 2px; right: 2px; width: 18px; height: 18px;
          border-radius: 50%; background: rgba(255,255,255,0.15); color: var(--paper);
          display: grid; place-items: center; opacity: 0; transition: opacity 180ms;
          border: none; cursor: pointer;
        }
        .drawer-slot.filled:hover .ds-remove { opacity: 1; }
        .drawer-actions { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }
        .drawer-expanded {
          max-width: var(--content-w); margin: 0 auto;
          padding: 0 1.25rem 1rem; max-height: 340px; overflow-y: auto;
        }
        .drawer-empty { text-align: center; padding: 2rem 1rem; }
        .drawer-empty p { color: var(--ink-mute); margin: 0 0 1rem; }
        .drawer-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--line-2); }
        .drawer-list li {
          display: grid; grid-template-columns: 1fr auto auto; gap: 1rem;
          align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--line-2);
        }
        .dl-num { font-family: var(--font-display); font-weight: 700; font-style: italic; color: var(--accent-strong); margin-right: 0.25rem; }
        .dl-name { font-weight: 500; }
        .dl-price { font-family: var(--font-display); font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
        .dl-remove { width: 28px; height: 28px; border-radius: 50%; color: var(--ink-mute); border: none; cursor: pointer; display: grid; place-items: center; }
        .dl-remove:hover { color: var(--ink); background: var(--paper-2); }
        .dl-total { font-family: var(--font-display); font-weight: 600; font-size: 1.1rem; }
        .dl-total strong { color: var(--accent-strong); font-size: 1.4rem; }

        body { padding-bottom: 140px; }

        /* Responsive */
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            grid-template-areas: "meta" "title" "visual" "lede" "cta" "stats";
            gap: 1rem 0;
          }
          .hero-visual { margin: 1rem auto; max-width: 360px; }
          .story-grid { grid-template-columns: 1fr; gap: 2rem; }
          .story-figure { padding-left: 0; }
          .figure-note.offset { margin-left: 0; }
          .meal-card { grid-template-columns: 1fr; }
          .meal-media { aspect-ratio: 16/10; }
        }
        @media (max-width: 780px) {
          .drawer-row { grid-template-columns: 1fr; gap: 0.6rem; padding: 0.6rem 1rem; }
          .drawer-slot { aspect-ratio: 1; }
          .ds-name { display: none; }
          .drawer-slot.filled { display: grid; place-items: center; }
          .drawer-actions { justify-content: space-between; }
          .drawer-meta { display: flex; justify-content: space-between; align-items: baseline; }
          body { padding-bottom: 180px; }
        }
        @media (max-width: 520px) {
          .hero-editorial { padding: 2rem 1rem 1rem; }
          .hero-stats { grid-template-columns: 1fr; gap: 0.75rem; padding-top: 1rem; }
          .hero-stats > div { flex-direction: row; align-items: baseline; gap: 0.75rem; }
          .hero-stats strong { font-size: 1.3rem; }
        }
      `}</style>
    </>
  );
}
