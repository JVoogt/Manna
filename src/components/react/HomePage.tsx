import { useCartActions, useCartState } from '@/lib/cart-context';
import type { Meal } from '@/schemas/meal.schema';
import { toast } from 'sonner';

const WA_BASE = 'https://wa.me/27825795210';
const WA_HELLO = `${WA_BASE}?text=${encodeURIComponent('Hi Manna! I would like to order frozen meals.')}`;

const WA_ALLERGY = `${WA_BASE}?text=${encodeURIComponent('Hi Manna! I have an allergy question before I order.')}`;

const fmtZAR = (n: number) => `R${n}`;

const FAQ_ITEMS = [
  {
    q: 'How do I place an order?',
    a: 'Add meals to your order here, then send it to us on WhatsApp. We reply personally to confirm your meals, the delivery fee and the date.',
  },
  {
    q: 'Do you deliver?',
    a: 'Yes, we deliver locally in Pretoria. The delivery fee is quoted on WhatsApp before you pay anything. You can also collect from 71 Springbok St, Theresapark.',
  },
  {
    q: 'How far ahead must I order?',
    a: 'Please order at least 2 business days ahead. We confirm the exact date with you on WhatsApp.',
  },
  {
    q: 'How do I pay?',
    a: 'EFT: bank details are shown at checkout and sent with your WhatsApp confirmation. Cash is accepted when you collect.',
  },
  {
    q: 'What about allergies?',
    a: 'Tell us about any allergy when you order and we will confirm what is in each meal before we deliver.',
  },
  {
    q: 'Can I order for my mother or father?',
    a: 'Yes. Add the meals, send the order on WhatsApp, and tell us the name and address of the person receiving them. We confirm everything with you.',
  },
];

const AUDIENCE = [
  {
    t: 'Older adults at home',
    d: 'A proper meal from the freezer, without the shopping, chopping and standing at the stove.',
  },
  {
    t: 'People with a disability or limited mobility',
    d: 'Meals come to your door, so you do not have to get to the shops or cook a full meal.',
  },
  {
    t: 'Busy people and carers',
    d: 'Order for yourself, or for a parent. Put several of each meal in your order to fill the freezer for the week.',
  },
];

function MealItem({ meal }: { meal: Meal }) {
  const { addItem } = useCartActions();
  const cart = useCartState();
  const inOrder = cart.find(i => i.id === meal.id)?.quantity ?? 0;

  const add = () => {
    addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      type: 'meal',
      imageUrl: meal.imageUrl,
    });
    toast.success(`${meal.name} added to your order`);
  };

  return (
    <li className="meal">
      {meal.imageUrl ? (
        <>
          <img src={meal.imageUrl} alt={meal.name} width={640} height={480} loading="lazy" className="meal-img" />
          <h3 className="meal-name">{meal.name}</h3>
        </>
      ) : (
        <div className="meal-slot">
          <h3 className="meal-name">{meal.name}</h3>
        </div>
      )}
      <div className="meal-body">
        <p className="meal-desc">{meal.description}</p>
        {meal.allergens.length > 0 && (
          <p className="meal-allergens">Contains: {meal.allergens.join(', ')}</p>
        )}
        <p className="meal-price">
          {fmtZAR(meal.price)}
          {meal.servings ? <span className="meal-serv"> for {meal.servings}</span> : null}
        </p>
        <button type="button" className="btn btn-primary" onClick={add} aria-label={`Add to order: ${meal.name}`}>
          Add to order
        </button>
        {inOrder > 0 && <p className="meal-count" role="status">In your order: {inOrder}</p>}
      </div>
    </li>
  );
}

export default function HomePage({ meals }: { meals: Meal[] }) {
  const mains = meals.filter(m => m.category === 'meal');
  const desserts = meals.filter(m => m.category === 'dessert');

  return (
    <>
      <main className="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="display">Home-cooked meals, ready when you are.</h1>
              <p className="lede">Frozen meals from two sisters in Pretoria North, delivered to you.</p>
              <div className="actions">
                <a href="#menu" className="btn btn-primary">See the menu</a>
                <a href={WA_HELLO} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Order on WhatsApp</a>
              </div>
            </div>
            <ul className="hero-facts">
              <li>Delivered frozen to your door in Pretoria</li>
              <li>Or collect from Theresapark</li>
              <li>Order on WhatsApp, we confirm personally</li>
            </ul>
          </div>
        </section>

        <section className="menu" id="menu" aria-labelledby="menu-title">
          <div className="wrap">
            <h2 id="menu-title" className="display">The menu</h2>
            <p className="menu-note">
              Allergies? <a href={WA_ALLERGY} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a> before you order.
            </p>
            {mains.length === 0 && desserts.length === 0 && (
              <p className="menu-empty" role="status">
                No meals are available to order right now.{' '}
                <a href={WA_HELLO} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> to ask what we can make.
              </p>
            )}
            {mains.length > 0 && (
              <>
                <h3 className="group-title">Meals</h3>
                <ul className="meal-grid">
                  {mains.map(m => <MealItem key={m.id} meal={m} />)}
                </ul>
              </>
            )}
            {desserts.length > 0 && (
              <>
                <h3 className="group-title">Desserts</h3>
                <ul className="meal-grid">
                  {desserts.map(m => <MealItem key={m.id} meal={m} />)}
                </ul>
              </>
            )}
          </div>
        </section>

        <section className="who" aria-labelledby="who-title">
          <div className="wrap who-grid">
            <div className="who-mass">
              <h2 id="who-title" className="display">Good food, without the cooking.</h2>
            </div>
            <ul className="who-list">
              {AUDIENCE.map(a => (
                <li key={a.t}>
                  <h3>{a.t}</h3>
                  <p>{a.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="how" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <h2 id="how-title" className="display">How ordering works</h2>
            <ol className="steps">
              <li><h3>Choose your meals</h3><p>Add them to your order. Change the quantity in your order to stock up.</p></li>
              <li><h3>We confirm on WhatsApp</h3><p>We check the meals, the delivery fee and the date with you.</p></li>
              <li><h3>It arrives frozen</h3><p>Delivered to your door in Pretoria, or collect at 71 Springbok St, Theresapark.</p></li>
            </ol>
          </div>
        </section>

        <section className="story" id="story" aria-labelledby="story-title">
          <div className="wrap story-grid">
            <h2 id="story-title" className="display">Born at a kitchen table.</h2>
            <div className="story-text">
              <p>
                Manna started in a hard season: one sister was diagnosed with
                Guillain-Barre syndrome, and we needed a way through the medical bills.
                So we cooked. The food our gran made us.
              </p>
              <p>
                Word got around. People kept coming back, not just for the food, but
                for the care in every dish. Today it is a family business, and every
                meal still leaves our home kitchen in Theresapark. Frozen means that
                food is ready when you are, on the days cooking is too much.
              </p>
              <p className="story-sign">Mariette and Hannelie</p>
            </div>
          </div>
        </section>

        <section className="faq" id="faq" aria-labelledby="faq-title">
          <div className="wrap faq-wrap">
            <h2 id="faq-title" className="display">Questions</h2>
            <div className="faq-list">
              {FAQ_ITEMS.map(f => (
                <details key={f.q} className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="close" aria-labelledby="close-title">
          <div className="wrap close-grid">
            <h2 id="close-title" className="display">Prefer to just chat?</h2>
            <p className="lede">Message the sisters on WhatsApp. No app, no login.</p>
            <div className="actions">
              <a href={WA_HELLO} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Order on WhatsApp</a>
              <a href="/cart" className="btn btn-secondary">View your order</a>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        /* Hallmark · polish · frozen meals */
        .home {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--ink);
        }
        .home .wrap { max-width: var(--content-w); margin: 0 auto; padding: 0 1.5rem; }
        .home section { padding: clamp(3rem, 7vw, 5rem) 0; }
        .home .display {
          font-family: var(--font-display);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.01em;
          overflow-wrap: break-word;
          min-width: 0;
          text-wrap: balance;
        }
        .home h2.display { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1.5rem; }
        .home h3 { font-family: var(--font-display); font-weight: 600; line-height: 1.2; }
        .home .lede { font-size: 1.25rem; color: var(--ink-soft); max-width: 36ch; margin-top: 1.25rem; }
        .home .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }


        .home .btn {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 52px; padding: 0.75rem 1.5rem;
          font-family: var(--font-body); font-size: 1.125rem; font-weight: 600;
          border-radius: var(--radius); border: 2px solid var(--accent-ink);
          cursor: pointer; text-decoration: none;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .home .btn-primary { background: var(--accent-ink); color: var(--paper); }
        .home .btn-primary:hover { background: var(--ink); border-color: var(--ink); }
        .home .btn-secondary { background: transparent; color: var(--accent-ink); }
        .home .btn-secondary:hover { background: var(--accent-wash); }
        .home .btn:active { background: var(--ink); border-color: var(--ink); color: var(--paper); }
        .home .btn:focus-visible,
        .home .faq-item summary:focus-visible {
          outline: 3px solid var(--ink); outline-offset: 3px;
        }

        .hero { padding-top: clamp(2.5rem, 6vw, 4.5rem); }
        .hero-grid { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 3rem; align-items: center; }
        .hero .display { font-size: clamp(2.5rem, 5.5vw, 4.25rem); max-width: 14ch; }
        .hero-facts {
          list-style: none; background: var(--paper-2); border-radius: var(--radius-lg);
          padding: 1.5rem 1.75rem;
        }
        .hero-facts li { padding: 1rem 0; border-bottom: 1px solid var(--line); }
        .hero-facts li:last-child { border-bottom: 0; }

        .menu { background: var(--paper-2); }
        .menu-note, .menu-empty { font-size: 1.125rem; color: var(--ink-soft); margin: -0.5rem 0 0; }
        .menu-note a, .menu-empty a { color: var(--accent-ink); text-decoration: underline; text-underline-offset: 3px; }
        .group-title { font-size: 1.5rem; margin: 3rem 0 1rem; }
        .meal-grid { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); gap: 1.5rem; }
        .meal {
          background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-lg);
          overflow: hidden; display: flex; flex-direction: column; min-width: 0;
        }
        .meal-img { width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; display: block; }
        .meal-slot {
          background: var(--paper-3); aspect-ratio: 4 / 3;
          display: flex; align-items: center; justify-content: center; padding: 1.25rem; text-align: center;
        }
        .meal-slot .meal-name { font-size: 1.5rem; }
        .meal-img + .meal-name { font-size: 1.5rem; padding: 1rem 1.25rem 0; }
        .meal-name { overflow-wrap: break-word; min-width: 0; }
        .meal-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .meal-allergens { color: var(--ink-soft); font-size: 1rem; }
        .meal-price { font-weight: 700; font-size: 1.375rem; margin-top: auto; padding-top: 0.5rem; }
        .meal-serv { font-weight: 400; font-size: 1rem; color: var(--ink-soft); }
        .meal-count { font-weight: 600; color: var(--accent-ink); }

        .who-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 3rem; align-items: stretch; }
        .who-mass {
          background: var(--accent-wash); border-radius: var(--radius-lg);
          padding: clamp(1.5rem, 4vw, 3rem); display: flex; align-items: flex-end;
        }
        .who-mass h2 { margin: 0; font-size: clamp(2rem, 4vw, 3.25rem); color: var(--accent-ink); }
        .who-list { list-style: none; }
        .who-list li { padding: 1.25rem 0; border-top: 1px solid var(--line); }
        .who-list li:last-child { border-bottom: 1px solid var(--line); }
        .who-list h3 { font-size: 1.375rem; margin-bottom: 0.25rem; }
        .who-list p { color: var(--ink-soft); max-width: 52ch; }

        .how { background: var(--paper-2); }
        .steps { list-style: none; counter-reset: step; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; }
        .steps li { counter-increment: step; border-top: 3px solid var(--accent-ink); padding-top: 1rem; }
        .steps li::before { content: counter(step); font-family: var(--font-display); font-size: 2rem; font-weight: 600; color: var(--accent-ink); }
        .steps h3 { font-size: 1.375rem; margin: 0.25rem 0 0.5rem; }
        .steps p { color: var(--ink-soft); }

        .story-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 3rem; align-items: start; }
        .story-grid h2 { margin: 0; }
        .story-text p + p { margin-top: 1rem; }
        .story-text { max-width: 60ch; }
        .story-sign { font-family: var(--font-display); font-weight: 600; }

        .faq { background: var(--paper-2); }
        .faq-wrap { max-width: 860px; }
        .faq-item { border-top: 1px solid var(--line); }
        .faq-item:last-child { border-bottom: 1px solid var(--line); }
        .faq-item summary {
          min-height: 56px; padding: 0.875rem 2.5rem 0.875rem 0; cursor: pointer;
          font-weight: 600; list-style: none; position: relative; display: flex; align-items: center;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after { content: '+'; position: absolute; right: 0.25rem; font-size: 1.75rem; font-weight: 400; }
        .faq-item[open] summary::after { content: '\\2212'; }
        .faq-item p { padding: 0 0 1.25rem; color: var(--ink-soft); max-width: 60ch; }

        .close-grid { display: flex; flex-direction: column; align-items: flex-start; }
        .close h2 { margin-bottom: 0.75rem; }

        @media (max-width: 860px) {
          .hero-grid, .who-grid, .story-grid { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
          .steps { grid-template-columns: minmax(0, 1fr); }
          .home .btn { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .home .btn { transition: none; }
        }
      `}</style>
    </>
  );
}
