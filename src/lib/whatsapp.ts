import { formatLocalDate } from './date-utils';
import type { CartItem } from '../types/cart';
import { priceCart, COMBO_SIZE } from './pricing';

export const WHATSAPP_NUMBER = '+27633510528';
export const WHATSAPP_DISPLAY = '+27 63 351 0528';
export const PICKUP_ADDRESS = '71 Springbok St, Theresapark';

/**
 * Generate WhatsApp click-to-chat link with pre-filled order message
 * @param name Customer name
 * @param phone Customer phone (E.164 format)
 * @param preferredDate Selected preferred date (delivery or pickup)
 * @param items Cart items
 * @param notes Optional special instructions
 * @param fulfilment 'delivery' (address required) or 'pickup' at the kitchen
 * @param address Delivery address (ignored for pickup)
 * @returns WhatsApp URL with encoded message
 */
export function generateWhatsAppLink(
  name: string,
  phone: string,
  preferredDate: Date,
  items: CartItem[],
  notes?: string,
  fulfilment: 'delivery' | 'pickup' = 'pickup',
  address?: string
): string {
  // Calculate total from cart items
  const { subtotal, discount, total, combos } = priceCart(items);

  // Format the chosen calendar day (the picker returns local midnight)
  const formattedDate = formatLocalDate(preferredDate);

  // Build structured message
  const itemsList = items
    .map(item => `- ${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  // Collapse a multi-line address onto one line so the message stays readable
  const addressLine = (address ?? '')
    .split(/\r?\n/)
    .map(part => part.trim().replace(/,+$/, ''))
    .filter(Boolean)
    .join(', ');

  const fulfilmentLine =
    fulfilment === 'delivery'
      ? `Delivery to: ${addressLine} (fee confirmed on WhatsApp)`
      : `Pickup: ${PICKUP_ADDRESS}`;

  const discountLines =
    discount > 0
      ? `\nSubtotal: R${subtotal.toFixed(2)}\nCombo discount (${combos} x ${COMBO_SIZE} meals): -R${discount.toFixed(2)}`
      : '';

  const totalLine =
    fulfilment === 'delivery'
      ? `Total: R${total.toFixed(2)} (excludes delivery fee)`
      : `Total: R${total.toFixed(2)}`;

  let message = `*New Order*
Name: ${name}
Phone: ${phone}
${fulfilmentLine}
Preferred date: ${formattedDate}

Items:
${itemsList}${discountLines}

${totalLine}`;

  // Add notes if provided
  if (notes && notes.trim()) {
    message += `\n\nNotes: ${notes.trim()}`;
  }

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Remove + from number for wa.me URL format
  const numberForUrl = WHATSAPP_NUMBER.replace('+', '');

  // Return WhatsApp click-to-chat URL
  return `https://wa.me/${numberForUrl}?text=${encodedMessage}`;
}
