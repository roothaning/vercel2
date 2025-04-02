// Yapılandırma dosyası

// Ortamı kontrol et ve API temel URL'yi belirle
const isDevelopment = import.meta.env.DEV;

// Dev ortamında doğrudan Express API'sini kullan, 
// production ortamında doğrudan /api'yi kullan (Vercel routing)
export const API_BASE_URL = '/api';

// Telegram ve TON yapılandırması - dışa aktarım
export { TELEGRAM_BOT_API_KEY } from './telegram';
export { OWNER_WALLET_ADDRESS } from './ton';