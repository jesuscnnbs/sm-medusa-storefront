"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Link } from "../../../../i18n/navigation"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {

  return (
    <Link href={`/${href}`} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
