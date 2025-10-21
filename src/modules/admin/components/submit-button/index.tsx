"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@medusajs/ui"

type SubmitButtonProps = {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary"
  "data-testid"?: string
}

export const SubmitButton = ({ 
  children, 
  className = "", 
  variant = "primary",
  "data-testid": dataTestid 
}: SubmitButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`${className} ${
        variant === "primary" 
          ? "bg-primary-sm hover:bg-primary-sm-darker text-white" 
          : "bg-secondary-sm hover:bg-secondary-sm-darker text-white"
      }`}
      data-testid={dataTestid}
    >
      {pending ? "Loading..." : children}
    </Button>
  )
}