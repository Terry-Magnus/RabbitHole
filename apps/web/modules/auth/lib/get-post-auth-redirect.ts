const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SessionResponse {
  user: { role: "USER" | "ADMIN" };
}

// Better Auth's client doesn't type the custom `role` additionalField
// (confirmed directly — authClient.signIn.email()'s resolved `data.user`
// has no `role` in its inferred type), the same reason
// app/admin/layout.tsx already hand-types its own SessionResponse for the
// server-side session check. A plain fetch against get-session here is
// simpler than wiring up Better Auth's inferAdditionalFields client plugin
// across this project's split frontend/backend boundary for one field.
export async function getPostAuthRedirect(): Promise<"/admin" | "/"> {
  const response = await fetch(`${API_URL}/api/auth/get-session`, {
    credentials: "include",
  });

  const session = response.ok ? ((await response.json()) as SessionResponse | null) : null;

  // Only an admin has anywhere useful to go inside /admin — everyone else
  // lands on the homepage, where their Continue Learning section (and a
  // link to /library) is now the actual next step.
  return session?.user.role === "ADMIN" ? "/admin" : "/";
}
