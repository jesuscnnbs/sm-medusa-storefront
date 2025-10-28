"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/admin/components/error-message"
import BrutalButton from "@modules/admin/components/brutal-button"
import { adminLogin } from "@lib/data/admin"
import SantaMonicaIcon from "@modules/common/icons/santa-monica"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HomeIconLink = () => {
  return (
    <LocalizedClientLink href="/" className="relative flex flex-col items-center transition-transform h-36 active:scale-95 hover:scale-105">
      <SantaMonicaIcon size={80} />
      <span className="mt-[2px] mx-2 text-[22px] font-medium uppercase align-middle block text-secondary-sm font-lemonMilk leading-[0.8]">
        Santa
        <br/>
        <span className="text-[17px]">Mónica</span>
      </span>
    </LocalizedClientLink>
  )
}

const AdminLogin = () => {
  const [message, formAction] = useActionState(adminLogin, null)

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-light-sm-lighter bg-doodle">
      <div className="w-full max-w-md">
        {/* Home Icon Link */}
        <div className="flex justify-center">
          <HomeIconLink />
        </div>

        {/* Login Card with Brutal Style */}
        <div className="p-8 border-2 rounded-lg bg-light-sm border-dark-sm shadow-drop">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-3xl font-bold uppercase text-dark-sm font-lemonMilk">
              Admin
            </h2>
            <p className="text-sm text-dark-sm-lighter">
              Sign in to your admin account
            </p>
          </div>

          <form className="space-y-4" action={formAction}>
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

            <div className="pt-2">
              <BrutalButton
                type="submit"
                variant="primary"
                size="lg"
                data-testid="admin-login-button"
              >
                Sign in
              </BrutalButton>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-dark-sm-lighter">
              Need access? Contact system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin