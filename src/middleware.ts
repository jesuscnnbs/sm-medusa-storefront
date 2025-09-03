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

// Security headers helper
function addSecurityHeaders(response: NextResponse, request: NextRequest): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // XSS protection (legacy but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy for admin routes
  if (request.nextUrl.pathname.includes('/admin')) {
    response.headers.set('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self'; " +
      "font-src 'self'; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    )
  }
  
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for admin API routes (these don't use locale)
  const isAdminApiRoute = adminApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isAdminApiRoute) {
    if (!hasValidAdminCookie(request)) {
      const response = NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      );
      return addSecurityHeaders(response, request);
    }
    return addSecurityHeaders(NextResponse.next(), request);
  }

  // Check for locale-based admin routes: /[locale]/admin
  const localeAdminMatch = pathname.match(/^\/([a-z]{2})\/admin/);
  
  if (localeAdminMatch) {
    const locale = localeAdminMatch[1];
    
    // For login page, bypass i18n middleware and return NextResponse.next()
    if (pathname.endsWith('/admin/login')) {
      return addSecurityHeaders(NextResponse.next(), request);
    }
    
    // Only redirect if trying to access protected admin routes (not login page)
    if (!hasValidAdminCookie(request)) {
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      const response = NextResponse.redirect(loginUrl);
      return addSecurityHeaders(response, request);
    }
    
    // For authenticated admin routes, also bypass i18n since we've already handled locale
    return addSecurityHeaders(NextResponse.next(), request);
  }

  // Apply i18n middleware to all other routes
  const i18nResponse = handleI18nRouting(request);
  return addSecurityHeaders(i18nResponse, request);
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
