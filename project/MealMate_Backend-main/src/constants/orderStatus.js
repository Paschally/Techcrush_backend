export const ORDER_STATUS = {
  PENDING : "pending",
  PAID : "paid",
  ACCEPTED :"accepted",
  PREPARING : "preparing",
  READY: "ready",                           // Typo Error "aready"
  OUT_FOR_DELIVERY : "out_for_delivery",
  DELIVERED : "delivery",
  CANCELLED : "cancelled",
  REJECTED : "rejected"
}

export const PAYMENT_STATUS = {
  PENDING :"pending",    // Typo Error "PRNDING"
  SUCCESS :"success",
  FAILED : "failed"
}

export const DELIVERY_STATUS = {
  REQUESTED : "requested",
  ACCEPTED : "accepted",
  PICKED_UP : "picked_up",
  DELIVERED : "delivered"
}