import { twMerge } from "tailwind-merge"

export type BrutalButtonVariant = "primary" | "secondary" | "neutral"
export type BrutalButtonSize = "xs" | "sm" | "md" | "lg"

export const getSizeClasses = (size: BrutalButtonSize, icon: boolean = false) => {
  const sizeClasses = {
    xs: icon ? "p-1 text-[10px]" : "px-2 py-1 text-[10px]",
    sm: icon ? "p-2 text-xs" : "px-4 py-2 text-xs",
    md: icon ? "p-3 text-sm" : "px-6 py-3 text-sm",
    lg: icon ? "p-4 text-base" : "px-8 py-4 text-base",
  }
  return sizeClasses[size]
}

export const getDefaultActiveColor = (variant: BrutalButtonVariant) => {
  const defaultActiveColor = {
    primary: "bg-primary-sm",
    secondary: "bg-secondary-sm",
    neutral: "bg-light-sm",
  }
  return defaultActiveColor[variant]
}

export const getTextColor = (bgColor: string) => {
  if (bgColor.includes("primary") || bgColor.includes("secondary") || bgColor.includes("dark")) {
    return "text-light-sm"
  }
  return "text-dark-sm"
}

export const getVariantClasses = (
  variant: BrutalButtonVariant,
  active: boolean,
  activeBgColor: string,
  activeTextColor: string
) => {
  const variantClasses = {
    primary: active
      ? `border-primary-sm-darker ${activeBgColor} ${activeTextColor}`
      : "bg-light-sm text-primary-sm-darker border-primary-sm-darker",
    secondary: active
      ? `border-dark-sm-darker ${activeBgColor} ${activeTextColor}`
      : "bg-secondary-sm text-light-sm border-dark-sm-darker",
    neutral: active
      ? `border-dark-sm ${activeBgColor} ${activeTextColor}`
      : "bg-white text-dark-sm border-dark-sm",
  }
  return variantClasses[variant]
}

export const getBrutalButtonClasses = (
  variant: BrutalButtonVariant,
  size: BrutalButtonSize,
  active: boolean,
  activeColor?: string,
  icon: boolean = false,
  disabled: boolean = false
) => {
  const activeBgColor = activeColor || getDefaultActiveColor(variant)
  const activeTextColor = getTextColor(activeBgColor)

  return twMerge(
    "rounded-md border-2 font-semibold uppercase transition-all duration-100 -translate-y-0.5 -translate-x-0.5 lg:-translate-y-0 lg:-translate-x-0",
    "group-active:translate-y-0 group-active:translate-x-0 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5",
    getSizeClasses(size, icon),
    getVariantClasses(variant, active, activeBgColor, activeTextColor),
    active && "translate-y-1",
    disabled && "opacity-50 cursor-not-allowed"
  )
}

export const getBrutalButtonWrapperClasses = (variant: BrutalButtonVariant, className?: string) => {
  const backgroundClasses = {
    primary: "bg-primary-sm",
    secondary: "bg-secondary-sm",
    neutral: "bg-dark-sm",
  }

  return twMerge(
    "rounded-md transition-colors group",
    backgroundClasses[variant],
    className
  )
}
