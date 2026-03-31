'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/base'
import { useLogin } from '../hooks/useLogin'
import {
  loginSchema,
  type LoginFormValues,
} from '../validators/login.schema'

export function LoginForm() {
  const { submit, error, isPending } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'owner@demo.com',
      password: 'secret123',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

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

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? 'Logging in...' : 'Login'}
      </Button>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link className="underline" href="/register">
          Create an account
        </Link>
        <a
          className="underline"
          href="#"
          onClick={(event) => event.preventDefault()}
        >
          Forgot password
        </a>
      </div>
    </form>
  )
}
