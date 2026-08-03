export interface OnboardEmployeePayload {
  firstName: string;
  lastName: string;
  role: string;
  departmentId: string;
}

export interface OnboardEmployeeResponse {
  employeeId: string;
  status: string;
}

export interface FacilityBookingPayload {
  roomName: string;
  reservedBy: string;
  startTime: string;
  endTime: string;
}

export interface FacilityBookingResponse {
  reservationId: string;
  status: string;
}

export interface CreatePurchaseOrderPayload {
  vendorId: string;
  totalAmount: number;
}

export interface CreatePurchaseOrderResponse {
  orderId: string;
  status: string;
}

export interface AdjustStockPayload {
  stockItemId: string;
  amount: number;
  reason: string;
}

export interface AdjustStockResponse {
  stockItemId: string;
  newQuantity: number;
  status: string;
}

export interface RegisterAssetPayload {
  assetName: string;
  category: string;
  serialNumber: string;
  purchaseValue: number;
}

export interface RegisterAssetResponse {
  assetId: string;
  status: string;
}
