export interface CheckoutItemPayload {
  borrowerId: string;
}

export interface CheckoutItemResponse {
  checkoutId: string;
  dueDate: string;
  status: string;
}
