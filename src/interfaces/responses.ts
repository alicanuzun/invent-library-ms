// src/interfaces/responses.ts

export interface DataResponse<T> {
    success: boolean;
    data: T;
  }
  
  export interface ErrorResponse {
    success: boolean;
    error: string;
  }
  