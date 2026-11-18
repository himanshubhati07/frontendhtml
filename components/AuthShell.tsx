import Link from "next/link";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-soft via-white to-primary-soft px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-1 text-2xl font-extrabold">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white">G</span>
        <span className="text-brand">green</span>
        <span className="text-primary">go</span>
      </Link>
      <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mb-6 text-muted">{subtitle}</p>
        {children}
      </main>
    </div>
  );
}
