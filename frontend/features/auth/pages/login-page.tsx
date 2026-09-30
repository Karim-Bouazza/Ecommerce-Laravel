"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { useMe } from "@/features/auth/hooks/use-me";

export function LoginPage() {
  const router = useRouter();
  const { data: me, isPending } = useMe();

  React.useEffect(() => {
    if (!isPending && me) {
      router.replace("/admin");
    }
  }, [isPending, me, router]);

  if (isPending || me) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
