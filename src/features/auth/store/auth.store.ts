'use client'

import { create } from 'zustand'
import type {
  AuthSession,
  AuthStateSnapshot,
  PendingActivationContext,
} from '../types'
import {
  clearAuthStorage,
  readAuthStorage,
  saveAuthSession,
  savePendingActivation,
} from '../services/auth.storage'

interface AuthStore extends AuthStateSnapshot {
  setSession: (session: AuthSession | null) => void
  setPendingActivation: (
    pendingActivation: PendingActivationContext | null,
  ) => void
  clearAuth: () => void
  hydrateAuth: () => void
  markHydrationComplete: () => void
}

const initialState: AuthStateSnapshot = {
  session: null,
  pendingActivation: null,
  hydrated: false,
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  setSession: (session) => {
    saveAuthSession(session)
    savePendingActivation(null)
    set({ session, pendingActivation: null })
  },
  setPendingActivation: (pendingActivation) => {
    savePendingActivation(pendingActivation)
    saveAuthSession(null)
    set({ pendingActivation, session: null })
  },
  clearAuth: () => {
    clearAuthStorage()
    set({ session: null, pendingActivation: null })
  },
  hydrateAuth: () => {
    const { session, pendingActivation } = readAuthStorage()
    set({
      session,
      pendingActivation,
      hydrated: true,
    })
  },
  markHydrationComplete: () => {
    set({ hydrated: true })
  },
}))

export const authStoreDefaults = initialState
