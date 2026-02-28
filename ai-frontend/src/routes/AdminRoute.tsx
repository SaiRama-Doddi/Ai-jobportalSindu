import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

export default function AdminRoute({ children }: Props) {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}