export type SIGN_UP_REQUEST = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export type LOGIN_REQUEST = {
  email: string;
  password: string;
};