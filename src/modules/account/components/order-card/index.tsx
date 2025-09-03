import React from "react"
import { Container, Heading } from "@medusajs/ui"

type OrderCardProps = {
  order?: any
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Container className="p-4 border rounded">
      <Heading level="h3">Order #{order?.display_id || "N/A"}</Heading>
      <p className="text-ui-fg-subtle">Order details will be displayed here.</p>
    </Container>
  )
}

export default OrderCard