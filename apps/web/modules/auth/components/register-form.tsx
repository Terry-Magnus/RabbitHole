"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "../lib/auth-client";

const registerFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  // Matches Better Auth's default minPasswordLength (8) — the backend is
  // still the source of truth for enforcement.
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function handleSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);
    const { error } = await authClient.signUp.email(values);
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Registration failed");
      return;
    }

    router.push("/admin");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isSubmitting}>
          Create account
        </Button>
      </form>
    </Form>
  );
}
