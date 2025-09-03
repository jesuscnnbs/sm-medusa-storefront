"use client"

import { ExclamationCircleSolid } from "@medusajs/icons"
import { StoreCart, StoreCustomer } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useState } from "react"

function CartMismatchBanner(props: {
  customer: StoreCustomer
  cart: StoreCart
}) {
  const { customer, cart } = props
  const [isPending, setIsPending] = useState(false)
  const [actionText, setActionText] = useState("Run transfer again")

  if (!customer || !!cart.customer_id) {
    return
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true)
      setActionText("Transferring..")

      await transferCart()
    } catch {
      setActionText("Run transfer again")
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 p-2 mt-2 text-sm text-center text-orange-800 bg-orange-300 small:p-4 small:gap-2">
      <div className="flex flex-col items-center gap-1 small:flex-row small:gap-2">
        <span className="flex items-center gap-1">
          <ExclamationCircleSolid className="inline" />
          Something went wrong when we tried to transfer your cart
        </span>

        <span>·</span>

        <Button
          variant="transparent"
          className="p-0 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent disabled:text-orange-500 text-orange-950"
          size="base"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {actionText}
        </Button>
      </div>
    </div>
  )
}

export default CartMismatchBanner
