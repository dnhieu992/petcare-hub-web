'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/base'
import { useRegister } from '../hooks/useRegister'
import {
  registerSchema,
  type RegisterFormValues,
} from '../validators/register.schema'

export function RegisterForm() {
  const { submit, error, isPending } = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: 'Hieu Dao',
      email: '',
      companyName: 'Demo Company',
      password: 'secret123',
      confirmPassword: 'secret123',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
          Full name
        </label>
        <Input id="fullName" {...register('fullName')} />
        {errors.fullName ? (
          <p className="text-sm text-red-600">{errors.fullName.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Work email
        </label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="companyName"
        >
          Company name
        </label>
        <Input id="companyName" {...register('companyName')} />
        {errors.companyName ? (
          <p className="text-sm text-red-600">{errors.companyName.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            Password
          </label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password ? (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="confirmPassword"
          >
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? 'Creating account...' : 'Register'}
      </Button>

      <div className="text-sm text-slate-600">
        <Link className="underline" href="/login">
          Back to login
        </Link>
      </div>
    </form>
  )
}
