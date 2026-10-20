import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface CustomerDashboardProps {
  onMyOrders: () => void
  onCustomerOrders: () => void
  onProductManagement: () => void
  onCustomerManagement: () => void
  onLogout: () => void
}

type Profile = {
  full_name: string
  phone: string | null
  address: string | null
  role: string
}

export default function CustomerDashboard({
  onMyOrders,
  onCustomerOrders,
  onProductManagement,
  onCustomerManagement,
  onLogout,
}: CustomerDashboardProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const getProfile = async (userId?: string) => {
      if (!mounted) return

      setLoading(true)
      setMessage('')

      let currentUserId = userId

      if (!currentUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        currentUserId = user?.id
      }

      if (!currentUserId) {
        if (mounted) {
          setProfile(null)
          setMessage('You are not logged in.')
          setLoading(false)
        }

        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address, role')
        .eq('id', currentUserId)
        .single()

      if (error) {
        console.error('PROFILE LOAD ERROR:', error)

        if (mounted) {
          setProfile(null)
          setMessage(error.message)
          setLoading(false)
        }

        return
      }

      if (mounted) {
        setProfile(data)
        setLoading(false)
      }
    }

    getProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('CUSTOMER AUTH EVENT:', event)

        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            getProfile(session?.user?.id)
          }, 0)
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null)
          setMessage('You are not logged in.')
          setLoading(false)
        }

        if (event === 'USER_UPDATED') {
          setTimeout(() => {
            getProfile(session?.user?.id)
          }, 0)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('LOGOUT ERROR:', error)
      setMessage('Unable to log out. Please try again.')
      return
    }

    setProfile(null)
    setMessage('You have been logged out.')

    onLogout()
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p>{message || 'You are not logged in.'}</p>
      </div>
    )
  }

  const isAdmin = profile.role === 'admin'

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <h2>My Account</h2>

        <button
          onClick={handleLogout}
          style={{
            padding: '10px 18px',
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p>
          <strong>Name:</strong> {profile.full_name}
        </p>

        <p>
          <strong>Phone:</strong>{' '}
          {profile.phone || 'Not provided'}
        </p>

        <p>
          <strong>Address:</strong>{' '}
          {profile.address || 'Not provided'}
        </p>

       {/*<p>
          <strong>Account type:</strong> {profile.role}
        </p>*/}
      </div>

      <div
        style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <button
          onClick={onMyOrders}
          style={{
            width: '100%',
            padding: '13px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#111827',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          My Orders
        </button>

        {isAdmin && (
          <>
            <button
              onClick={onCustomerOrders}
              style={{
                width: '100%',
                padding: '13px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Customers Orders
            </button>

            <button
              onClick={onCustomerManagement}
              style={{
                width: '100%',
                padding: '13px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#9333ea',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Customer Management
            </button>

            <button
              onClick={onProductManagement}
              style={{
                width: '100%',
                padding: '13px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#16a34a',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Product Management
            </button>
          </>
        )}
      </div>
    </div>
  )
}

