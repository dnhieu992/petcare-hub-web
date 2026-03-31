import type {
  ActivatePayload,
  AuthSuccessResponse,
  LoginPayload,
  LoginResponse,
  PendingActivationContext,
  RegisterPayload,
  RegisterResponse,
  ResendPasscodeResponse,
  VerifyPasscodeResponse,
} from '../types'

type MockUserStatus = 'ACTIVE' | 'PENDING_ACTIVATION'

interface MockTenantRecord {
  id: string
  name: string
  slug: string
}

interface MockUserRecord {
  id: string
  tenantId: string
  email: string
  password: string
  name: string
  role: 'OWNER' | 'MEMBER'
  status: MockUserStatus
}

interface MockPasscodeRecord {
  email: string
  code: string
  expiresAt: number
}

const PASSCODE_TTL_MS = 10 * 60 * 1000
const DEMO_PASSCODE = '123456'

let userSequence = 3
let tenantSequence = 2
let passcodeSequence = Number(DEMO_PASSCODE)

const tenants = new Map<string, MockTenantRecord>([
  [
    't_1',
    {
      id: 't_1',
      name: 'Demo Company',
      slug: 'demo-company',
    },
  ],
  [
    't_2',
    {
      id: 't_2',
      name: 'Pending Company',
      slug: 'pending-company',
    },
  ],
])

const users = new Map<string, MockUserRecord>([
  [
    'owner@demo.com',
    {
      id: 'u_1',
      tenantId: 't_1',
      email: 'owner@demo.com',
      password: 'secret123',
      name: 'Demo Owner',
      role: 'OWNER',
      status: 'ACTIVE',
    },
  ],
  [
    'pending@demo.com',
    {
      id: 'u_2',
      tenantId: 't_2',
      email: 'pending@demo.com',
      password: 'secret123',
      name: 'Pending Owner',
      role: 'OWNER',
      status: 'PENDING_ACTIVATION',
    },
  ],
])

const passcodes = new Map<string, MockPasscodeRecord>([
  [
    'pending@demo.com',
    {
      email: 'pending@demo.com',
      code: DEMO_PASSCODE,
      expiresAt: Date.now() + PASSCODE_TTL_MS,
    },
  ],
])

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function createTenantSlug(companyName: string) {
  return companyName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generateAccessToken(userId: string) {
  return `mock-access-${userId}`
}

function generateRefreshToken(userId: string) {
  return `mock-refresh-${userId}`
}

function generatePasscode() {
  passcodeSequence += 1

  if (passcodeSequence > 999999) {
    passcodeSequence = 100000
  }

  return `${passcodeSequence}`.padStart(6, '0')
}

function buildPendingActivation(user: MockUserRecord): PendingActivationContext {
  const tenant = tenants.get(user.tenantId)

  if (!tenant) {
    throw new Error(`Missing tenant record for user ${user.id}`)
  }

  return {
    status: 'PENDING_ACTIVATION',
    email: user.email,
    userId: user.id,
    tenantId: tenant.id,
    userName: user.name,
    tenantName: tenant.name,
    passcodeHint: passcodes.get(user.email)?.code,
  }
}

function buildAuthSuccess(user: MockUserRecord): AuthSuccessResponse {
  const tenant = tenants.get(user.tenantId)

  if (!tenant) {
    throw new Error(`Missing tenant record for user ${user.id}`)
  }

  return {
    status: 'SUCCESS',
    accessToken: generateAccessToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const email = normalizeEmail(payload.email)
  const user = users.get(email)

  if (!user || user.password !== payload.password) {
    return {
      status: 'ERROR',
      message: 'Invalid credentials',
    }
  }

  if (user.status === 'PENDING_ACTIVATION') {
    return buildPendingActivation(user)
  }

  return buildAuthSuccess(user)
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const email = normalizeEmail(payload.email)

  if (users.has(email)) {
    return {
      status: 'ERROR',
      message: 'An account already exists for this email',
    }
  }

  const tenantId = `t_${tenantSequence++}`
  const userId = `u_${userSequence++}`
  const tenant: MockTenantRecord = {
    id: tenantId,
    name: payload.companyName.trim(),
    slug: createTenantSlug(payload.companyName),
  }
  const user: MockUserRecord = {
    id: userId,
    tenantId,
    email,
    password: payload.password,
    name: payload.fullName.trim(),
    role: 'OWNER',
    status: 'PENDING_ACTIVATION',
  }
  const code = DEMO_PASSCODE

  tenants.set(tenantId, tenant)
  users.set(email, user)
  passcodes.set(email, {
    email,
    code,
    expiresAt: Date.now() + PASSCODE_TTL_MS,
  })

  return buildPendingActivation(user)
}

export async function verifyPasscode(
  payload: ActivatePayload,
): Promise<VerifyPasscodeResponse> {
  const email = normalizeEmail(payload.email)
  const user = users.get(email)
  const passcode = passcodes.get(email)

  if (!user || !passcode) {
    return {
      status: 'ERROR',
      message: 'Invalid or expired code',
    }
  }

  if (passcode.expiresAt < Date.now() || passcode.code !== payload.passcode) {
    return {
      status: 'ERROR',
      message: 'Invalid or expired code',
    }
  }

  user.status = 'ACTIVE'
  users.set(email, user)
  passcodes.delete(email)

  return buildAuthSuccess(user)
}

export async function resendPasscode(
  email: string,
): Promise<ResendPasscodeResponse> {
  const normalizedEmail = normalizeEmail(email)
  const user = users.get(normalizedEmail)

  if (!user || user.status !== 'PENDING_ACTIVATION') {
    return {
      status: 'ERROR',
      message: 'Activation is not available for this account',
    }
  }

  passcodes.set(normalizedEmail, {
    email: normalizedEmail,
    code: generatePasscode(),
    expiresAt: Date.now() + PASSCODE_TTL_MS,
  })

  return {
    status: 'SUCCESS',
  }
}
