import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="py-6 px-4 text-center border-b border-blush/20 bg-white">
        <Link href="/" className="font-serif text-2xl tracking-[0.2em] text-plum font-medium">
          EMBELLISH
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-taupe border-t border-blush/20">
        © {new Date().getFullYear()} EMBELLISH. All rights reserved.
      </footer>
    </div>
  );
}
