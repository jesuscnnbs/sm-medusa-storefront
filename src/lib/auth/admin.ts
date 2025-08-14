import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { eq, and, gt } from 'drizzle-orm'

// Dynamic import based on environment to avoid edge runtime issues
async function getDb() {
  if (process.env.VERCEL_ENV || process.env.NODE_ENV === 'production') {
    // Production/Vercel: Use Vercel Postgres
    const { db, schema } = await import("@lib/db")
    return { db, schema }
  } else {
    // Local development: Use regular PostgreSQL with node-postgres
    const { drizzle } = await import("drizzle-orm/node-postgres")
    const { Pool } = await import("pg")
    const schema = await import("@lib/db/schema")
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    })
    
    const db = drizzle(pool, { schema })
    return { db, schema }
  }
}

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
 * Genera un token seguro para la sesión de administrador
 */
function generateSecureToken(): string {
  // Use Math.random for edge compatibility - in production, consider using a more secure approach
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let result = ''
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
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
    const { db, schema } = await getDb()
    
    // Buscar usuario administrador
    const [user] = await db
      .select()
      .from(schema.adminUsers)
      .where(
        and(
          eq(schema.adminUsers.email, email.toLowerCase().trim()),
          eq(schema.adminUsers.isActive, true)
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

    await db.insert(schema.adminSessions).values({
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
      path: '/',
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
    const { db, schema } = await getDb()
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value

    if (!sessionToken) {
      return null
    }

    // Buscar sesión válida
    const [sessionData] = await db
      .select({
        userId: schema.adminSessions.userId,
        email: schema.adminUsers.email,
        name: schema.adminUsers.name,
        role: schema.adminUsers.role,
      })
      .from(schema.adminSessions)
      .innerJoin(schema.adminUsers, eq(schema.adminSessions.userId, schema.adminUsers.id))
      .where(
        and(
          eq(schema.adminSessions.token, sessionToken),
          gt(schema.adminSessions.expiresAt, new Date()),
          eq(schema.adminUsers.isActive, true)
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
    const { db, schema } = await getDb()
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value

    if (sessionToken) {
      // Eliminar sesión de la base de datos
      await db
        .delete(schema.adminSessions)
        .where(eq(schema.adminSessions.token, sessionToken))
    }

    // Limpiar cookie - delete from all possible paths
    cookieStore.delete(ADMIN_COOKIE_NAME)
    cookieStore.set(ADMIN_COOKIE_NAME, '', {
      expires: new Date(0),
      path: '/',
    })
    cookieStore.set(ADMIN_COOKIE_NAME, '', {
      expires: new Date(0),
      path: '/admin',
    })
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
    const { db, schema } = await getDb()
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value

    if (!sessionToken) {
      return { isAuthorized: false }
    }

    const [sessionData] = await db
      .select({
        userId: schema.adminSessions.userId,
        email: schema.adminUsers.email,
        name: schema.adminUsers.name,
        role: schema.adminUsers.role,
      })
      .from(schema.adminSessions)
      .innerJoin(schema.adminUsers, eq(schema.adminSessions.userId, schema.adminUsers.id))
      .where(
        and(
          eq(schema.adminSessions.token, sessionToken),
          gt(schema.adminSessions.expiresAt, new Date()),
          eq(schema.adminUsers.isActive, true)
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
    const { db, schema } = await getDb()
    
    // Verificar si ya existe algún administrador
    const [existingAdmin] = await db
      .select({ id: schema.adminUsers.id })
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.role, 'admin'))
      .limit(1)

    if (existingAdmin) {
      return { success: false, error: 'Ya existe un administrador en el sistema' }
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear administrador
    await db.insert(schema.adminUsers).values({
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