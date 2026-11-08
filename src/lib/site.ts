import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY, PICKUP_ADDRESS } from './whatsapp';

// One source for the facts that appear on more than one page.
export const SITE_URL = 'https://manna.voogt.co.za';
export const BUSINESS_NAME = 'Manna Kitchen';

export const WA_DISPLAY = WHATSAPP_DISPLAY;
export const WA_DIGITS = WHATSAPP_NUMBER.replace('+', '');
export const WA_BASE = `https://wa.me/${WA_DIGITS}`;
export const waLink = (text?: string) => (text ? `${WA_BASE}?text=${encodeURIComponent(text)}` : WA_BASE);
export const WA_HELLO = waLink('Hi Manna, I would like to order frozen meals.');
export const WA_ALLERGY = waLink('Hi Manna, I have an allergy question before I order.');

export const PICKUP = PICKUP_ADDRESS; // 71 Springbok St, Theresapark
export const ADDRESS = {
  street: '71 Springbok St',
  suburb: 'Theresapark',
  area: 'Pretoria North',
  region: 'Gauteng',
  postalCode: '0155',
  country: 'ZA',
};
export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.suburb}, ${ADDRESS.area}, ${ADDRESS.postalCode}`;

// Map lookups of the address (no API key). Eyeball the pin before launch.
const MAP_QUERY = '71+Springbok+Street+Theresapark+Pretoria';
export const MAPS_EMBED = 'https://www.google.com/maps?q=71+Springbok+Street,+Theresapark,+Pretoria&output=embed';
export const MAPS_SEARCH = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;
export const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

export const FOUNDERS = ['Cornelia Voogt', 'Edith Hawks'] as const;
