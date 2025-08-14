import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { requireAdminAuth } from '@lib/auth/admin';
import { routing } from './i18n/routing';

// Middleware de internacionalización
const handleI18nRouting = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always'
});

// Rutas que requieren autenticación de administrador
const adminRoutes = ['/admin'];
const adminApiRoutes = ['/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar rutas de administrador
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route) || pathname.includes(`/admin`)
  );
  
  const isAdminApiRoute = adminApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Manejar rutas de administrador
  if (isAdminRoute || isAdminApiRoute) {
    const { isAuthorized } = await requireAdminAuth(request);
    
    if (!isAuthorized) {
      // Redirigir a login de admin para rutas de admin
      if (isAdminRoute && !pathname.endsWith('/login')) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      
      // Retornar 401 para APIs de admin
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: 'No autorizado' }, 
          { status: 401 }
        );
      }
    }
  }

  // Para rutas de administrador autenticadas, no aplicar i18n
  if ((isAdminRoute || isAdminApiRoute) && pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Aplicar middleware de internacionalización para el resto de rutas
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
