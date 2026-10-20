import { useEffect, useState } from 'react'
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
  created_at: string
  order_items: OrderItem[]
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const setupRealtime = async () => {
      await fetchOrders()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      channel = supabase
        .channel(`my-orders-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`,
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
            filter: `user_id=eq.${user.id}`,
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
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchOrders()
          }
        )
        .subscribe((status) => {
          console.log('MY ORDERS REALTIME:', status)
        })
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setErrorMsg('')

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        setErrorMsg('You are not logged in.')
        setLoading(false)
        return
      }

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

      if (error) {
        throw error
      }

      setOrders(data || [])
    } catch (error) {
      console.error('MY ORDERS ERROR:', error)
      setErrorMsg('Unable to load your orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading your orders...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="p-6">
        <p>{errorMsg}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">
          My Orders
        </h2>

        <p>You have not placed any orders yet.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        My Orders
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-5 shadow-sm bg-white"
          >
            {/* Order Header */}
            <div className="flex flex-wrap justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-lg">
                  Order {order.order_number || `#${order.id}`}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium capitalize">
                {order.order_status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Delivery Information */}
            <div className="mb-5">
              <p className="text-sm text-gray-500 mb-1">
                Delivery Address
              </p>

              <p className="font-medium">
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
                    {/* Product */}
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
                        ₦{Number(item.subtotal).toLocaleString()}
                      </p>
                    </div>

                    {/* Customizations */}
                    {item.selected_options &&
                      item.selected_options.length > 0 && (
                        <div className="mt-2 ml-3">
                          <p className="text-sm font-medium text-gray-600">
                            Customizations:
                          </p>

                          <div className="space-y-1 mt-1">
                            {item.selected_options.map((option) => (
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
                            ))}
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
                ₦{Number(order.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}