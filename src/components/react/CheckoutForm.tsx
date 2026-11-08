import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { checkoutSchema, type CheckoutFormData } from '../../lib/validators';
import { useCartState, useCartActions } from '../../lib/cart-context';
import { generateWhatsAppLink, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, PICKUP_ADDRESS } from '../../lib/whatsapp';
import { DatePicker } from './DatePicker';

export default function CheckoutForm() {
  const items = useCartState();
  const { clearCart } = useCartActions();

  // Order handed to WhatsApp (or blocked by the browser): keeps the link so it can be opened again
  const [handoff, setHandoff] = useState<{ link: string; opened: boolean } | null>(null);

  // When the browser blocks WhatsApp, bring the recovery link into view
  const blockedRef = useRef<HTMLDivElement>(null);
  const blocked = !!handoff && !handoff.opened;
  useEffect(() => {
    if (blocked) blockedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [blocked]);

  // Calculate order summary
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Initialize form with react-hook-form + zod
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur', // Validate on blur for inline errors
    defaultValues: { fulfilment: 'delivery' },
  });

  const fulfilment = watch('fulfilment');
  const isDelivery = fulfilment !== 'pickup';

  // Handle form submission
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Generate WhatsApp link with order details
      const whatsappLink = generateWhatsAppLink(
        data.name,
        data.phone,
        data.pickupDate,
        items,
        data.notes,
        data.fulfilment,
        data.fulfilment === 'delivery' ? data.address : undefined
      );

      // Open WhatsApp in new tab
      const opened = window.open(whatsappLink, '_blank');

      if (opened) {
        // The order is only complete once it is sent from WhatsApp, so say that on the page
        clearCart();
        setHandoff({ link: whatsappLink, opened: true });
      } else {
        // Popup blocked: keep the cart and offer the link as a tap
        setHandoff({ link: whatsappLink, opened: false });
        toast.error('Your browser blocked WhatsApp. Use the Open WhatsApp button on this page.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to open WhatsApp. Please try again.');
    }
  };

  // Order handed over: the cart is cleared, so do not show the empty-cart message
  if (handoff && handoff.opened) {
    return (
      <div className="checkout-done" role="status">
        <h2 className="checkout-done__title">One more step: send the message</h2>
        <p className="checkout-done__text">
          WhatsApp has opened with your order filled in. Press send there so we receive it.
          We will reply to confirm your meals and, for delivery, quote the delivery fee.
        </p>
        <a href={handoff.link} target="_blank" rel="noopener noreferrer" className="checkout-done__link">
          Open WhatsApp again
        </a>
        <p className="checkout-done__alt">
          <a href="/#menu">Back to the menu</a>
        </p>

        <style>{`
          .checkout-done {
            max-width: 36rem;
            margin: 0 auto;
            padding: 2rem 0;
          }
          .checkout-done__title {
            font-family: var(--font-display);
            font-size: 1.75rem;
            font-weight: 600;
            color: var(--ink);
            margin: 0 0 0.75rem 0;
          }
          .checkout-done__text {
            font-size: 1.125rem;
            color: var(--ink-soft);
            margin: 0 0 1.5rem 0;
          }
          .checkout-done__link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 3.25rem;
            padding: 0 2rem;
            background: var(--wa-deep);
            color: var(--on-dark);
            border-radius: var(--radius);
            font-size: 1.125rem;
            font-weight: 600;
            transition: background-color 200ms ease, transform 120ms ease;
          }
          .checkout-done__link:hover { background: var(--wa-deeper); }
          .checkout-done__link:active { transform: translateY(1px); }
          .checkout-done__alt { margin: 1rem 0 0; }
          .checkout-done__alt a {
            display: inline-flex;
            align-items: center;
            min-height: var(--tap, 48px);
            color: var(--accent-ink);
            text-decoration: underline;
            text-underline-offset: 0.25em;
          }
          .checkout-done__link:focus-visible,
          .checkout-done__alt a:focus-visible {
            outline: 3px solid var(--accent-ink);
            outline-offset: 3px;
          }
          @media (prefers-reduced-motion: reduce) {
            .checkout-done__link { transition: none; }
          }
        `}</style>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <svg
          className="checkout-empty__icon"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <h2 className="checkout-empty__title">Your cart is empty</h2>
        <p className="checkout-empty__text">
          Add some meals to your cart before checking out.
        </p>
        <a href="/#menu" className="checkout-empty__link">
          Browse the menu
        </a>

        <style>{`
          .checkout-empty {
            text-align: center;
            padding: 3rem 1rem;
            max-width: 32rem;
            margin: 0 auto;
          }

          .checkout-empty__icon {
            margin: 0 auto 1.25rem;
            color: var(--ink-mute);
          }

          .checkout-empty__title {
            font-family: var(--font-display);
            font-size: 1.75rem;
            font-weight: 600;
            color: var(--ink);
            margin: 0 0 0.75rem 0;
          }

          .checkout-empty__text {
            font-size: 1.125rem;
            color: var(--ink-soft);
            margin: 0 0 2rem 0;
          }

          .checkout-empty__link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: var(--tap, 48px);
            padding: 0 2rem;
            background: var(--accent-ink);
            color: var(--on-dark);
            border-radius: var(--radius);
            font-size: 1.125rem;
            font-weight: 600;
            transition: background-color 200ms ease, transform 120ms ease;
          }

          .checkout-empty__link:hover { background: var(--ink); }
          .checkout-empty__link:active { transform: translateY(1px); }
          .checkout-empty__link:focus-visible {
            outline: 3px solid var(--accent-ink);
            outline-offset: 3px;
          }

          @media (prefers-reduced-motion: reduce) {
            .checkout-empty__link { transition: none; }
          }
        `}</style>
      </div>
    );
  }

  const describe = (...ids: Array<string | false | undefined>) => ids.filter(Boolean).join(' ') || undefined;

  // Checkout form with items
  return (
    <div className="checkout-form">
      {/* Order summary sidebar (desktop right, mobile below the form) */}
      <aside className="checkout-form__summary" aria-labelledby="summary-title">
        <h2 className="checkout-form__summary-title" id="summary-title">Order summary</h2>

        <div className="checkout-form__items">
          {items.map((item) => (
            <div key={item.id} className="checkout-form__item">
              <span className="checkout-form__item-name">
                {item.name} × {item.quantity}
              </span>
              <span className="checkout-form__item-price">
                R{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="checkout-form__summary-total">
          <span className="checkout-form__summary-label">Total</span>
          <span className="checkout-form__summary-value">
            R{total.toFixed(2)}
          </span>
        </div>

        <p className="checkout-form__summary-note">
          {isDelivery
            ? 'This total does not include delivery. We quote the delivery fee on WhatsApp.'
            : 'Final price will be confirmed via WhatsApp.'}
        </p>

        {/* Payment Information */}
        <div className="checkout-form__payment">
          <h3 className="checkout-form__payment-title">Payment options</h3>

          <ul className="checkout-form__payment-methods">
            <li>EFT: bank details are shown here and sent with your WhatsApp confirmation</li>
            <li>Cash is accepted when you collect</li>
          </ul>

          <h4 className="checkout-form__banking-title">Banking details</h4>
          <dl className="checkout-form__banking-details">
            <div className="checkout-form__banking-row">
              <dt className="checkout-form__banking-label">Account name</dt>
              <dd className="checkout-form__banking-value">CM VOOGT</dd>
            </div>
            <div className="checkout-form__banking-row">
              <dt className="checkout-form__banking-label">Bank</dt>
              <dd className="checkout-form__banking-value">CAPITEC</dd>
            </div>
            <div className="checkout-form__banking-row">
              <dt className="checkout-form__banking-label">Account type</dt>
              <dd className="checkout-form__banking-value">SAVINGS</dd>
            </div>
            <div className="checkout-form__banking-row">
              <dt className="checkout-form__banking-label">Account number</dt>
              <dd className="checkout-form__banking-value checkout-form__banking-account">2421599047</dd>
            </div>
          </dl>

          <div className="checkout-form__payment-policy">
            <p className="checkout-form__policy-text">
              <strong>Important:</strong> Orders above R200 require proof of payment before we start preparing your order.
            </p>
            <p className="checkout-form__policy-note">
              Please WhatsApp your proof of payment to <strong>{WHATSAPP_DISPLAY}</strong>
            </p>
          </div>
        </div>
      </aside>

      {/* Checkout form */}
      <form onSubmit={handleSubmit(onSubmit)} className="checkout-form__form" noValidate>
        {/* Name field */}
        <div className="checkout-form__field">
          <label htmlFor="name" className="checkout-form__label">
            Your name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className="checkout-form__input"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe(errors.name && 'name-error')}
            {...register('name')}
          />
          {errors.name && (
            <p className="checkout-form__error" id="name-error">{errors.name.message}</p>
          )}
        </div>

        {/* Phone field */}
        <div className="checkout-form__field">
          <label htmlFor="phone" className="checkout-form__label">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="082 123 4567"
            className="checkout-form__input"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describe('phone-help', errors.phone && 'phone-error')}
            {...register('phone')}
          />
          <p className="checkout-form__help" id="phone-help">
            We use this to confirm your order.
          </p>
          {errors.phone && (
            <p className="checkout-form__error" id="phone-error">{errors.phone.message}</p>
          )}
        </div>

        {/* Fulfilment choice */}
        <fieldset className="checkout-form__fieldset">
          <legend className="checkout-form__label">How would you like to get your meals?</legend>
          <div className="checkout-form__options">
            <label className="checkout-form__option">
              <input type="radio" value="delivery" {...register('fulfilment')} />
              <span className="checkout-form__option-text">
                <span className="checkout-form__option-title">Delivery</span>
                <span className="checkout-form__option-sub">In Pretoria. Fee quoted on WhatsApp.</span>
              </span>
            </label>
            <label className="checkout-form__option">
              <input type="radio" value="pickup" {...register('fulfilment')} />
              <span className="checkout-form__option-text">
                <span className="checkout-form__option-title">Pickup</span>
                <span className="checkout-form__option-sub">{PICKUP_ADDRESS}</span>
              </span>
            </label>
          </div>
          {errors.fulfilment && (
            <p className="checkout-form__error">{errors.fulfilment.message}</p>
          )}
        </fieldset>

        {/* Delivery address (delivery only) */}
        {isDelivery && (
          <div className="checkout-form__field">
            <label htmlFor="address" className="checkout-form__label">
              Delivery address
            </label>
            <textarea
              id="address"
              rows={3}
              autoComplete="street-address"
              placeholder="Street, suburb and any gate or complex details"
              className="checkout-form__textarea"
              aria-invalid={errors.address ? true : undefined}
              aria-describedby={describe(errors.address && 'address-error')}
              {...register('address')}
            />
            {errors.address && (
              <p className="checkout-form__error" id="address-error">{errors.address.message}</p>
            )}
          </div>
        )}

        {/* Preferred date field */}
        <fieldset className="checkout-form__fieldset">
          <legend className="checkout-form__label">Preferred date</legend>
          <Controller
            name="pickupDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                error={errors.pickupDate?.message}
              />
            )}
          />
        </fieldset>

        {/* Notes field */}
        <div className="checkout-form__field">
          <label htmlFor="notes" className="checkout-form__label">
            Special instructions (optional)
          </label>
          <textarea
            id="notes"
            placeholder="Anything we should know about your order?"
            className="checkout-form__textarea"
            rows={4}
            {...register('notes')}
          />
          {errors.notes && (
            <p className="checkout-form__error">{errors.notes.message}</p>
          )}
        </div>

        <p className="checkout-form__order-total">
          Total <strong>R{total.toFixed(2)}</strong>
          {isDelivery ? ', excluding the delivery fee' : ''}
        </p>

        {handoff && !handoff.opened && (
          <div className="checkout-form__blocked" role="alert" ref={blockedRef} tabIndex={-1}>
            <p>Your browser blocked WhatsApp from opening. Your order is still here.</p>
            <a
              href={handoff.link}
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-form__blocked-link"
              onClick={() => {
                clearCart();
                setHandoff({ link: handoff.link, opened: true });
              }}
            >
              Open WhatsApp
            </a>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="checkout-form__submit"
        >
          {isSubmitting ? 'Opening WhatsApp' : 'Place order via WhatsApp'}
        </button>

        {/* Fallback contact info */}
        <p className="checkout-form__contact">
          Having trouble? Call us on <a href={`tel:${WHATSAPP_NUMBER}`}>{WHATSAPP_DISPLAY}</a>
        </p>
      </form>

      <style>{`
        .checkout-form {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 400px);
          gap: 3rem;
          align-items: start;
        }

        /* Order Summary */
        .checkout-form__summary {
          order: 2;
          position: sticky;
          top: calc(var(--header-h, 4.5rem) + 1rem);
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 1.5rem;
        }

        .checkout-form__summary-title {
          font-family: var(--font-display);
          font-size: 1.375rem;
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 1.25rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--line);
        }

        .checkout-form__items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .checkout-form__item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
        }

        .checkout-form__item-name {
          font-size: 1rem;
          color: var(--ink);
          min-width: 0;
          overflow-wrap: break-word;
        }

        .checkout-form__item-price {
          font-size: 1rem;
          font-weight: 600;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .checkout-form__summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--line);
        }

        .checkout-form__summary-label {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ink);
        }

        .checkout-form__summary-value {
          font-size: 1.625rem;
          font-weight: 700;
          color: var(--ink);
          font-variant-numeric: tabular-nums;
        }

        .checkout-form__summary-note {
          font-size: 1rem;
          color: var(--ink-soft);
          margin: 0.75rem 0 0 0;
        }

        /* Payment Information */
        .checkout-form__payment {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--line);
        }

        .checkout-form__payment-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 0.75rem 0;
        }

        .checkout-form__payment-methods {
          list-style: disc;
          margin: 0 0 1.25rem 1.25rem;
          font-size: 1rem;
          color: var(--ink);
        }

        .checkout-form__payment-methods li + li { margin-top: 0.25rem; }

        .checkout-form__banking-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 0.5rem 0;
        }

        .checkout-form__banking-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .checkout-form__banking-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
        }

        .checkout-form__banking-label {
          font-size: 1rem;
          color: var(--ink-soft);
        }

        .checkout-form__banking-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--ink);
          text-align: right;
        }

        .checkout-form__banking-account {
          font-size: 1.125rem;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.03em;
        }

        .checkout-form__payment-policy {
          padding-top: 1rem;
          border-top: 1px solid var(--line);
        }

        .checkout-form__policy-text {
          font-size: 1rem;
          color: var(--ink);
          margin: 0 0 0.5rem 0;
          line-height: 1.5;
        }

        .checkout-form__policy-note {
          font-size: 1rem;
          color: var(--ink-soft);
          margin: 0;
          line-height: 1.5;
        }

        /* Form */
        .checkout-form__form {
          order: 1;
          min-width: 0;
        }

        .checkout-form__field,
        .checkout-form__fieldset {
          margin-bottom: 1.75rem;
        }

        .checkout-form__fieldset {
          border: none;
          min-width: 0;
        }

        .checkout-form__label {
          display: block;
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 0.5rem;
          padding: 0;
        }

        .checkout-form__input,
        .checkout-form__textarea {
          width: 100%;
          padding: 0.75rem 0.875rem;
          border: 2px solid var(--field-edge);
          border-radius: var(--radius);
          background: var(--surface);
          font-size: 1.125rem;
          font-family: inherit;
          color: var(--ink);
          min-height: var(--tap, 48px);
        }

        .checkout-form__input::placeholder,
        .checkout-form__textarea::placeholder { color: var(--ink-mute); }

        .checkout-form__input[aria-invalid="true"],
        .checkout-form__textarea[aria-invalid="true"] {
          border-color: var(--danger);
        }

        .checkout-form__input:focus-visible,
        .checkout-form__textarea:focus-visible {
          outline: 3px solid var(--accent-ink);
          outline-offset: 2px;
        }

        .checkout-form__textarea {
          resize: vertical;
        }

        .checkout-form__options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .checkout-form__option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          min-height: 4rem;
          padding: 0.875rem 1rem;
          border: 2px solid var(--field-edge);
          border-radius: var(--radius);
          background: var(--surface);
          cursor: pointer;
        }

        .checkout-form__option:has(input:checked) {
          border-color: var(--accent-ink);
          background: var(--accent-wash);
        }

        .checkout-form__option:has(input:focus-visible) {
          outline: 3px solid var(--accent-ink);
          outline-offset: 2px;
        }

        .checkout-form__option input {
          width: 1.5rem;
          height: 1.5rem;
          margin-top: 0.125rem;
          flex-shrink: 0;
          accent-color: var(--accent-ink);
        }

        .checkout-form__option-text {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 0;
        }

        .checkout-form__option-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ink);
        }

        .checkout-form__option-sub {
          font-size: 1rem;
          color: var(--ink-soft);
          overflow-wrap: break-word;
        }

        .checkout-form__help {
          font-size: 1rem;
          color: var(--ink-soft);
          margin: 0.5rem 0 0 0;
        }

        .checkout-form__error {
          font-size: 1rem;
          color: var(--danger);
          margin: 0.5rem 0 0 0;
          font-weight: 600;
        }

        .checkout-form__blocked {
          margin-bottom: 1.75rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--line);
          color: var(--ink);
        }

        .checkout-form__blocked p { margin: 0 0 0.75rem 0; }

        .checkout-form__blocked-link {
          display: inline-flex;
          align-items: center;
          min-height: var(--tap, 48px);
          padding: 0 1.5rem;
          background: var(--wa-deep);
          color: var(--on-dark);
          border-radius: var(--radius);
          font-weight: 600;
        }

        .checkout-form__blocked-link:hover { background: var(--wa-deeper); }

        .checkout-form__order-total {
          font-size: 1.125rem;
          color: var(--ink);
          margin: 0 0 1rem 0;
        }

        .checkout-form__order-total strong {
          font-size: 1.375rem;
          font-variant-numeric: tabular-nums;
        }

        .checkout-form__submit {
          width: 100%;
          min-height: 3.25rem;
          padding: 0 1rem;
          background: var(--accent-ink);
          color: var(--on-dark);
          border-radius: var(--radius);
          font-size: 1.125rem;
          font-weight: 600;
          transition: background-color 200ms ease, transform 120ms ease;
        }

        .checkout-form__submit:hover:not(:disabled) {
          background: var(--ink);
        }

        .checkout-form__submit:active:not(:disabled) {
          transform: translateY(1px);
        }

        .checkout-form__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkout-form__contact {
          text-align: center;
          font-size: 1rem;
          color: var(--ink-soft);
          margin-top: 1rem;
        }

        .checkout-form__contact a {
          display: inline-block;
          padding: 0.75rem 0;
          color: var(--accent-ink);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 0.25em;
        }

        .checkout-form__submit:focus-visible,
        .checkout-form__blocked-link:focus-visible,
        .checkout-form__contact a:focus-visible {
          outline: 3px solid var(--accent-ink);
          outline-offset: 3px;
        }

        /* Mobile responsive - form first, then the summary and payment details */
        @media (max-width: 768px) {
          .checkout-form {
            grid-template-columns: minmax(0, 1fr);
            gap: 2rem;
          }

          .checkout-form__summary {
            order: 2;
            position: static;
          }

          .checkout-form__form {
            order: 1;
          }

          .checkout-form__options {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .checkout-form__submit { transition: none; }
        }
      `}</style>
    </div>
  );
}
