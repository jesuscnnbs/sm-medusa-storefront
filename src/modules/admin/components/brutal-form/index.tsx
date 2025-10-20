"use client"

import React from "react"
import { twMerge } from "tailwind-merge"

// Label Component
interface BrutalLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
}

export const BrutalLabel = React.forwardRef<HTMLLabelElement, BrutalLabelProps>(
  ({ children, required, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={twMerge(
          "block mb-2 text-xs font-bold uppercase text-dark-sm",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
    )
  }
)

BrutalLabel.displayName = "BrutalLabel"

// Input Component
interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const BrutalInput = React.forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          "w-full px-3 py-2 border-2 border-dark-sm bg-light-sm rounded-lg",
          "focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px]",
          "focus:shadow-[2px_2px_0px_black] transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    )
  }
)

BrutalInput.displayName = "BrutalInput"

// Textarea Component
interface BrutalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const BrutalTextarea = React.forwardRef<HTMLTextAreaElement, BrutalTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={twMerge(
          "w-full px-3 py-2 border-2 border-dark-sm bg-light-sm rounded-lg",
          "focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px]",
          "focus:shadow-[2px_2px_0px_black] transition-all resize-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    )
  }
)

BrutalTextarea.displayName = "BrutalTextarea"

// Checkbox Component
interface BrutalCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelClassName?: string
}

export const BrutalCheckbox = React.forwardRef<HTMLInputElement, BrutalCheckboxProps>(
  ({ label, labelClassName, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        className={twMerge(
          "w-5 h-5 border-2 border-dark-sm text-primary-sm",
          "focus:ring-0 focus:ring-offset-0 accent-primary-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    )

    if (!label) {
      return checkbox
    }

    return (
      <div className="flex items-center">
        {checkbox}
        <label
          htmlFor={checkboxId}
          className={twMerge(
            "ml-3 text-sm font-bold uppercase text-dark-sm cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)

BrutalCheckbox.displayName = "BrutalCheckbox"

// Container Component
interface BrutalFormContainerProps {
  children: React.ReactNode
  className?: string
}

export const BrutalFormContainer: React.FC<BrutalFormContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "p-6 border-2 rounded-lg border-dark-sm bg-light-sm-lighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
    >
      {children}
    </div>
  )
}

// Alert Component
interface BrutalAlertProps {
  children: React.ReactNode
  variant?: "info" | "warning" | "error" | "success"
  className?: string
}

export const BrutalAlert: React.FC<BrutalAlertProps> = ({
  children,
  variant = "info",
  className,
}) => {
  const variantClasses = {
    info: "border-blue-600 bg-blue-100 text-blue-900 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]",
    warning: "border-amber-600 bg-amber-100 text-amber-900 shadow-[2px_2px_0px_0px_rgba(217,119,6,1)]",
    error: "border-red-600 bg-red-100 text-red-900 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]",
    success: "border-green-600 bg-green-100 text-green-900 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)]",
  }

  return (
    <div
      className={twMerge(
        "p-3 text-sm font-medium border-2 rounded-lg",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}
