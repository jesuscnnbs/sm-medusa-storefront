import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {headers} from 'next/headers';
 
export default getRequestConfig(async () => {
  // For Next.js 15, we need to await headers and extract locale manually
  const headersList = await headers();
  let locale = headersList.get('x-next-intl-locale') || routing.defaultLocale;
  
  //console.log("🌐 Requested Locale: ", locale);
  //console.log("🌐 Available Locales: ", routing.locales);

  // Validate that the incoming locale is supported
  const validLocale = routing.locales.includes(locale as any) 
    ? locale 
    : routing.defaultLocale;

  //console.log("✅ Resolved Locale: ", validLocale);
  
  try {
    const messages = (await import(`../../messages/${validLocale}.json`)).default;
    
    return {
      locale: validLocale,
      messages
    };
  } catch (error) {
    //console.error("❌ Failed to load messages for locale:", validLocale, error);
    
    // Fallback to default locale if message loading fails
    const fallbackMessages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
    return {
      locale: routing.defaultLocale,
      messages: fallbackMessages
    };
  }
});