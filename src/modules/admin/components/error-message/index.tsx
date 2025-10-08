"use client"

import { Text } from "@medusajs/ui"

type ErrorMessageProps = {
  error?: string | null
  "data-testid"?: string
}

const ErrorMessage = ({ error, "data-testid": dataTestid }: ErrorMessageProps) => {
  if (!error) {
    return null
  }

  return (
    <div 
      className="flex items-center gap-x-2 p-3 bg-red-50 border border-red-200 rounded-md" 
      data-testid={dataTestid}
    >
      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <Text className="text-red-800 text-sm">{error}</Text>
    </div>
  )
}

export default ErrorMessage