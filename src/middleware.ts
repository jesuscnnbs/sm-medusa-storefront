import { NextRequest } from "next/server"
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

/**
 * Middleware to handle internationalization only.
 */
export async function middleware(request: NextRequest) {
  const intlMiddleware = createMiddleware({
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
    localePrefix: 'always'
  });

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
