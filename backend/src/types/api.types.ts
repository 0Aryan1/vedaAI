export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  statusCode: number;
}
