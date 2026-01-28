import { formatSAST } from './date-utils';
import type { CartItem } from '../types/cart';

export const WHATSAPP_NUMBER = '+27825795210';

/**
 * Generate WhatsApp click-to-chat link with pre-filled order message
 * @param name Customer name
 * @param phone Customer phone (E.164 format)
 * @param pickupDate Selected pickup date
 * @param items Cart items
 * @param notes Optional special instructions
 * @returns WhatsApp URL with encoded message
 */
export function generateWhatsAppLink(
  name: string,
  phone: string,
  pickupDate: Date,
  items: CartItem[],
  notes?: string
): string {
  // Calculate total from cart items
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Format pickup date in SAST
  const formattedDate = formatSAST(pickupDate);

  // Build structured message
  const itemsList = items
    .map(item => `- ${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  let message = `**New Order**
Name: ${name}
Phone: ${phone}
Pickup: ${formattedDate}

Items:
${itemsList}

Total: R${total.toFixed(2)}`;

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
