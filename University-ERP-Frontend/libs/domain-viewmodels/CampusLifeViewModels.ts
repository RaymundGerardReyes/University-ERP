export interface AssignRoutePayload {
  routeId: string;
  driverId: string;
}

export interface AssignRouteResponse {
  assignmentId: string;
  status: string;
}

export interface ReserveMealPayload {
  studentId: string;
  mealPlanId: string;
  reservationDate: string;
}

export interface ReserveMealResponse {
  reservationId: string;
  status: string;
}
