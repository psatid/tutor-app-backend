import { Privilege } from "./index";

export interface PostSignupRequestBody {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  name: string;
  privilege: Privilege;
}
