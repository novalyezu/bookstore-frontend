"use client"

import OrderStatusComp from "@/components/order/OrderStatus";
import { formatOrderDate, formatUSD } from "@/helper/utils";
import { useOrder } from "@/hooks/order";
import { useGlobalState } from "@/hooks/state";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Order() {
  const [user] = useGlobalState('user');
  const [isUserLoading] = useGlobalState('isUserLoading')
  const { isLoading, orders, pagination, getOrders } = useOrder();
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderBy, setOrderBy] = useState("createdAt__desc")
  const router = useRouter()
  let ignore = false;

  const handleClickLoadMore = () => {
    setPage(pagination?.nextPage!);
  }

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login')
      return;
    }

    if (!ignore) {
      getOrders({ page, limit, orderBy });
    }
    return () => {
      ignore = true
    }
  }, [page])

  return (
    <div className="max-w-3xl mx-auto mt-4 min-h-[calc(100vh-15rem)]">
      {!isLoading && orders.length > 0 &&
        <>
          <div className="text-3xl text-center mb-4">Your Orders</div>
          <div className="flex flex-col gap-2">
            {orders.map(order => {
              return (
                <Link key={order.id} href={'/order/' + order.id}>
                  <div className="flex flex-col p-2 border-2 rounded-md cursor-pointer">
                    <div className="flex justify-between">
                      <span className="my-auto text-sm text-gray-500">{formatOrderDate(order.createdAt)}</span>
                      <OrderStatusComp status={order.order_status} />
                    </div>
                    <hr className="my-2" />
                    <div className="flex flex-row">
                      <div className="basis-1/6">
                        <Image src={order.order_items[0].book_cover_image} alt="" width={100} height={50}
                          className="" />
                      </div>
                      <div className="basis-5/6 flex flex-col justify-between">
                        <div>
                          <div className="text-xl">{order.order_items[0].book_title}</div>
                          <div className="text-sm text-gray-500">Quantity: <span className="text-black font-semibold">{order.order_items[0].quantity}</span> pcs</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">
                            {order.order_item_count > 1 ? `+${order.order_item_count - 1} another book(s)` : ""}
                          </div>
                          <div className="text-md">Total Amount: <span className="font-semibold">{formatUSD(order.total_amount)}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
            {!isLoading && pagination?.nextPage &&
              <div className="mx-auto mt-10 mb-20">
                <button className="bg-gray-900 text-white px-5 py-3 rounded-md font-semibold" onClick={handleClickLoadMore}>load more</button>
              </div>
            }
          </div>
        </>
      }
      {!isLoading && orders.length === 0 &&
        <div className="mx-auto text-center text-2xl">
          Your orders is empty
        </div>
      }
    </div>
  )
}