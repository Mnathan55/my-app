// app/login/page.tsx
"use client";
import { Suspense } from "react";
import LoginPageInner from "./LoginPageInner";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading Login Page</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
