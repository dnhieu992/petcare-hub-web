import { ActivateForm } from '@/features/auth/components/ActivateForm'
import { AuthHydrator } from '@/features/auth/components/AuthHydrator'
import { GuestGuard } from '@/features/auth/components/GuestGuard'

export default function ActivatePage() {
  return (
    <AuthHydrator>
      <GuestGuard>
        <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-16">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                Petcare Hub
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Activate your account
              </h1>
              <p className="text-sm text-slate-600">
                Enter the passcode sent to your email to finish first-time
                setup.
              </p>
            </div>
            <ActivateForm />
          </section>
        </main>
      </GuestGuard>
    </AuthHydrator>
  )
}
