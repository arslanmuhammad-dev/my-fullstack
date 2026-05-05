import {
  ArrowRight,
  Database,
  KeyRound,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="h-4 w-4 text-accent" />
            Personal Project
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center rounded-md bg-foreground text-background px-4 text-sm font-medium hover:bg-foreground/90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Fullstack portfolio project
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
            Manage your work with{" "}
            <span className="text-accent">AI-powered</span> task flow.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Personal Project is a modern productivity app built with Next.js 16,
            TypeScript, Drizzle ORM, JWT auth, and the Vercel AI SDK.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-foreground text-background px-6 text-base font-medium hover:bg-foreground/90"
            >
              Try it free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 border-t">
          <h2 className="text-center text-sm uppercase tracking-widest text-muted-foreground mb-12">
            Stack & features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature
              icon={<Layers className="h-5 w-5" />}
              title="Next.js 16 App Router"
              description="React Server Components, Server Actions, and streaming UI for instant interactions."
            />
            <Feature
              icon={<Database className="h-5 w-5" />}
              title="Type-safe database"
              description="Drizzle ORM with SQLite locally — swap to Postgres for production with one config change."
            />
            <Feature
              icon={<KeyRound className="h-5 w-5" />}
              title="Secure auth"
              description="JWT sessions in HTTP-only cookies, bcrypt password hashing, protected server routes."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="AI assistant"
              description="Streaming chat that knows your tasks, powered by the Vercel AI SDK and AI Gateway."
            />
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Server Actions"
              description="No REST plumbing — mutations call type-safe server functions directly from the UI."
            />
            <Feature
              icon={<Layers className="h-5 w-5" />}
              title="Modern UI"
              description="Tailwind CSS v4, dark mode, accessible components, fully responsive layout."
            />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Built by arslan · Fullstack portfolio demo</p>
          <p>Next.js 16 · TypeScript · Drizzle · AI SDK v6</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-6 bg-card">
      <div className="h-10 w-10 rounded-md bg-muted grid place-items-center text-accent mb-4">
        {icon}
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
