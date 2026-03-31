import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-16">
      <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm md:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Petcare Hub
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Mocked auth flow workspace
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Use the auth pages to walk login, registration, activation, and
            protected dashboard redirects while the backend API is still being
            stubbed out.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-700">Try these routes</p>
          <Link className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700" href="/login">
            /login
          </Link>
          <Link className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700" href="/register">
            /register
          </Link>
          <Link className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700" href="/settings">
            /settings
          </Link>
        </div>
      </section>
    </main>
  )
}
