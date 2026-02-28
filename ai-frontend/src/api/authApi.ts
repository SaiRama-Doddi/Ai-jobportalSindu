import axios from "axios";
import type { LoginRequest, AuthResponse, RegisterRequest } from "../types/auth";

const API = axios.create({
  baseURL: "http://localhost:8081/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = (data: LoginRequest) =>
  API.post<AuthResponse>("/login", data);

export const register = (data: RegisterRequest) =>
  API.post("/register", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
