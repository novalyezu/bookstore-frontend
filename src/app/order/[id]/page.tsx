"use client"

import OrderStatusComp from "@/components/order/OrderStatus";
import { formatOrderDate, formatUSD } from "@/helper/utils";
import { useOrder } from "@/hooks/order";
import { useGlobalState } from "@/hooks/state";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrderDetail() {
  const [user] = useGlobalState('user')
  const [isUserLoading] = useGlobalState('isUserLoading')
  const { isLoading, order, getOrderById } = useOrder()
  const router = useRouter()
  const params = useParams()
  let ignore = false;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login')
      return;
    }
    if (!ignore) {
      getOrderById(params.id as string)
    }
    return () => {
      ignore = true;
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-4 min-h-[calc(100vh-15rem)]">
      {!isLoading && order &&
        <>
          <div className="text-3xl text-center mb-6">Order Detail</div>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-row justify-between">
              <span className="text-gray-500 text-sm">Status</span>
              <OrderStatusComp status={order.order_status} />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-gray-500 text-sm">Order ID</span>
              <span className="font-semibold">{order.id}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-gray-500 text-sm">Order Date</span>
              <span className="font-semibold">{formatOrderDate(order.createdAt)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-5">
            {order.order_items.map(item => {
              return (
                <div key={item.id} className="flex flex-row p-2 border-2 rounded-md">
                  <div className="basis-1/6">
                    <Image src={item.book_cover_image} alt="" width={100} height={50}
                      className="" />
                  </div>
                  <div className="basis-5/6 flex flex-col justify-between">
                    <div>
                      <div className="text-xl">{item.book_title}</div>
                      <div className="text-sm text-gray-500">Quantity: <span className="text-black font-semibold">{item.quantity}</span> pcs</div>
                      <div className="text-sm text-gray-500">Price: <span className="text-black font-semibold">{formatUSD(item.book_price)}</span></div>
                    </div>
                    <div className="text-md">Amount: <span className="font-semibold">{formatUSD(item.total_amount)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div>
            <div className="text-2xl mb-2">Shipping Information</div>
            <div className="flex flex-col gap-2">
              <div className="flex">
                <div className="basis-1/4 text-gray-500 text-sm">Name</div>
                <div className="basis-3/4">{order.shipping_name}</div>
              </div>
              <div className="flex">
                <div className="basis-1/4 text-gray-500 text-sm">Phone</div>
                <div className="basis-3/4">{order.shipping_phone}</div>
              </div>
              <div className="flex">
                <div className="basis-1/4 text-gray-500 text-sm">Address</div>
                <div className="basis-3/4">{order.shipping_address}</div>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div>
            <div className="text-2xl mb-2">Payment Details</div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-row justify-between">
                <span className="text-gray-500 text-sm">Total Quantity</span>
                <span className="font-semibold">{order.total_quantity} <span className="font-normal text-gray-500">pcs</span></span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="text-gray-500 text-sm">Total Amount</span>
                <span className="font-semibold">{formatUSD(order.total_amount)}</span>
              </div>
            </div>
          </div>
          <hr className="my-3" />
        </>
      }
      {!isLoading && !order &&
        <div className="mx-auto text-center text-2xl">
          Order not found
        </div>
      }
    </div>
  )
}