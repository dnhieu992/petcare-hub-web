export type AuthStatus = 'UNAUTHENTICATED' | 'PENDING_ACTIVATION' | 'AUTHENTICATED'

export type AuthNextStep = 'GO_TO_APP' | 'GO_TO_ACTIVATE' | 'SHOW_ERROR'

export interface AuthCredentials {
  email: string
  password: string
}

export interface LoginPayload extends AuthCredentials {}

export interface RegisterPayload extends AuthCredentials {
  fullName: string
  confirmPassword: string
  companyName: string
}

export interface ActivatePayload {
  email: string
  passcode: string
}

export interface AuthUserSummary {
  id: string
  email: string
  name: string
  role: 'OWNER' | 'MEMBER'
}

export interface AuthTenantSummary {
  id: string
  name: string
  slug: string
}

export interface AuthSession {
  status: 'AUTHENTICATED'
  accessToken: string
  refreshToken: string
  user: AuthUserSummary
  tenant: AuthTenantSummary
}

export interface PendingActivationContext {
  status: 'PENDING_ACTIVATION'
  email: string
  userId: string
  tenantId: string
  userName: string
  tenantName: string
  passcodeHint?: string
}

export interface AuthErrorResponse {
  status: 'ERROR'
  message: string
}

export type AuthSuccessResponse = Omit<AuthSession, 'status'> & {
  status: 'SUCCESS'
}

export interface PendingActivationResponse extends PendingActivationContext {
  status: 'PENDING_ACTIVATION'
}

export type LoginResponse =
  | AuthSuccessResponse
  | PendingActivationResponse
  | AuthErrorResponse

export type RegisterResponse = PendingActivationResponse | AuthErrorResponse

export type VerifyPasscodeResponse =
  | AuthSuccessResponse
  | AuthErrorResponse

export interface ResendPasscodeSuccessResponse {
  status: 'SUCCESS'
}

export type ResendPasscodeResponse =
  | ResendPasscodeSuccessResponse
  | AuthErrorResponse

export interface AuthStateSnapshot {
  session: AuthSession | null
  pendingActivation: PendingActivationContext | null
  hydrated: boolean
}
