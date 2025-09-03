import React from "react"
import { Button } from "@medusajs/ui"

type SubmitButtonProps = {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  size?: "small" | "base" | "large"
  isLoading?: boolean
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

const SubmitButton = ({
  children,
  variant = "primary",
  size = "base",
  isLoading = false,
  disabled = false,
  className = "",
  type = "submit",
  onClick,
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      isLoading={isLoading}
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default SubmitButton
export { SubmitButton }