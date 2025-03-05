import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({ locale, requestLocale}) => {
  console.log("🔍 Raw Locale Received: ", locale);
  console.log("🔍 Request Locale Received: ", requestLocale);
  console.log("🌐 Available Locales: ", routing.locales);

  // Try multiple ways to get the locale
  const fallbackLocale =
    locale ||
    await requestLocale || 
    routing.defaultLocale;

  console.log("🕵️ Fallback Locale: ", fallbackLocale);

  const validLocale = routing.locales.includes(fallbackLocale as any) 
    ? fallbackLocale 
    : routing.defaultLocale;

  console.log("✅ Resolved Locale: ", validLocale);
  
  try {
    const messages = (await import(`../../messages/${validLocale}.json`)).default;
    
    return {
      locale: validLocale,
      messages
    };
  } catch (error) {
    console.error("❌ Failed to load messages:", error);
    
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../../messages/${routing.defaultLocale}.json`)).default
    };
  }
});