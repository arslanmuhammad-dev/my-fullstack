import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link href="/" className="font-semibold tracking-tight">
            Practice
          </Link>
        </div>
      </header>
      <main className="flex-1 grid place-items-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
