export default function SettingsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl px-6 py-16">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-600">
            Auth gating is active on this dashboard shell. After login or
            activation, this route becomes the mocked in-app destination.
          </p>
        </div>
      </section>
    </main>
  )
}
