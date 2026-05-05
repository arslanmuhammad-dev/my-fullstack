import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "./sign-in-form";
import { getCurrentUser } from "@/lib/auth";

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to Personal Project
        </p>
      </div>
      <SignInForm />
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-foreground underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
