'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/base'
import { useActivate } from '../hooks/useActivate'
import {
  activateSchema,
  type ActivateFormValues,
} from '../validators/activate.schema'

export function ActivateForm() {
  const {
    submit,
    resendCode,
    countdown,
    error,
    isPending,
    pendingActivation,
    resendMessage,
  } = useActivate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateFormValues>({
    resolver: zodResolver(activateSchema),
    defaultValues: {
      passcode: pendingActivation?.passcodeHint ?? '',
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(({ passcode }) => submit(passcode))}
    >
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p>Activation email: {pendingActivation?.email ?? 'Unavailable'}</p>
        <p>
          Demo passcode: {pendingActivation?.passcodeHint ?? 'Use the latest sent code'}
        </p>
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="passcode"
        >
          Activation code
        </label>
        <Input id="passcode" inputMode="numeric" {...register('passcode')} />
        {errors.passcode ? (
          <p className="text-sm text-red-600">{errors.passcode.message}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {resendMessage ? (
        <p className="text-sm text-emerald-700">{resendMessage}</p>
      ) : null}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? 'Verifying...' : 'Verify'}
      </Button>

      <Button
        className="w-full"
        disabled={countdown > 0}
        onClick={() => {
          void resendCode()
        }}
        type="button"
        variant="outline"
      >
        {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
      </Button>

      <div className="text-sm text-slate-600">
        <Link className="underline" href="/login">
          Back to login
        </Link>
      </div>
    </form>
  )
}
