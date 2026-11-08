import { useState } from 'react';
import { useCartActions, useCartState } from '@/lib/cart-context';
import type { Meal } from '@/schemas/meal.schema';
import { toast } from 'sonner';
import { FAQ_ITEMS } from '@/lib/faq';
import { WA_HELLO, WA_ALLERGY, WA_DISPLAY } from '@/lib/site';
import '../../styles/home.css';

const fmtZAR = (n: number) => `R${n}`;

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

const STEPS = [
  { t: 'Choose your meals', d: 'Add them to your order here, at least 2 business days ahead.' },
  { t: 'We confirm on WhatsApp', d: 'We check your meals, the delivery fee and the date with you.' },
  { t: 'Pay by EFT or cash', d: 'Bank details are at checkout and in our WhatsApp confirmation. Cash when you collect.' },
  { t: 'It arrives frozen', d: 'Delivered locally in Pretoria, or collect at 71 Springbok St, Theresapark.' },
];

function MealItem({ meal }: { meal: Meal }) {
  const { addItem, updateQuantity, removeItem } = useCartActions();
  const cart = useCartState();
  const inOrder = cart.find(i => i.id === meal.id)?.quantity ?? 0;
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = !!meal.imageUrl && !imgFailed;

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

  const change = (q: number) => (q <= 0 ? removeItem(meal.id) : updateQuantity(meal.id, Math.min(q, 20)));

  return (
    <li className={hasImage ? 'dish' : 'dish dish--noimg'}>
      <figure
        className="dish__slot"
        data-slot={`dish-${meal.id}`}
        data-alt={`${meal.name}, plated and photographed from above in daylight`}
      >
        {hasImage ? (
          <img
            src={meal.imageUrl}
            alt={`${meal.name} in its foil tray`}
            width={1200}
            height={900}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : null}
        <figcaption className="dish__label">{meal.category === 'dessert' ? 'Frozen pudding' : 'Frozen meal'}</figcaption>
        {hasImage ? null : <span className="dish__name dish__name--well" aria-hidden="true">{meal.name}</span>}
      </figure>
      <h4 className={hasImage ? 'dish__name' : 'dish__name visually-hidden'}>{meal.name}</h4>
      <p className="dish__desc">{meal.description}</p>
      {meal.allergens.length > 0 && (
        <p className="dish__allergens">Contains: {meal.allergens.join(', ')}</p>
      )}
      <div className="dish__buy">
        <p className="dish__price">
          <span className="numeral">{fmtZAR(meal.price)}</span>
          {meal.servings ? <span className="dish__size">{meal.servings}</span> : null}
        </p>
        {inOrder === 0 ? (
          <button type="button" className="btn btn--primary" onClick={add} aria-label={`Add to order: ${meal.name}`}>
            Add to order
          </button>
        ) : (
          <div className="stepper" role="group" aria-label={`${meal.name} quantity`}>
            <button type="button" className="stepper__btn" onClick={() => change(inOrder - 1)} aria-label={`Remove one ${meal.name}`}>−</button>
            <span className="stepper__qty" role="status" aria-label={`${inOrder} in your order`}>{inOrder}</span>
            <button type="button" className="stepper__btn" onClick={() => change(inOrder + 1)} disabled={inOrder >= 20} aria-label={`Add one more ${meal.name}`}>+</button>
          </div>
        )}
      </div>
    </li>
  );
}

export default function HomePage({ meals }: { meals: Meal[] }) {
  const mains = meals.filter(m => m.category === 'meal');
  const desserts = meals.filter(m => m.category === 'dessert');

  // The hero offer reads the prices from the menu, so it cannot drift from the rows below.
  const priceOf = (list: Meal[]) => {
    if (list.length === 0) return null;
    const prices = list.map(m => m.price);
    const same = prices.every(p => p === prices[0]);
    return { price: Math.min(...prices), same };
  };
  const mealOffer = priceOf(mains);
  const puddingOffer = priceOf(desserts);
  const menuTitle =
    mains.length > 0 && desserts.length > 0
      ? `${countWord(mains.length)} ${mains.length === 1 ? 'meal' : 'meals'}, ${countWord(desserts.length).toLowerCase()} ${desserts.length === 1 ? 'pudding' : 'puddings'}.`
      : 'The menu';

  const cart = useCartState();
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  const total = cart.reduce((n, i) => n + i.quantity * i.price, 0);

  return (
    <main className={count > 0 ? 'home home--bar' : 'home'}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1 id="hero-title">Pasta and pudding, ready when you are.</h1>
            <p className="lead hero__lead">Frozen home-cooked meals delivered in Pretoria North, Theresapark and across Pretoria.</p>
            <div className="actions">
              <a href="#menu" className="btn btn--primary">See the menu</a>
              <a href={WA_HELLO} target="_blank" rel="noopener noreferrer" className="btn">Order on WhatsApp</a>
            </div>
          </div>
          <div className="offer" role="group" aria-label="Prices">
            {mealOffer && (
              <p className="offer__row">
                <span className="offer__label">{mealOffer.same ? 'Every meal' : 'Meals from'}</span>
                <span className="numeral offer__price offer__price--big">{fmtZAR(mealOffer.price)}</span>
                <span className="offer__names caption">{mains.map(m => m.name).join(', ')}</span>
              </p>
            )}
            {puddingOffer && (
              <p className="offer__row">
                <span className="offer__label">{puddingOffer.same ? 'Every pudding' : 'Puddings from'}</span>
                <span className="numeral offer__price">{fmtZAR(puddingOffer.price)}</span>
                <span className="offer__names caption">{desserts.map(m => m.name).join(', ')}</span>
              </p>
            )}
            <p className="offer__note caption">450 g each, frozen.</p>
          </div>
        </div>
      </section>

      <section className="story section" id="story" aria-labelledby="story-title">
        <div className="container story__grid">
          <h2 id="story-title">Born at a kitchen table.</h2>
          <figure className="story__photo">
            <img
              src="/images/story/sisters.jpg"
              alt="Cornelia Voogt and Edith Hawks, the two sisters behind Manna Kitchen, smiling together at a market stall."
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="story__letter">
            <p>
              Manna started in a hard season. Edith was diagnosed with Guillain-Barré syndrome, and we
              needed a way through the medical bills. So we cooked the food our gran made us.
            </p>
            <p>
              Word got around. People kept coming back, for the food and for the care in it. Today every
              meal still leaves our home kitchen in Theresapark, Pretoria North. Frozen means it is ready
              when you are, on the days cooking is too much.
            </p>
            <p className="story__sign">Cornelia Voogt and Edith Hawks</p>
          </div>
        </div>
      </section>

      <section className="menu band band--clay" id="menu" aria-labelledby="menu-title">
        <div className="container">
          <header className="menu__head">
            <h2 id="menu-title">{menuTitle}</h2>
            <p className="menu__terms">Order at least 2 business days ahead. We quote the delivery fee on WhatsApp.</p>
            <p className="lead">
              Allergies? <a href={WA_ALLERGY} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a> before you order.
            </p>
          </header>
          {mains.length === 0 && desserts.length === 0 && (
            <p className="menu__empty" role="status">
              No meals are available to order right now.{' '}
              <a href={WA_HELLO} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> to ask what we can make.
            </p>
          )}
          {mains.length > 0 && (
            <>
              <h3 className="menu__group">Meals</h3>
              <ul className="dishes">
                {mains.map(m => <MealItem key={m.id} meal={m} />)}
              </ul>
            </>
          )}
          {desserts.length > 0 && (
            <>
              <h3 className="menu__group">Puddings</h3>
              <ul className="dishes">
                {desserts.map(m => <MealItem key={m.id} meal={m} />)}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="who section--l" aria-labelledby="who-title">
        <div className="container">
          <h2 id="who-title" className="visually-hidden">Who it is for</h2>
          <p className="statement">Ready-made meals for older adults at home, people with limited mobility, carers and busy families.</p>
          <p className="lead who__lead">Meals come to your door, so there is no trip to the shops and no full meal to cook.</p>
        </div>
      </section>

      <section className="how section--l" id="how" aria-labelledby="how-title">
        <div className="container how__grid">
          <h2 id="how-title">Frozen meals delivered in Pretoria</h2>
          <div className="how__body">
          <ol className="steps">
            {STEPS.map(s => (
              <li key={s.t}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="how__more">
            <a href="/contact/">Delivery in Pretoria</a>
          </p>
          </div>
        </div>
      </section>

      <section className="faq section--l" id="faq" aria-labelledby="faq-title">
        <div className="container faq__grid">
          <h2 id="faq-title">Before you order</h2>
          <div className="faq__list">
            {FAQ_ITEMS.map(f => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="close band band--ink" aria-labelledby="close-title">
        <div className="container close__grid">
          <h2 id="close-title">Prefer to just chat?</h2>
          <div className="close__body">
            <a className="close__number numeral" href={WA_HELLO} target="_blank" rel="noopener noreferrer">{WA_DISPLAY}</a>
            <p className="lead">Message us on WhatsApp. No app, no login.</p>
            <div className="actions">
              <a href={WA_HELLO} target="_blank" rel="noopener noreferrer" className="btn btn--primary">Order on WhatsApp</a>
              <a href="/cart" className="btn">View your order</a>
            </div>
          </div>
        </div>
      </section>

      {count > 0 && (
        <div className="orderbar" role="region" aria-label="Your order">
          <p className="orderbar__sum">
            <span className="orderbar__count">{count} {count === 1 ? 'item' : 'items'}</span>
            <span className="orderbar__total">{fmtZAR(total)}</span>
          </p>
          <a href="/cart" className="btn btn--primary">Review order</a>
        </div>
      )}
    </main>
  );
}
