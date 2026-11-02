
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../../lib/supabase'
import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Utensils,
  AlertCircle,
  CalendarDays,
  Receipt,
  ChevronDown,
} from 'lucide-react'

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

type SelectedFoodOption = {
  groupId: string
  groupName: string
  choiceId: string
  choiceName: string
  price: number
}

type OrderItem = {
  id: number
  product_name: string
  quantity: number
  price: number
  subtotal: number
  selected_options: SelectedFoodOption[] | null
}

type Order = {
  id: number
  order_number: string | null
  customer_name: string
  customer_phone: string
  delivery_address: string
  total_amount: number
  order_status: string
  created_at: string
  order_items: OrderItem[]
}

const formatMoney = (amount: number) =>
  `₦${Number(amount || 0).toLocaleString('en-NG', {
    maximumFractionDigits: 2,
  })}`

const formatDate = (date: string) =>
  new Date(date).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

const getStatusStyle = (status: string | null | undefined) => {
  const value = (status || 'pending')
    .toLowerCase()
    .replace(/_/g, ' ')

  if (['delivered', 'completed'].includes(value)) {
    return {
      background: '#dcfce7',
      color: '#166534',
      icon: CheckCircle2,
    }
  }

  if (['preparing', 'processing'].includes(value)) {
    return {
      background: '#fef3c7',
      color: '#92400e',
      icon: Utensils,
    }
  }

  if (['ready', 'ready for pickup'].includes(value)) {
    return {
      background: '#dbeafe',
      color: '#1d4ed8',
      icon: Package,
    }
  }

  if (['cancelled', 'canceled'].includes(value)) {
    return {
      background: '#fee2e2',
      color: '#991b1b',
      icon: AlertCircle,
    }
  }

  return {
    background: '#ffedd5',
    color: '#9a3412',
    icon: Clock,
  }
}

export default function CustomerDashboard({
  onMyOrders,
  onCustomerOrders,
  onProductManagement,
  onCustomerManagement,
  onLogout,
}: CustomerDashboardProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState('')
  const [expandedOrders, setExpandedOrders] = useState<number[]>([])

  const isAdmin = profile?.role === 'admin'

  const loadDashboard = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setMessage('')

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError

      if (!user) {
        setProfile(null)
        setOrders([])
        setEmail('')
        setMessage('You are not logged in.')
        return
      }

      setEmail(user.email || '')

      const { data: profileData, error: profileError } =
        await supabase
          .from('profiles')
          .select('full_name, phone, address, role')
          .eq('id', user.id)
          .single()

      if (profileError) throw profileError

      setProfile(profileData)

      // Use the same order structure as MyOrders.tsx.
      // Items and customizations are fetched through the
      // existing orders -> order_items relationship.
      setOrdersLoading(true)

      const { data: orderData, error: orderError } =
        await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            customer_name,
            customer_phone,
            delivery_address,
            total_amount,
            order_status,
            created_at,
            order_items (
              id,
              product_name,
              quantity,
              price,
              subtotal,
              selected_options
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

      if (orderError) throw orderError

      setOrders((orderData || []) as Order[])
    } catch (error) {
      console.error('CUSTOMER DASHBOARD ERROR:', error)

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load your dashboard. Please try again.'
      )
    } finally {
      setLoading(false)
      setOrdersLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const refreshDashboard = () => {
      setTimeout(() => {
        if (mounted) {
          void loadDashboard()
        }
      }, 0)
    }

    void loadDashboard()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === 'SIGNED_IN' ||
        event === 'SIGNED_OUT' ||
        event === 'USER_UPDATED'
      ) {
        refreshDashboard()
      }
    })

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
    setOrders([])
    setEmail('')
    onLogout()
  }

  const toggleOrder = (orderId: number) => {
    setExpandedOrders((current) =>
      current.includes(orderId)
        ? current.filter((id) => id !== orderId)
        : [...current, orderId]
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf0] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-yellow-300 border-t-red-600" />
          <p className="font-semibold text-red-800">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
        <AlertCircle
          className="mx-auto mb-3 text-red-600"
          size={36}
        />

        <p className="break-words font-medium text-gray-700">
          {message || 'You are not logged in.'}
        </p>

        <button
          onClick={() => void loadDashboard()}
          className="mt-4 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  const firstName =
    profile.full_name.trim().split(/\s+/)[0] || 'Customer'

  const activeOrders = orders.filter((order) => {
    const status = (order.order_status || 'pending')
      .toLowerCase()
      .replace(/_/g, ' ')

    return ![
      'delivered',
      'completed',
      'cancelled',
      'canceled',
    ].includes(status)
  }).length

  return (
    <main className="min-h-screen bg-[#fffaf0] pb-10">
      {/* Welcome banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-red-600 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-yellow-400/10" />

        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-48 rounded-full bg-yellow-400/10" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          <div className="mt-9 max-w-3xl sm:mt-12">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-yellow-300 sm:text-base">
              Hello, Commissioner of Enjoyment!
            </p>

            <h2 className="break-words text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Welcome back,{' '}
              <span className="text-yellow-400">
                {firstName}
              </span>
              !
            </h2>

            
          </div>

          <div className="mt-7 grid max-w-lg grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3 sm:p-4">
              <ShoppingBag
                className="shrink-0 text-yellow-400"
                size={24}
              />

              <div>
                <p className="text-xs text-red-100">Total Orders</p>
                <p className="text-xl font-extrabold">
                  {orders.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3 sm:p-4">
              <Clock
                className="shrink-0 text-yellow-400"
                size={24}
              />

              <div>
                <p className="text-xs text-red-100">Active Orders</p>
                <p className="text-xl font-extrabold">
                  {activeOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-6 max-w-6xl space-y-8 px-4 sm:mt-8 sm:space-y-10 sm:px-6 lg:px-10">
        {message && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <span className="break-words">{message}</span>

            <button
              onClick={() => void loadDashboard(true)}
              className="shrink-0 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Customer profile */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-red-700">
              <UserRound size={23} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                Your Profile
              </h2>

              <p className="text-sm text-gray-500">
                Your registered account information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ProfileCard
              icon={<UserRound size={21} />}
              label="Full Name"
              value={profile.full_name}
            />

            <ProfileCard
              icon={<Phone size={21} />}
              label="Phone Number"
              value={profile.phone || 'Not provided'}
            />

            <ProfileCard
              icon={<Mail size={21} />}
              label="Email Address"
              value={email || 'Not provided'}
            />

            <ProfileCard
              icon={<MapPin size={21} />}
              label="Delivery Address"
              value={profile.address || 'Not provided'}
            />
          </div>
        </section>

        {/* Order history directly on dashboard */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <ShoppingBag size={23} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  Your Order History
                </h2>

                <p className="text-sm text-gray-500">
                  All your orders, newest first
                </p>
              </div>
            </div>

            <button
              onClick={() => void loadDashboard(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-yellow-300 bg-yellow-100 px-4 py-2.5 text-sm font-bold text-red-800 transition hover:bg-yellow-200 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>

          {ordersLoading ? (
            <div className="rounded-2xl border border-yellow-200 bg-white p-10 text-center">
              <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-yellow-300 border-t-red-600" />

              <p className="text-sm font-medium text-gray-600">
                Loading your orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-yellow-200 bg-white px-5 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-red-700">
                <ShoppingBag size={30} />
              </div>

              <h3 className="text-lg font-extrabold text-gray-900">
                No orders yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Your order history will appear here when you
                place your first order with YELO BISTRO.
              </p>

              <button
                onClick={onMyOrders}
                className="mt-5 rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"
              >
                Open My Orders
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const statusStyle = getStatusStyle(
                  order.order_status
                )

                const StatusIcon = statusStyle.icon
                const isExpanded = expandedOrders.includes(order.id)

                return (
                  <article
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Order header */}
                    <div className="flex flex-col gap-4 border-b border-yellow-100 bg-gradient-to-r from-yellow-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Receipt
                            className="shrink-0 text-red-700"
                            size={18}
                          />

                          <h3 className="break-words font-extrabold text-gray-900">
                            Order{' '}
                            {order.order_number ||
                              `#${order.id}`}
                          </h3>
                        </div>

                        <p className="mt-2 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
                          <CalendarDays
                            className="shrink-0"
                            size={15}
                          />

                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <span
                        className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize"
                        style={{
                          backgroundColor: statusStyle.background,
                          color: statusStyle.color,
                        }}
                      >
                        <StatusIcon size={14} />

                        {(order.order_status || 'pending')
                          .replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h4 className="mb-4 text-sm font-extrabold text-gray-800">
                        Items Ordered
                      </h4>

                      {order.order_items?.length > 0 ? (
                        <div className="space-y-4">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="break-words font-semibold text-gray-800">
                                    {item.product_name}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>

                                <p className="shrink-0 text-sm font-bold text-gray-800">
                                  {formatMoney(item.subtotal)}
                                </p>
                              </div>

                              {/* Selected food customizations */}
                              {item.selected_options &&
                                item.selected_options.length > 0 && (
                                  <div className="ml-3 mt-3 rounded-lg bg-yellow-50 p-3">
                                    <p className="mb-2 text-xs font-bold text-gray-700">
                                      Customizations
                                    </p>

                                    <div className="space-y-2">
                                      {item.selected_options.map(
                                        (option, index) => (
                                          <div
                                            key={`${option.groupId}-${option.choiceId}-${index}`}
                                            className="flex items-start justify-between gap-3 text-xs text-gray-600"
                                          >
                                            <span className="min-w-0 break-words">
                                              <span className="mr-1 text-red-600">
                                                +
                                              </span>

                                              {option.choiceName}
                                            </span>

                                            {Number(option.price) > 0 && (
                                              <span className="shrink-0 font-medium">
                                                {formatMoney(
                                                  option.price
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Item details are unavailable for this order.
                        </p>
                      )}

                      {/* Delivery information */}
                      {order.delivery_address && (
                        <div className="mt-5 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-red-600"
                          />

                          <div className="min-w-0">
                            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                              Delivery Address
                            </p>

                            <p className="break-words">
                              {order.delivery_address}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Order total */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-yellow-200 pt-4">
                        <span className="text-sm font-semibold text-gray-600">
                          Order Total
                        </span>

                        <span className="text-xl font-black text-red-700">
                          {formatMoney(order.total_amount)}
                        </span>
                      </div>

                      {/* Expandable order details */}
                      <button
                        onClick={() => toggleOrder(order.id)}
                        aria-expanded={isExpanded}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm font-bold text-red-800 transition hover:bg-yellow-100"
                      >
                        {isExpanded
                          ? 'Hide Order Details'
                          : 'View Order Details'}

                        <ChevronDown
                          size={17}
                          className={`transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-gray-500">
                              Order Number
                            </p>

                            <p className="mt-1 break-words font-semibold text-gray-800">
                              {order.order_number ||
                                `#${order.id}`}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Customer Name
                            </p>

                            <p className="mt-1 break-words font-semibold text-gray-800">
                              {order.customer_name}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Phone Number
                            </p>

                            <p className="mt-1 break-words font-semibold text-gray-800">
                              {order.customer_phone || 'Not provided'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Order Date
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {/* Admin shortcuts 
        {isAdmin && (
          <section className="border-t border-yellow-200 pt-6">
            <h2 className="mb-4 text-lg font-extrabold text-gray-900">
              Admin Shortcuts
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <AdminButton
                label="Customers' Orders"
                onClick={onCustomerOrders}
              />

              <AdminButton
                label="Customer Management"
                onClick={onCustomerManagement}
              />

              <AdminButton
                label="Product Management"
                onClick={onProductManagement}
              />
            </div>
          </section>
        )}*/}
      </div>
    </main>
  )
}

function ProfileCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-start gap-4 rounded-2xl border border-yellow-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-red-700">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </p>

        <p className="break-words text-sm font-bold text-gray-900 sm:text-base">
          {value}
        </p>
      </div>
    </div>
  )
}

function AdminButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-12 items-center justify-center rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
    >
      {label}
    </button>
  )
}
