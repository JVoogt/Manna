import { comboOffer, COMBO_SIZE } from './pricing';

const offer = comboOffer();
const comboAnswer = offer
  ? `Yes. Any ${COMBO_SIZE} meals together cost R${offer.combo} instead of R${offer.full}. Every full set of ${COMBO_SIZE} in your order gets this price. Puddings are not part of the combo.`
  : `Yes. Every full set of ${COMBO_SIZE} meals in your order gets a combo price. Puddings are not part of the combo.`;

// Single source for the FAQ: the home page renders it and index.astro turns it into FAQPage JSON-LD.
export const FAQ_ITEMS = [
  {
    q: 'How do I place an order?',
    a: 'Add meals to your order here, then send it to us on WhatsApp. We reply to confirm everything with you.',
  },
  {
    q: 'Do you deliver in Pretoria North?',
    a: 'We deliver locally in Pretoria. The delivery fee is quoted on WhatsApp when you order.',
  },
  {
    q: 'How far ahead must I order?',
    a: 'At least 2 business days ahead. We confirm the exact date with you on WhatsApp.',
  },
  {
    q: 'Is there a discount for ordering more?',
    a: comboAnswer,
  },
  {
    q: 'How do I pay?',
    a: 'By EFT, or with cash when you collect.',
  },
  {
    q: 'What about allergies?',
    a: 'Please ask us on WhatsApp before you order, and tell us about any allergy.',
  },
  {
    q: 'Can I order for my mother or father?',
    a: 'Yes. When you send the order, tell us the name and address of the person receiving the meals.',
  },
] as const;
