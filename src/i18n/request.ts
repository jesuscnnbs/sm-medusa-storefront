import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Wait for the locale to be resolved
  let locale = await requestLocale;
  
  console.log("🌐 Requested Locale: ", locale);
  console.log("🌐 Available Locales: ", routing.locales);

  // Validate that the incoming locale is supported
  const validLocale = routing.locales.includes(locale as any) 
    ? locale 
    : routing.defaultLocale;

  console.log("✅ Resolved Locale: ", validLocale);
  
  try {
    const messages = (await import(`../../messages/${validLocale}.json`)).default;
    
    return {
      messages
    };
  } catch (error) {
    console.error("❌ Failed to load messages for locale:", validLocale, error);
    
    // Fallback to default locale if message loading fails
    const fallbackMessages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
    return {
      messages: fallbackMessages
    };
  }
});