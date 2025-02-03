/// <reference types="@testing-library/jest-dom" />

// src/__tests__/auth.test.tsx
import { render, screen } from '@testing-library/react'
//import { supabase } from '@/lib/supabase'
import AuthComponent from '@/components/Auth'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
        }
    }
}))

// Mock supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } }
            }))
        }
    }
}))

describe('Auth Component', () => {
    it('renders auth form', () => {
        render(<AuthComponent />)
        expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    })
})