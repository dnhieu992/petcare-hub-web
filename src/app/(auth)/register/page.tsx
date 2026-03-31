import { AuthHydrator } from '@/features/auth/components/AuthHydrator'
import { GuestGuard } from '@/features/auth/components/GuestGuard'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthHydrator>
      <GuestGuard>
        <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-16">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Petcare Hub
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Create your account
              </h1>
              <p className="text-sm text-slate-600">
                Self-registration creates a new company and starts the owner in
                pending activation.
              </p>
            </div>
            <RegisterForm />
          </section>
        </main>
      </GuestGuard>
    </AuthHydrator>
  )
}
