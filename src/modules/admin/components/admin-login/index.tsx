"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { adminLogin } from "@lib/data/admin"

const AdminLogin = () => {
  const [message, formAction] = useActionState(adminLogin, null)

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Santa Monica Admin
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <div className="space-y-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              data-testid="admin-email-input"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              data-testid="admin-password-input"
            />
          </div>

          <ErrorMessage error={message} data-testid="admin-login-error" />

          <div>
            <SubmitButton 
              className="relative flex justify-center w-full px-4 py-2 group"
              data-testid="admin-login-button"
            >
              Sign in to Admin Panel
            </SubmitButton>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need access? Contact system administrator
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin