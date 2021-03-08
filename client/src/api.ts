import axios from "axios";

const api = axios.create({ baseURL: "/api" });

type Registration = EmailRegistration | PasswordRegistration;

interface EmailRegistration {
  method: "email";
  username: string;
  email: string;
}

interface PasswordRegistration {
  method: "password";
  username: string;
  email: string;
  password: string;
  password2?: string;
}

export function register(data: Registration) {
  return api.post("register", data);
}
