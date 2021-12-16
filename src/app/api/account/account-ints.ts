export interface NewAccountRequest {
  mail: string;
  password: string;
}

export interface LoginRequest {
  mail: string;
  password: string;
}

export interface InfoConfigResponse {
  firstName: string;
  lastName: string;
  mail: string;

  dayWorkingHours: number;
}
