// src/hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export const useAuth = (requiredAuth: boolean = true) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isTokenValid = token ? !isTokenExpired(token) : false;
    
    if (requiredAuth && (!token || !isTokenValid) && pathname !== "/login") {
      localStorage.removeItem("access_token");
      router.push("/login");
    } else if (!requiredAuth && token && isTokenValid && pathname === "/login") {
      router.push("/");
    }
  }, [pathname, router, requiredAuth]);
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};