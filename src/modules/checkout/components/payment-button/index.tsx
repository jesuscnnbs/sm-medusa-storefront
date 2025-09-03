import React from "react"
import { Button } from "@medusajs/ui"

type PaymentButtonProps = {
  cart?: any
  notReady: boolean
  "data-testid"?: string
}

const PaymentButton = ({ cart, notReady, "data-testid": testId }: PaymentButtonProps) => {
  return (
    <Button 
      disabled={notReady} 
      data-testid={testId}
      className="w-full"
    >
      Place Order
    </Button>
  )
}

export default PaymentButton