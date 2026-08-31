"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/modules/auth/components/login-form";
import { authClient } from "@/modules/auth/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/admin");
    }
  }, [session, router]);

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Welcome back to Rabbit Hole.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-small text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
