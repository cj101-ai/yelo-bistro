
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ShoppingCart,
  Utensils,
  LogOut,
  UserRound,
  RefreshCw,
  UsersRound,
  CalendarCheck,
  Wallet,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'

import { supabase } from '../../lib/supabase'
import MyOrders from '../dashboard/MyOrders'
import CustomerManagement from '../admin/CustomerManagement'
import AdminOrders from '../admin/AdminOrders'
import AdminProducts from '../admin/AdminProducts'
import AdminManagement from '../admin/AdminManagement'

type AdminDashboardProps = {
  onLogout: () => void
}

type DashboardStats = {
  registeredCustomers: number
  todayOrders: number
  totalOrders: number
  totalRevenue: number
}

type AdminPage =
  | 'dashboard'
  | 'my-orders'
  | 'customer-management'
  | 'customer-orders'
  | 'product-management'
  | 'admin-management'

type AdminPermission = Exclude<AdminPage, 'admin-management'>

type NavigationItem = {
  id: AdminPage
  label: string
  icon: typeof LayoutDashboard
}

const navigation: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my-orders', label: 'My Orders', icon: ClipboardList },
  {
    id: 'customer-management',
    label: 'Customer Management',
    icon: Users,
  },
  {
    id: 'customer-orders',
    label: "Customers' Orders",
    icon: ShoppingCart,
  },
  {
    id: 'product-management',
    label: 'Product Management',
    icon: Utensils,
  },
  {
    id: 'admin-management',
    label: 'Setting',
    icon: ShieldCheck,
  },
]

const emptyStats: DashboardStats = {
  registeredCustomers: 0,
  todayOrders: 0,
  totalOrders: 0,
  totalRevenue: 0,
}

const permissionLabels: Record<AdminPermission, string> = {
  dashboard: 'Dashboard',
  'my-orders': 'My Orders',
  'customer-management': 'Customer Management',
  'customer-orders': "Customers' Orders",
  'product-management': 'Product Management',
}

export default function AdminDashboard({
  onLogout,
}: AdminDashboardProps) {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard')
  const [permissions, setPermissions] = useState<AdminPermission[]>([])
  const [isMainAdmin, setIsMainAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [accessError, setAccessError] = useState('')
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [loadingStats, setLoadingStats] = useState(false)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [statsError, setStatsError] = useState('')

  const hasPermission = useCallback(
    (permission: AdminPermission) =>
      isMainAdmin || permissions.includes(permission),
    [isMainAdmin, permissions],
  )

  const visibleNavigation = useMemo(
    () =>
      navigation.filter((item) =>
        item.id === 'admin-management'
          ? isMainAdmin
          : hasPermission(item.id),
      ),
    [hasPermission, isMainAdmin],
  )

  // Verify the signed-in user and load assigned permissions.
  useEffect(() => {
    let cancelled = false

    const loadAccess = async () => {
      setAuthLoading(true)
      setAccessError('')

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) throw authError

        if (!user) {
          throw new Error(
            'Your session could not be verified. Please sign in again.',
          )
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) throw profileError

        if (!profile) {
          throw new Error('Your account profile could not be found.')
        }

        if (profile.role === 'admin') {
          if (cancelled) return

          setIsMainAdmin(true)
          setPermissions([
            'dashboard',
            'my-orders',
            'customer-management',
            'customer-orders',
            'product-management',
          ])
          setActivePage('dashboard')
          return
        }

        if (profile.role !== 'sub_admin') {
          throw new Error(
            'This account does not have administrator access.',
          )
        }

        const { data: assigned, error: permissionError } = await supabase
          .from('admin_permissions')
          .select('permission')
          .eq('profile_id', user.id)

        if (permissionError) throw permissionError

        const allowed = (assigned ?? [])
          .map((item) => item.permission)
          .filter(
            (permission): permission is AdminPermission =>
              permission !== 'admin-management' &&
              navigation.some(
                (item) =>
                  item.id !== 'admin-management' &&
                  item.id === permission,
              ),
          )

        if (cancelled) return

        setIsMainAdmin(false)
        setPermissions(allowed)

        const firstAllowed = navigation.find(
          (item) =>
            item.id !== 'admin-management' &&
            allowed.includes(item.id),
        )

        if (firstAllowed) setActivePage(firstAllowed.id)
      } catch (error) {
        console.error('Admin access error:', error)

        if (!cancelled) {
          setAccessError(
            error instanceof Error
              ? error.message
              : 'Unable to verify administrator permissions.',
          )
        }
      } finally {
        if (!cancelled) setAuthLoading(false)
      }
    }

    void loadAccess()

    return () => {
      cancelled = true
    }
  }, [])

  // Dashboard statistics require broader permissions.
  const canLoadStatistics =
    isMainAdmin ||
    (permissions.includes('dashboard') &&
      permissions.includes('customer-management') &&
      permissions.includes('customer-orders'))

  // The pending badge only requires Customers' Orders permission.
  const canLoadPendingOrders =
    isMainAdmin || permissions.includes('customer-orders')

  // Load the badge count independently of the dashboard statistics.
  const loadPendingOrders = useCallback(async () => {
    if (authLoading || !canLoadPendingOrders) return

    const { count, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('order_status', 'pending')

    if (error) {
      console.error('Pending orders badge error:', error)
      return
    }

    setPendingOrders(count ?? 0)
  }, [authLoading, canLoadPendingOrders])

  const loadDashboardStats = useCallback(async () => {
    if (authLoading || !canLoadStatistics) return

    setStatsError('')

    try {
      const customersRequest = supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'customer')

      const totalOrdersRequest = supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })

      const now = new Date()

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      )

      const startOfNextDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      )

      const todayOrdersRequest = supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', startOfNextDay.toISOString())

      const revenueRequest = supabase
        .from('orders')
        .select('total_amount')
        .eq('order_status', 'delivered')

      const [
        customersResult,
        totalOrdersResult,
        todayOrdersResult,
        revenueResult,
      ] = await Promise.all([
        customersRequest,
        totalOrdersRequest,
        todayOrdersRequest,
        revenueRequest,
      ])

      const errors = [
        customersResult.error,
        totalOrdersResult.error,
        todayOrdersResult.error,
        revenueResult.error,
      ].filter(Boolean)

      if (errors.length > 0) {
        console.error('Dashboard statistics error:', errors)

        setStatsError(
          'Some statistics could not be loaded. Check your database permissions and try again.',
        )
        return
      }

      const revenue = (revenueResult.data ?? []).reduce(
        (total, order) => total + Number(order.total_amount || 0),
        0,
      )

      setStats({
        registeredCustomers: customersResult.count ?? 0,
        todayOrders: todayOrdersResult.count ?? 0,
        totalOrders: totalOrdersResult.count ?? 0,
        totalRevenue: revenue,
      })
    } catch (error) {
      console.error('Unexpected dashboard error:', error)

      setStatsError(
        'Unable to load dashboard statistics. Please try again.',
      )
    } finally {
      setLoadingStats(false)
    }
  }, [authLoading, canLoadStatistics])

  // Independently refresh the pending badge for every authorized user.
  useEffect(() => {
    if (authLoading || !canLoadPendingOrders) return

    void loadPendingOrders()

    const refreshInterval = window.setInterval(() => {
      void loadPendingOrders()
    }, 60_000)

    const handleFocus = () => {
      void loadPendingOrders()
    }

    window.addEventListener('focus', handleFocus)

    const channel = supabase
      .channel('pending-orders-badge-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          void loadPendingOrders()
        },
      )
      .subscribe()

    return () => {
      window.clearInterval(refreshInterval)
      window.removeEventListener('focus', handleFocus)
      void supabase.removeChannel(channel)
    }
  }, [authLoading, canLoadPendingOrders, loadPendingOrders])

  // Refresh detailed dashboard statistics separately.
  useEffect(() => {
    if (authLoading || !hasPermission('dashboard')) return

    if (!canLoadStatistics) {
      setLoadingStats(false)
      setStatsError('')
      return
    }

    setLoadingStats(true)
    void loadDashboardStats()

    const refreshInterval = window.setInterval(() => {
      void loadDashboardStats()
    }, 60_000)

    const handleFocus = () => {
      void loadDashboardStats()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.clearInterval(refreshInterval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [
    authLoading,
    canLoadStatistics,
    hasPermission,
    loadDashboardStats,
  ])

  const selectPage = (page: AdminPage) => {
    if (page === 'admin-management') {
      if (!isMainAdmin) return
    } else if (!hasPermission(page)) {
      return
    }

    setActivePage(page)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Redirect away from sections the user cannot access.
  useEffect(() => {
    if (authLoading || accessError) return

    const allowed =
      activePage === 'admin-management'
        ? isMainAdmin
        : hasPermission(activePage)

    if (!allowed) {
      const firstAllowed = navigation.find((item) =>
        item.id === 'admin-management'
          ? isMainAdmin
          : hasPermission(item.id),
      )

      if (firstAllowed) setActivePage(firstAllowed.id)
    }
  }, [
    activePage,
    authLoading,
    accessError,
    hasPermission,
    isMainAdmin,
  ])

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-NG').format(value)

  const formatCurrency = (value: number) =>
    `₦${new Intl.NumberFormat('en-NG', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(value)}`

  const statCards = [
    {
      title: 'Registered Customers',
      value: stats.registeredCustomers,
      icon: UsersRound,
      description: 'Customer accounts registered',
      iconStyle:
        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: CalendarCheck,
      description: 'Orders placed today',
      iconStyle:
        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: 'All orders recorded',
      iconStyle:
        'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: Wallet,
      description: 'Revenue from delivered orders',
      iconStyle:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
  ]

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 dark:bg-neutral-950">
        <div className="text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-yellow-500"
          />
          <p className="mt-4 text-sm font-semibold text-stone-600 dark:text-neutral-300">
            Verifying administrator access...
          </p>
        </div>
      </div>
    )
  }

  if (accessError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 dark:bg-neutral-950">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <UserRound size={24} />
          </div>

          <h1 className="mt-4 text-xl font-extrabold">
            Access unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-neutral-300">
            {accessError}
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-neutral-950 hover:bg-yellow-300"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  if (visibleNavigation.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 dark:bg-neutral-950">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <UserRound size={32} className="mx-auto text-stone-400" />

          <h1 className="mt-4 text-xl font-extrabold">
            No sections assigned
          </h1>

          <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-neutral-400">
            Your administrator account has no dashboard permissions yet.
            Please contact the main administrator.
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-neutral-950 hover:bg-yellow-300"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full min-w-0 bg-stone-100 text-stone-800 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="flex min-h-[76px] w-full items-center justify-between gap-3 border-b border-stone-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="text-lg font-extrabold tracking-tight sm:text-xl">
            Admin Dashboard
          </h1>
          <p className="text-xs text-stone-500 dark:text-neutral-400">
            YELO BISTRO · Management Portal
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">
              {isMainAdmin ? 'Main Administrator' : 'Sub-admin'}
            </p>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              {isMainAdmin
                ? 'Full access'
                : `${permissions.length} section${permissions.length === 1 ? '' : 's'} assigned`}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
            <UserRound size={21} />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-76px)] min-w-0 flex-col md:flex-row">
        {/* Mobile navigation */}
        <div className="sticky top-0 z-30 w-full border-b border-stone-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:hidden">
          <nav
            aria-label="Admin navigation"
            className="flex w-full items-stretch gap-1 overflow-x-auto overscroll-x-contain px-3 py-2.5"
          >
            {visibleNavigation.map((item) => {
              const Icon = item.icon
              const selected = activePage === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPage(item.id)}
                  aria-current={selected ? 'page' : undefined}
                  className={`
                    flex min-h-[68px] min-w-[88px] shrink-0
                    flex-col items-center justify-center gap-1.5
                    rounded-xl px-3 py-2 text-center
                    text-[11px] font-bold leading-tight
                    transition-colors
                    ${
                      selected
                        ? 'bg-yellow-400 text-neutral-950'
                        : 'text-stone-600 hover:bg-stone-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    }
                  `}
                >
                  <Icon size={21} strokeWidth={2} />

                  <span className="flex max-w-[125px] items-center justify-center gap-1.5">
                    <span>{item.label}</span>

                    {item.id === 'customer-orders' &&
                      pendingOrders > 0 && (
                        <span
                          aria-label={`${pendingOrders} pending orders`}
                          className="inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-extrabold leading-none text-white shadow-sm"
                        >
                          {pendingOrders}
                        </span>
                      )}
                  </span>
                </button>
              )
            })}

            <button
              type="button"
              onClick={onLogout}
              className="flex min-h-[68px] min-w-[76px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <LogOut size={21} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-stone-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:sticky md:top-0 md:flex md:h-screen md:self-start lg:w-[280px]">
          <nav
            aria-label="Admin navigation"
            className="flex-1 space-y-2 overflow-y-auto p-3 lg:p-4"
          >
            {visibleNavigation.map((item) => {
              const Icon = item.icon
              const selected = activePage === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPage(item.id)}
                  aria-current={selected ? 'page' : undefined}
                  className={`
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-3 text-left
                    text-sm font-semibold transition-colors
                    lg:px-4 lg:py-3.5
                    ${
                      selected
                        ? 'bg-yellow-400 text-neutral-950 shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className="shrink-0" strokeWidth={2} />

                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span>{item.label}</span>

                    {item.id === 'customer-orders' &&
                      pendingOrders > 0 && (
                        <span
                          aria-label={`${pendingOrders} pending orders`}
                          className="inline-flex min-h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-extrabold leading-none text-white shadow-sm ring-2 ring-white dark:ring-neutral-900"
                        >
                          {pendingOrders}
                        </span>
                      )}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="border-t border-stone-100 px-3 pb-3 pt-2 dark:border-neutral-800 lg:px-4">
            <div className="mb-1 rounded-xl bg-stone-50 p-3 dark:bg-neutral-800">
              <p className="text-xs font-semibold">YELO BISTRO</p>
              <p className="mt-1 text-xs text-stone-500 dark:text-neutral-400">
                {isMainAdmin ? 'Admin workspace' : 'Assigned workspace'}
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 lg:px-4"
            >
              <LogOut size={19} className="shrink-0" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {activePage === 'dashboard' && hasPermission('dashboard') && (
            <section>
              <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Dashboard Overview
                  </h2>

                  {!canLoadStatistics && (
                    <p className="mt-2 text-sm text-stone-500 dark:text-neutral-400">
                      Your account can access the dashboard, but detailed
                      business statistics require additional permissions.
                    </p>
                  )}
                </div>

                {canLoadStatistics && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoadingStats(true)
                      void loadDashboardStats()
                    }}
                    disabled={loadingStats}
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-stone-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  >
                    <RefreshCw
                      size={16}
                      className={loadingStats ? 'animate-spin' : ''}
                    />
                    Refresh
                  </button>
                )}
              </div>

              {canLoadStatistics && statsError && (
                <div
                  role="alert"
                  className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                >
                  <span>{statsError}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoadingStats(true)
                      void loadDashboardStats()
                    }}
                    className="font-bold underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {canLoadStatistics && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => {
                    const Icon = card.icon

                    return (
                      <article
                        key={card.title}
                        className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconStyle}`}
                          >
                            <Icon size={23} />
                          </div>

                          <TrendingUp
                            size={18}
                            className="shrink-0 text-stone-300 dark:text-neutral-600"
                          />
                        </div>

                        <p className="mt-5 text-sm font-medium text-stone-500 dark:text-neutral-400">
                          {card.title}
                        </p>

                        <div className="mt-2 min-h-10">
                          {loadingStats ? (
                            <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-stone-200 dark:bg-neutral-800" />
                          ) : (
                            <p className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
                              {typeof card.value === 'number'
                                ? formatNumber(card.value)
                                : card.value}
                            </p>
                          )}
                        </div>

                        <p className="mt-3 text-xs leading-5 text-stone-500 dark:text-neutral-400">
                          {card.description}
                        </p>
                      </article>
                    )
                  })}
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-stone-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                    <LayoutDashboard size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold">
                      Welcome to your admin workspace
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-stone-500 dark:text-neutral-400">
                      Use your assigned sections to manage YELO BISTRO
                      operations. Your available tools are listed below.
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {visibleNavigation.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:bg-neutral-800 dark:text-neutral-200"
                        >
                          {item.id === 'admin-management'
                            ? 'Admin Management'
                            : permissionLabels[item.id]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activePage === 'my-orders' && hasPermission('my-orders') && (
            <section className="min-w-0">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold">My Orders</h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
                  View your orders and their status.
                </p>
              </div>
              <MyOrders />
            </section>
          )}

          {activePage === 'customer-management' &&
            hasPermission('customer-management') && (
              <section className="min-w-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold">
                    Customer Management
                  </h2>
                  <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
                    View registered customers and their details.
                  </p>
                </div>
                <CustomerManagement />
              </section>
            )}

          {activePage === 'customer-orders' &&
            hasPermission('customer-orders') && (
              <section className="min-w-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold">
                    Customers' Orders
                  </h2>
                  <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
                    Review and manage incoming customer orders.
                  </p>
                </div>
                <AdminOrders />
              </section>
            )}

          {activePage === 'product-management' &&
            hasPermission('product-management') && (
              <section className="min-w-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold">
                    Product Management
                  </h2>
                  <p className="mt-1 text-sm text-stone-500 dark:text-neutral-400">
                    Manage menu products and availability.
                  </p>
                </div>
                <AdminProducts />
              </section>
            )}

          {activePage === 'admin-management' && isMainAdmin && (
            <section className="min-w-0">
              <AdminManagement />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
