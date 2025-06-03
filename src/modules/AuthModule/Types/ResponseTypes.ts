// types/responseType.ts

export type SIGN_UP_RESPONSE = {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LOGIN_RESPONSE = {
  token: string;
  isLoggedIn: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
};
