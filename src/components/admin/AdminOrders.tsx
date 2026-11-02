
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

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
  selected_options: SelectedFoodOption[]
}

type Order = {
  id: number
  order_number: string | null
  customer_name: string
  customer_phone: string
  delivery_address: string
  total_amount: number
  order_status: string
  whatsapp_sent: boolean
  created_at: string
  order_items: OrderItem[]
}

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [updatingOrderId, setUpdatingOrderId] =
    useState<number | null>(null)

  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders()
        }
      )
      .subscribe((status) => {
        console.log('ADMIN ORDERS REALTIME:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_phone,
          delivery_address,
          total_amount,
          order_status,
          whatsapp_sent,
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
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setOrders((data || []) as Order[])
    } catch (error) {
      console.error('ADMIN ORDERS ERROR:', error)
      setErrorMsg('Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }

  // Filter orders by selected date and search term, then sort them.
  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    const matchingOrders = orders.filter((order) => {
      // Match the selected calendar date using the browser's local time.
      if (selectedDate) {
        const orderDate = new Date(order.created_at)
        const year = orderDate.getFullYear()
        const month = String(orderDate.getMonth() + 1).padStart(2, '0')
        const day = String(orderDate.getDate()).padStart(2, '0')

        if (`${year}-${month}-${day}` !== selectedDate) {
          return false
        }
      }

      if (!search) {
        return true
      }

      const orderNumber = String(
        order.order_number || order.id
      ).toLowerCase()

      const customerName = (
        order.customer_name || ''
      ).toLowerCase()

      const customerPhone = (
        order.customer_phone || ''
      ).toLowerCase()

      const orderStatus = (
        order.order_status || ''
      )
        .replace(/_/g, ' ')
        .toLowerCase()

      const deliveryAddress = (
        order.delivery_address || ''
      ).toLowerCase()

      const productNames = (
        order.order_items || []
      )
        .map((item) => item.product_name || '')
        .join(' ')
        .toLowerCase()

      return (
        orderNumber.includes(search) ||
        customerName.includes(search) ||
        customerPhone.includes(search) ||
        orderStatus.includes(search) ||
        deliveryAddress.includes(search) ||
        productNames.includes(search)
      )
    })

    return matchingOrders.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()

      return dateSort === 'newest'
        ? dateB - dateA
        : dateA - dateB
    })
  }, [orders, searchTerm, selectedDate, dateSort])

  const updateOrderStatus = async (
    orderId: number,
    newStatus: string
  ) => {
    setUpdatingOrderId(orderId)

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          order_status: newStatus,
        })
        .eq('id', orderId)

      if (error) {
        throw error
      }

      // Update the displayed status immediately.
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                order_status: newStatus,
              }
            : order
        )
      )
    } catch (error) {
      console.error('UPDATE ORDER STATUS ERROR:', error)
      alert('Unable to update the order status.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDate('')
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-amber-50 p-4 sm:p-6">
        <div className="rounded-2xl border border-amber-200 bg-white px-6 py-8 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-red-600" />
          <p className="font-semibold text-gray-800">
            Loading orders...
          </p>
        </div>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="min-h-[40vh] bg-amber-50 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="font-medium text-red-700">
            {errorMsg}
          </p>

          <button
            onClick={fetchOrders}
            className="mt-4 rounded-lg bg-yellow-400 px-4 py-2.5 font-semibold text-red-900 transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-w-0 bg-amber-50/70 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto w-full max-w-7xl min-w-0">

        {/* Page Header */}
        <div className="mb-5 flex flex-col gap-4 rounded-2xl bg-red-700 p-4 text-white shadow-sm sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-yellow-300">
              YELO BISTRO
            </p>

            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Orders
            </h2>

            <p className="mt-1 text-sm text-red-100">
              Manage and track customer orders
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="w-full rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-red-900 shadow-sm transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-red-700 sm:w-auto"
          >
            Refresh Orders
          </button>
        </div>

        {/* Search and Date Filters */}
        <div className="mb-6 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_minmax(170px,0.8fr)]">

            {/* Search */}
            <div className="min-w-0">
              <label
                htmlFor="orders-search"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Search orders
              </label>

              <div className="relative">
                <input
                  id="orders-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Customer, phone, order number, status or food..."
                  aria-label="Search customer orders"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-16 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-red-700 hover:bg-red-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Specific Date Picker */}
            <div className="min-w-0">
              <label
                htmlFor="orders-date"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Find orders for a day
              </label>

              <input
                id="orders-date"
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Sorting */}
            <div className="min-w-0">
              <label
                htmlFor="orders-sort"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Sort by time
              </label>

              <select
                id="orders-sort"
                value={dateSort}
                onChange={(e) =>
                  setDateSort(
                    e.target.value as 'newest' | 'oldest'
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="oldest">
                  Oldest first
                </option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex flex-col gap-3 border-t border-amber-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="text-sm text-gray-600"
              aria-live="polite"
            >
              Showing{' '}
              <span className="font-bold text-red-700">
                {filteredOrders.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold">
                {orders.length}
              </span>{' '}
              orders
              {selectedDate
                ? ` for ${new Date(
                    `${selectedDate}T00:00:00`
                  ).toLocaleDateString()}`
                : ''}
            </p>

            {(searchTerm || selectedDate) && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 sm:w-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-white px-4 py-10 text-center shadow-sm">
            <p className="font-semibold text-gray-700">
              No orders have been placed yet.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-white px-4 py-10 text-center shadow-sm">
            <p className="font-semibold text-red-800">
              No matching orders found.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Try another customer name, phone number,
              order number, status, food item or date.
            </p>

            <button
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-red-900 transition hover:bg-yellow-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="min-w-0 overflow-hidden rounded-2xl border border-amber-200 border-l-4 border-l-red-600 bg-white p-4 shadow-sm sm:p-5"
              >

                {/* Order Header */}
                <div className="mb-5 flex flex-col gap-3 border-b border-amber-100 pb-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-extrabold text-red-800 sm:text-xl">
                      {order.order_number || `#${order.id}`}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* Order Status */}
                  <div className="flex w-full items-center gap-2 sm:w-auto">
                    <select
                      value={order.order_status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      disabled={
                        updatingOrderId === order.id
                      }
                      aria-label={`Update status for order ${
                        order.order_number || order.id
                      }`}
                      className="w-full min-w-0 rounded-xl border border-amber-300 bg-yellow-50 px-3 py-2.5 text-sm font-semibold capitalize text-red-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-50 sm:w-auto"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-4 border-b border-amber-100 pb-4">
                  <h4 className="mb-2 font-bold text-gray-900">
                    Customer
                  </h4>

                  <p className="break-words text-sm sm:text-base">
                    <strong>Name:</strong>{' '}
                    {order.customer_name}
                  </p>

                  <p className="break-words text-sm sm:text-base">
                    <strong>Phone:</strong>{' '}
                    {order.customer_phone}
                  </p>

                  <p className="break-words text-sm sm:text-base">
                    <strong>Address:</strong>{' '}
                    {order.delivery_address}
                  </p>
                </div>

                {/* Items Ordered */}
                <div>
                  <h4 className="mb-3 font-bold text-gray-900">
                    Items Ordered
                  </h4>

                  <div className="space-y-4">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-amber-100 pb-4 last:border-b-0"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <p className="break-words font-semibold text-gray-900">
                              {item.product_name}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="whitespace-nowrap font-semibold text-red-700">
                            ₦
                            {Number(
                              item.subtotal
                            ).toLocaleString()}
                          </p>
                        </div>

                        {/* Customizations */}
                        {item.selected_options &&
                          item.selected_options.length > 0 && (
                            <div className="mt-3 rounded-lg bg-amber-50 p-3 sm:ml-3">
                              <p className="text-sm font-semibold text-gray-700">
                                Customizations:
                              </p>

                              <div className="mt-1 space-y-1">
                                {item.selected_options.map(
                                  (option) => (
                                    <div
                                      key={`${option.groupId}-${option.choiceId}`}
                                      className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm text-gray-600"
                                    >
                                      <span className="break-words">
                                        + {option.choiceName}
                                      </span>

                                      {option.price > 0 && (
                                        <span className="whitespace-nowrap">
                                          ₦
                                          {Number(
                                            option.price
                                          ).toLocaleString()}
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
                </div>

                {/* Order Total */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-amber-100 pt-4">
                  <span className="font-bold text-gray-900">
                    Total
                  </span>

                  <span className="whitespace-nowrap text-lg font-extrabold text-red-700 sm:text-xl">
                    ₦
                    {Number(
                      order.total_amount
                    ).toLocaleString()}
                  </span>
                </div>

                {/* Status Update Message */}
                {updatingOrderId === order.id && (
                  <p className="mt-3 text-sm font-medium text-red-700">
                    Updating order status...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
