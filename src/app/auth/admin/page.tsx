// app/login/page.tsx
"use client";
import { Suspense } from "react";
import AdminLogin from "./AdminLogin"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading Login Page</div>}>
        <AdminLogin />
    </Suspense>
  );
}