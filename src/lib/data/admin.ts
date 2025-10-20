"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { authenticateAdmin, logoutAdmin, getCurrentAdmin } from "@lib/auth/admin"

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return "Email and password are required"
  }

  try {
    // Create a mock request object for Server Actions
    const headersList = await headers()
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as any

    const result = await authenticateAdmin(email, password, mockRequest)
    
    if (result.success) {
      // Redirect to admin dashboard on success - use Spanish as default
      redirect("/es/admin/dashboard")
    } else {
      return result.error || "Login failed"
    }
  } catch (error) {
    // The "NEXT_REDIRECT" error is normal - it means the redirect worked
    // Only log actual errors, not redirect responses
    if (!error?.message?.includes('NEXT_REDIRECT')) {
      console.error("Admin login error:", error)
      return "An unexpected error occurred"
    }
    // Re-throw redirect errors so they work properly
    throw error
  }
}

export async function createAdminLogoutAction(locale: string) {
  "use server"

  return async function adminLogoutAction(formData?: FormData) {
    "use server"

    try {
      await logoutAdmin()
    } catch (error) {
      // The "NEXT_REDIRECT" error is normal - it means the redirect worked
      // Only log actual errors, not redirect responses
      if (!error?.message?.includes('NEXT_REDIRECT')) {
        console.error("Admin logout error:", error)
      }
    }

    // Redirect to login page with correct locale
    redirect(`/${locale}/admin/login`)
  }
}

// Default logout action (fallback to Spanish)
export async function adminLogout(formData?: FormData) {
  try {
    await logoutAdmin()
  } catch (error) {
    // The "NEXT_REDIRECT" error is normal - it means the redirect worked
    // Only log actual errors, not redirect responses
    if (!error?.message?.includes('NEXT_REDIRECT')) {
      console.error("Admin logout error:", error)
    }
  }
  
  // Always redirect after logout attempt
  redirect("/es/admin/login")
}

export async function getAdminUser() {
  try {
    // Create a mock request object for Server Actions
    const headersList = await headers()
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as any

    return await getCurrentAdmin(mockRequest)
  } catch (error) {
    console.error("Get admin user error:", error)
    return null
  }
}