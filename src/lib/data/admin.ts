"use server"

import { redirect } from "next/navigation"
import { authenticateAdmin, logoutAdmin, getCurrentAdmin } from "@lib/auth/admin"

export async function adminLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return "Email and password are required"
  }

  try {
    const result = await authenticateAdmin(email, password)
    
    if (result.success) {
      // Redirect to admin dashboard on success - use Spanish as default
      redirect("/es/admin/dashboard")
    } else {
      return result.error || "Login failed"
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return "An unexpected error occurred"
  }
}

export async function createAdminLogoutAction(locale: string) {
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
    return await getCurrentAdmin()
  } catch (error) {
    console.error("Get admin user error:", error)
    return null
  }
}