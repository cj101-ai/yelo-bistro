
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

  // Live search across order number, customer details,
  // order status and food items.
  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return orders
    }

    return orders.filter((order) => {
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
  }, [orders, searchTerm])

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

      // Update the order immediately on the screen.
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

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading orders...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="p-6">
        <p className="text-red-600">{errorMsg}</p>

        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Orders
          </h2>

          <p className="text-gray-500">
            Manage customer orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Live Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search by customer, phone, order number, status or food..."
            aria-label="Search customer orders"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-gray-500 hover:text-gray-900"
            >
              Clear
            </button>
          )}
        </div>

        {searchTerm.trim() && (
          <p className="text-sm text-gray-500 mt-2">
            {filteredOrders.length} matching order
            {filteredOrders.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <p>No orders have been placed yet.</p>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 font-medium">
            No matching orders found.
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Try another customer name, phone number,
            order number, status or food item.
          </p>

          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-wrap justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold">
                    {order.order_number || `#${order.id}`}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                {/* Order Status */}
                <div className="flex items-center gap-2">
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
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium capitalize cursor-pointer disabled:opacity-50"
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
              <div className="border-b pb-4 mb-4">
                <h4 className="font-semibold mb-2">
                  Customer
                </h4>

                <p>
                  <strong>Name:</strong>{' '}
                  {order.customer_name}
                </p>

                <p>
                  <strong>Phone:</strong>{' '}
                  {order.customer_phone}
                </p>

                <p>
                  <strong>Address:</strong>{' '}
                  {order.delivery_address}
                </p>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">
                  Items Ordered
                </h4>

                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {item.product_name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-medium">
                          ₦
                          {Number(
                            item.subtotal
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* Customizations */}
                      {item.selected_options &&
                        item.selected_options.length > 0 && (
                          <div className="mt-2 ml-3">
                            <p className="text-sm font-medium text-gray-600">
                              Customizations:
                            </p>

                            <div className="mt-1 space-y-1">
                              {item.selected_options.map(
                                (option) => (
                                  <div
                                    key={`${option.groupId}-${option.choiceId}`}
                                    className="flex justify-between text-sm text-gray-500"
                                  >
                                    <span>
                                      + {option.choiceName}
                                    </span>

                                    {option.price > 0 && (
                                      <span>
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

              {/* Total */}
              <div className="border-t mt-5 pt-4 flex justify-between">
                <span className="font-bold">
                  Total
                </span>

                <span className="font-bold text-lg">
                  ₦
                  {Number(
                    order.total_amount
                  ).toLocaleString()}
                </span>
              </div>

              {/* Status Update Message */}
              {updatingOrderId === order.id && (
                <p className="text-sm text-gray-500 mt-3">
                  Updating order status...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
