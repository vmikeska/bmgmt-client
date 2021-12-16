export interface UserRequest {
  firstName: string;
  lastName: string;
  desc: string;
  phone: string;
  mail: string;
  website: string;
  location: LocationSaveResponse;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  desc: string;
  phone: string;
  mail: string;
  website: string;
  location: LocationSaveResponse;
}

export interface LocationSaveResponse {
  text: string;
  coords: number[];
}
