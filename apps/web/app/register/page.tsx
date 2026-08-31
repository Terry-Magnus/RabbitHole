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
import { RegisterForm } from "@/modules/auth/components/register-form";
import { authClient } from "@/modules/auth/lib/auth-client";

export default function RegisterPage() {
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Join Rabbit Hole to save your progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RegisterForm />
          <p className="text-small text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
