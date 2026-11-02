import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Profile = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  address: string | null
  role: string
}

type OrderItem = {
  id: number
  product_name: string
  quantity: number
  subtotal: number
}

type Order = {
  id: number
  user_id: string | null
  created_at: string
  total_amount: number | string | null
  order_status: string | null
  order_items: OrderItem[]
}

type Customer = {
  id: string
  customer_name: string
  email: string | null
  customer_phone: string | null
  delivery_address: string | null
  last_order_date: string | null
  last_item_ordered: string
  total_orders: number
  total_revenue: number
  orders: Order[]
}

const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)

const formatStatus = (status: string | null) => {
  if (!status) return 'Status unavailable'
  return status.replaceAll('_', ' ')
}

const statusClasses = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-50 text-green-700'
    case 'cancelled':
      return 'bg-red-50 text-red-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
    case 'preparing':
    case 'ready':
    case 'out_for_delivery':
      return 'bg-blue-50 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('revenue_desc')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    void fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, address, role')
        .eq('role', 'customer')

      if (profilesError) throw profilesError

      const profiles: Profile[] = profilesData || []
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          created_at,
          total_amount,
          order_status,
          order_items (
            id,
            product_name,
            quantity,
            subtotal
          )
        `)
        .not('user_id', 'is', null)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      const orders: Order[] = (ordersData || []) as Order[]
      const customerMap = new Map<string, Customer>()

      profiles.forEach((profile) => {
        customerMap.set(profile.id, {
          id: profile.id,
          customer_name: profile.full_name,
          email: profile.email,
          customer_phone: profile.phone,
          delivery_address: profile.address,
          last_order_date: null,
          last_item_ordered: 'No orders yet',
          total_orders: 0,
          total_revenue: 0,
          orders: [],
        })
      })

      // Orders arrive newest first, so the first order for each customer is the latest.
      orders.forEach((order) => {
        if (!order.user_id) return
        const customer = customerMap.get(order.user_id)
        if (!customer) return

        customer.orders.push(order)
        customer.total_orders += 1
        customer.total_revenue += Number(order.total_amount) || 0

        if (!customer.last_order_date) {
          customer.last_order_date = order.created_at
          customer.last_item_ordered =
            order.order_items?.[0]?.product_name || 'No item found'
        }
      })

      setCustomers(Array.from(customerMap.values()))
    } catch (error) {
      console.error('CUSTOMER MANAGEMENT ERROR:', error)
      setErrorMsg('Unable to load customer information. Please check the database query and permissions.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    // Filter first, then sort the resulting list. Sorting must also run
    // when the search box is empty.
    const matchingCustomers = customers.filter((customer) => {
      if (!query) return true

      return [
        customer.customer_name,
        customer.email,
        customer.customer_phone,
        customer.delivery_address,
      ].some((value) => value?.toLowerCase().includes(query))
    })

    return matchingCustomers.sort((a, b) => {
      const revenueA = Number(a.total_revenue) || 0
      const revenueB = Number(b.total_revenue) || 0
      const ordersA = Number(a.total_orders) || 0
      const ordersB = Number(b.total_orders) || 0

      switch (sortBy) {
        case 'revenue_desc':
          return revenueB - revenueA
        case 'revenue_asc':
          return revenueA - revenueB
        case 'orders_desc':
          return ordersB - ordersA
        case 'orders_asc':
          return ordersA - ordersB
        default:
          return 0
      }
    })
  }, [customers, searchTerm, sortBy])

  const totalOrders = customers.reduce((total, customer) => total + customer.total_orders, 0)
  const customersWithOrders = customers.filter((customer) => customer.total_orders > 0).length
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || null

  if (loading) {
    return (
      <div className="min-h-full bg-[#fffaf4] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[260px] max-w-7xl flex-col items-center justify-center rounded-2xl border border-yellow-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-yellow-200 border-t-red-700" />
          <p className="font-semibold text-gray-800">Loading customer information...</p>
        </div>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="min-h-full bg-[#fffaf4] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">Unable to load customers</h2>
          <p className="mt-2 text-sm text-red-700">{errorMsg}</p>
          <button
            onClick={() => void fetchCustomers()}
            className="mt-5 min-h-11 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-yellow-300 transition hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (selectedCustomer) {
    return (
      <div className="min-h-full bg-[#fffaf4] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <button
            type="button"
            onClick={() => setSelectedCustomerId(null)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-yellow-200 bg-white px-4 py-2.5 text-sm font-bold text-red-800 shadow-sm transition hover:bg-yellow-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
              <path d="m15 18-6-6 6-6M9 12h12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to customers
          </button>

          <section className="overflow-hidden rounded-2xl bg-red-800 text-white shadow-sm">
            <div className="p-5 sm:p-7">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-red-900/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-yellow-300">
                <span className="h-2 w-2 rounded-full bg-yellow-300" />
                Customer profile
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-2xl font-extrabold uppercase text-red-900">
                  {selectedCustomer.customer_name.trim().charAt(0) || 'C'}
                </div>
                <div className="min-w-0">
                  <h1 className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {selectedCustomer.customer_name || 'Unnamed customer'}
                  </h1>
                  <p className="mt-1 break-words text-sm text-red-100">
                    {selectedCustomer.email || 'No email provided'}
                  </p>
                  <p className="mt-1 text-sm text-red-100">
                    {selectedCustomer.customer_phone || 'No phone number provided'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total orders</p>
              <p className="mt-2 text-2xl font-extrabold text-gray-900">{selectedCustomer.total_orders}</p>
            </div>
            <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total revenue</p>
              <p className="mt-2 break-words text-2xl font-extrabold text-gray-900">
                {formatMoney(selectedCustomer.total_revenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Delivery address</p>
              <p className="mt-2 break-words text-sm font-bold text-gray-900">
                {selectedCustomer.delivery_address || 'Not provided'}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-yellow-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <h2 className="text-xl font-extrabold text-gray-900">Order history</h2>
              <p className="mt-1 text-sm text-gray-500">
                All orders associated with {selectedCustomer.customer_name || 'this customer'}.
              </p>
            </div>

            {selectedCustomer.orders.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-red-800">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
                    <path d="M7 3h10a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
                    <path d="M9 8h6M9 12h6" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="mt-4 font-bold text-gray-900">No order history yet</h3>
                <p className="mt-1 text-sm text-gray-500">This customer has not placed any orders.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {selectedCustomer.orders.map((order, index) => (
                  <article key={order.id} className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-gray-900">Order #{order.id}</h3>
                          {index === 0 && (
                            <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                              Latest order
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusClasses(order.order_status)}`}>
                          {formatStatus(order.order_status)}
                        </span>
                        <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-red-900">
                          {order.order_items?.length || 0} {(order.order_items?.length || 0) === 1 ? 'item line' : 'item lines'}
                        </span>
                      </div>
                    </div>

                    {order.order_items?.length ? (
                      <div className="mt-4 space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex flex-col gap-1 rounded-xl bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-semibold text-gray-800">{item.product_name}</p>
                              <p className="mt-1 text-xs text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-red-800">{formatMoney(Number(item.subtotal) || 0)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
                        No item details were recorded for this order.
                      </p>
                    )}

                    <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-gray-500">Order total</p>
                      <p className="text-lg font-extrabold text-red-800">
                        {formatMoney(Number(order.total_amount) || 0)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#fffaf4] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-2xl bg-red-800 text-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-red-900/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-yellow-300">
                <span className="h-2 w-2 rounded-full bg-yellow-300" />
                Admin dashboard
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Customer Management</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-red-100 sm:text-base">
                Review registered customers, their order counts, and the revenue generated by each customer.
              </p>
            </div>
            <button
              onClick={() => void fetchCustomers()}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-yellow-300 px-5 py-3 text-sm font-extrabold text-red-900 shadow-sm transition hover:bg-yellow-200 md:self-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M20 7v5h-5M4 17v-5h5M5.6 9A7 7 0 0 1 17.5 6L20 12M4 12l2.5 6A7 7 0 0 0 18.4 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Refresh customers
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Registered customers</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">{customers.length}</p>
          </div>
          <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Customers with orders</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">{customersWithOrders}</p>
          </div>
          <div className="rounded-2xl border border-yellow-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total orders</p>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">{totalOrders}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-yellow-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl">Customer directory</h2>
                <p className="mt-1 text-sm text-gray-500">Choose View Order History to open the customer’s full order-history page.</p>
              </div>
              <div className="grid w-full gap-3 sm:max-w-2xl sm:grid-cols-2">
                <div>
                  <label htmlFor="customer-search" className="mb-2 block text-sm font-semibold text-gray-700">Search customers</label>
                  <div className="relative">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="6.8" />
                    <path d="m16 16 4.5 4.5" strokeLinecap="round" />
                  </svg>
                  <input
                    id="customer-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search name, email, phone, or address..."
                    className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear customer search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="customer-sort" className="mb-2 block text-sm font-semibold text-gray-700">Sort customers by</label>
                  <select
                    id="customer-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50"
                  >
                    <option value="revenue_desc">Highest revenue first</option>
                    <option value="revenue_asc">Lowest revenue first</option>
                    <option value="orders_desc">Most orders first</option>
                    <option value="orders_asc">Fewest orders first</option>
                  </select>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{filteredCustomers.length}</span>{' '}
              {searchTerm.trim() ? 'matching customers' : 'customers'}
            </p>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <h3 className="font-bold text-gray-900">
                {customers.length === 0 ? 'No registered customers yet' : 'No matching customers found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {customers.length === 0
                  ? 'Customer accounts will appear here once they register.'
                  : 'Try a different name, email, phone number, or address.'}
              </p>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="mt-4 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-yellow-300 hover:bg-red-800"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#fffaf4] text-xs uppercase tracking-wider text-gray-500">
                    <th scope="col" className="px-5 py-4 font-bold">Name</th>
                    <th scope="col" className="px-5 py-4 font-bold">Email address</th>
                    <th scope="col" className="px-5 py-4 font-bold">Phone number</th>
                    <th scope="col" className="px-5 py-4 text-center font-bold">Total orders</th>
                    <th scope="col" className="px-5 py-4 text-right font-bold">Total revenue</th>
                    <th scope="col" className="px-5 py-4 text-right font-bold">Order history</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="bg-white transition hover:bg-[#fffdf8]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-800 text-sm font-extrabold uppercase text-yellow-300">
                            {customer.customer_name.trim().charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{customer.customer_name || 'Unnamed customer'}</p>
                            <p className="mt-0.5 text-xs text-gray-400">Customer account</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{customer.email || 'Not provided'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{customer.customer_phone || 'Not provided'}</td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-extrabold text-red-900">
                          {customer.total_orders}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-extrabold text-gray-900 whitespace-nowrap">
                        {formatMoney(customer.total_revenue)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-red-800 px-3.5 py-2 text-sm font-bold text-yellow-300 transition hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-red-100"
                        >
                          View history
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                            <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
