import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Middleware de internacionalización
const handleI18nRouting = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always'
});

// Admin routes are now under locale structure: /[locale]/admin
const adminApiRoutes = ['/api/admin'];
const ADMIN_COOKIE_NAME = 'santa_monica_admin_session'

// Simple cookie-based auth check for middleware (edge-compatible)
function hasValidAdminCookie(request: NextRequest): boolean {
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME);
  return !!adminCookie?.value;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for admin API routes (these don't use locale)
  const isAdminApiRoute = adminApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isAdminApiRoute) {
    if (!hasValidAdminCookie(request)) {
      return NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Check for locale-based admin routes: /[locale]/admin
  const localeAdminMatch = pathname.match(/^\/([a-z]{2})\/admin/);
  
  if (localeAdminMatch) {
    const locale = localeAdminMatch[1];
    
    // Only redirect if trying to access protected admin routes (not login page)
    if (!pathname.endsWith('/admin/login') && !hasValidAdminCookie(request)) {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Apply i18n middleware to all routes (including admin routes for proper locale handling)
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - api routes que no sean de admin
     * - archivos estáticos (_next/static)
     * - archivos de imagen, favicon, etc.
     */
    '/((?!api(?!/admin)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
