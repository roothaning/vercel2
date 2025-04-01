// Yapılandırma dosyası

// Ortamı kontrol et ve API temel URL'yi belirle
const isDevelopment = import.meta.env.DEV;

// Dev ortamında doğrudan Express API'sini kullan, 
// production ortamında Netlify Functions'ı kullan
export const API_BASE_URL = isDevelopment 
  ? '/api' 
  : '/.netlify/functions/api';

// Telegram ve TON yapılandırması - dışa aktarım
export { TELEGRAM_BOT_API_KEY } from './telegram';
export { OWNER_WALLET_ADDRESS } from './ton';