import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { checkoutSchema, type CheckoutFormData } from '../../lib/validators';
import { useCartState, useCartActions } from '../../lib/cart-context';
import { generateWhatsAppLink, WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { DatePicker } from './DatePicker';

export function CheckoutForm() {
  const items = useCartState();
  const { clearCart } = useCartActions();

  // Calculate order summary
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Initialize form with react-hook-form + zod
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur', // Validate on blur for inline errors
  });

  // Handle form submission
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Generate WhatsApp link with order details
      const whatsappLink = generateWhatsAppLink(
        data.name,
        data.phone,
        data.pickupDate,
        items,
        data.notes
      );

      // Open WhatsApp in new tab
      window.open(whatsappLink, '_blank');

      // Show success toast
      toast.success('Order sent to WhatsApp! Please send the message to complete.');

      // Clear cart after successful submission
      clearCart();

      // User stays on page (no redirect per CONTEXT.md)
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to open WhatsApp. Please try again.');
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty__icon">🛒</div>
        <h2 className="checkout-empty__title">Your cart is empty</h2>
        <p className="checkout-empty__text">
          Add some items to your cart before checking out.
        </p>
        <a href="/" className="checkout-empty__link">
          Browse our menu
        </a>

        <style>{`
          .checkout-empty {
            text-align: center;
            padding: 4rem 2rem;
            max-width: 500px;
            margin: 0 auto;
          }

          .checkout-empty__icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
          }

          .checkout-empty__title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-text-dark, #333);
            margin: 0 0 0.75rem 0;
          }

          .checkout-empty__text {
            font-size: 1rem;
            color: var(--color-text-light, #666);
            margin: 0 0 2rem 0;
          }

          .checkout-empty__link {
            display: inline-block;
            padding: 0.875rem 2rem;
            background: var(--color-primary, #8b5a3c);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
          }

          .checkout-empty__link:hover {
            background: var(--color-text-dark, #6b4423);
          }
        `}</style>
      </div>
    );
  }

  // Checkout form with items
  return (
    <div className="checkout-form">
      {/* Order summary sidebar (desktop right, mobile top) */}
      <div className="checkout-form__summary">
        <div className="checkout-form__summary-card">
          <h2 className="checkout-form__summary-title">Order Summary</h2>

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
            Final price will be confirmed via WhatsApp
          </p>
        </div>
      </div>

      {/* Checkout form */}
      <form onSubmit={handleSubmit(onSubmit)} className="checkout-form__form">
        {/* Name field */}
        <div className="checkout-form__field">
          <label htmlFor="name" className="checkout-form__label">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="checkout-form__input"
            {...register('name')}
          />
          {errors.name && (
            <p className="checkout-form__error">{errors.name.message}</p>
          )}
        </div>

        {/* Phone field */}
        <div className="checkout-form__field">
          <label htmlFor="phone" className="checkout-form__label">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="082 123 4567"
            className="checkout-form__input"
            {...register('phone')}
          />
          <p className="checkout-form__help">
            We'll use this to confirm your order
          </p>
          {errors.phone && (
            <p className="checkout-form__error">{errors.phone.message}</p>
          )}
        </div>

        {/* Pickup Date field */}
        <div className="checkout-form__field">
          <label className="checkout-form__label">
            Pickup Date
          </label>
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
        </div>

        {/* Notes field */}
        <div className="checkout-form__field">
          <label htmlFor="notes" className="checkout-form__label">
            Special Instructions (optional)
          </label>
          <textarea
            id="notes"
            placeholder="Any dietary requirements or special requests?"
            className="checkout-form__textarea"
            rows={4}
            {...register('notes')}
          />
          {errors.notes && (
            <p className="checkout-form__error">{errors.notes.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="checkout-form__submit"
        >
          {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
        </button>

        {/* Fallback contact info */}
        <p className="checkout-form__contact">
          Having trouble? Contact us: <a href={`tel:${WHATSAPP_NUMBER}`}>{WHATSAPP_NUMBER}</a>
        </p>
      </form>

      <style>{`
        .checkout-form {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 3rem;
          align-items: start;
        }

        /* Order Summary */
        .checkout-form__summary {
          order: 2;
          position: sticky;
          top: 1rem;
        }

        .checkout-form__summary-card {
          background: white;
          border: 1px solid var(--color-border, #e5e5e5);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .checkout-form__summary-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-dark, #333);
          margin: 0 0 1.5rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border, #e5e5e5);
        }

        .checkout-form__items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .checkout-form__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkout-form__item-name {
          font-size: 0.875rem;
          color: var(--color-text-dark, #333);
        }

        .checkout-form__item-price {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-dark, #333);
        }

        .checkout-form__summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border, #e5e5e5);
        }

        .checkout-form__summary-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-dark, #333);
        }

        .checkout-form__summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary, #8b5a3c);
        }

        .checkout-form__summary-note {
          font-size: 0.875rem;
          color: var(--color-text-light, #666);
          text-align: center;
          margin: 1rem 0 0 0;
        }

        /* Form */
        .checkout-form__form {
          order: 1;
        }

        .checkout-form__field {
          margin-bottom: 1.5rem;
        }

        .checkout-form__label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-dark, #333);
          margin-bottom: 0.5rem;
        }

        .checkout-form__input,
        .checkout-form__textarea {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid var(--color-border, #e5e5e5);
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          color: var(--color-text-dark, #333);
          transition: border-color 0.2s;
          min-height: 44px;
        }

        .checkout-form__input:focus,
        .checkout-form__textarea:focus {
          outline: none;
          border-color: var(--color-primary, #8b5a3c);
        }

        .checkout-form__textarea {
          resize: vertical;
        }

        .checkout-form__help {
          font-size: 0.875rem;
          color: var(--color-text-light, #666);
          margin: 0.5rem 0 0 0;
          font-style: italic;
        }

        .checkout-form__error {
          font-size: 0.875rem;
          color: #dc2626;
          margin: 0.5rem 0 0 0;
          font-weight: 500;
        }

        .checkout-form__submit {
          width: 100%;
          padding: 1rem;
          background: var(--color-primary, #8b5a3c);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          min-height: 44px;
        }

        .checkout-form__submit:hover:not(:disabled) {
          background: var(--color-text-dark, #6b4423);
        }

        .checkout-form__submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .checkout-form__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkout-form__contact {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-text-light, #666);
          margin-top: 1rem;
        }

        .checkout-form__contact a {
          color: var(--color-primary, #8b5a3c);
          text-decoration: none;
          font-weight: 600;
        }

        .checkout-form__contact a:hover {
          text-decoration: underline;
        }

        /* Mobile responsive - stack vertically */
        @media (max-width: 768px) {
          .checkout-form {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .checkout-form__summary {
            order: 1;
            position: static;
          }

          .checkout-form__form {
            order: 2;
          }
        }
      `}</style>
    </div>
  );
}
