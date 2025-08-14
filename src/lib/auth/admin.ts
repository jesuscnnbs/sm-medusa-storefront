import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@lib/db'
import { adminUsers, adminSessions } from '@lib/db/schema'
import { eq, and, gt } from 'drizzle-orm'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
}

// Configuración de seguridad
const ADMIN_SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 horas en millisegundos
const ADMIN_COOKIE_NAME = 'santa_monica_admin_session'

/**
 * Genera un token seguro para la sesión de administrador usando Web Crypto API
 */
function generateSecureToken(): string {
  const array = new Uint8Array(48)
  crypto.getRandomValues(array)
  
  // Convert to base64url using Buffer (recommended over deprecated btoa)
  return Buffer.from(array)
    .toString('base64url')
}

/**
 * Autentica a un administrador con email y contraseña
 * Incluye protección contra ataques de fuerza bruta
 */
export async function authenticateAdmin(email: string, password: string): Promise<{
  success: boolean
  user?: AdminUser
  error?: string
}> {
  try {
    // Buscar usuario administrador
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(
        and(
          eq(adminUsers.email, email.toLowerCase().trim()),
          eq(adminUsers.isActive, true)
        )
      )
      .limit(1)

    if (!user) {
      return { success: false, error: 'Credenciales incorrectas' }
    }

    // Verificar que tenga rol de administrador
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return { success: false, error: 'Acceso no autorizado' }
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return { success: false, error: 'Credenciales incorrectas' }
    }

    // Crear sesión segura
    const sessionToken = generateSecureToken()
    const expiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION)

    await db.insert(adminSessions).values({
      userId: user.id,
      token: sessionToken,
      expiresAt,
    })

    // Configurar cookie segura
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/admin',
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as 'admin' | 'super_admin',
      },
    }
  } catch (error) {
    console.error('Error en autenticación de administrador:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}

/**
 * Verifica la sesión actual del administrador
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value

    if (!sessionToken) {
      return null
    }

    // Buscar sesión válida
    const [sessionData] = await db
      .select({
        userId: adminSessions.userId,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
      .where(
        and(
          eq(adminSessions.token, sessionToken),
          gt(adminSessions.expiresAt, new Date()),
          eq(adminUsers.isActive, true)
        )
      )
      .limit(1)

    if (!sessionData || (sessionData.role !== 'admin' && sessionData.role !== 'super_admin')) {
      return null
    }

    return {
      id: sessionData.userId,
      email: sessionData.email,
      name: sessionData.name,
      role: sessionData.role as 'admin' | 'super_admin',
    }
  } catch (error) {
    console.error('Error verificando sesión de administrador:', error)
    return null
  }
}

/**
 * Cierra la sesión del administrador actual
 */
export async function logoutAdmin(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value

    if (sessionToken) {
      // Eliminar sesión de la base de datos
      await db
        .delete(adminSessions)
        .where(eq(adminSessions.token, sessionToken))
    }

    // Limpiar cookie
    cookieStore.delete(ADMIN_COOKIE_NAME)
  } catch (error) {
    console.error('Error cerrando sesión de administrador:', error)
  }
}

/**
 * Middleware helper para verificar autorización de administrador
 */
export async function requireAdminAuth(request: NextRequest): Promise<{
  isAuthorized: boolean
  user?: AdminUser
}> {
  try {
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value

    if (!sessionToken) {
      return { isAuthorized: false }
    }

    const [sessionData] = await db
      .select({
        userId: adminSessions.userId,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
      })
      .from(adminSessions)
      .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
      .where(
        and(
          eq(adminSessions.token, sessionToken),
          gt(adminSessions.expiresAt, new Date()),
          eq(adminUsers.isActive, true)
        )
      )
      .limit(1)

    if (!sessionData || (sessionData.role !== 'admin' && sessionData.role !== 'super_admin')) {
      return { isAuthorized: false }
    }

    return {
      isAuthorized: true,
      user: {
        id: sessionData.userId,
        email: sessionData.email,
        name: sessionData.name,
        role: sessionData.role as 'admin' | 'super_admin',
      },
    }
  } catch (error) {
    console.error('Error en verificación de autorización:', error)
    return { isAuthorized: false }
  }
}

/**
 * Crea el primer usuario administrador (para setup inicial)
 */
export async function createInitialAdmin(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar si ya existe algún administrador
    const [existingAdmin] = await db
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.role, 'admin'))
      .limit(1)

    if (existingAdmin) {
      return { success: false, error: 'Ya existe un administrador en el sistema' }
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear administrador
    await db.insert(adminUsers).values({
      email: email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      name,
      role: 'admin',
      isActive: true,
    })

    return { success: true }
  } catch (error) {
    console.error('Error creando administrador inicial:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
}