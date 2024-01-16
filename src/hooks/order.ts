import { BASE_URL, KEYS } from "@/helper/constant";
import storage from "@/helper/storage";
import { toastError, toastSuccess } from "@/helper/toast";
import { IBaseErrorResponse, IBaseSuccessResponse, IPagination, IQueryParams } from "@/helper/type";
import { useRouter } from "next/navigation";
import { useState } from "react"

export const OrderStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED"
}

export interface IOrderItemData {
  id: string
  book_id: string
  book_title: string
  book_synopsis: string
  book_author: string
  book_publisher: string
  book_publish_date: string
  book_pages: number
  book_price: number
  book_cover_image: string
  quantity: number
  total_amount: number
  createdAt: Date
}

export interface IOrderData {
  id: string;
  buyer_id: string
  buyer_name: string
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  total_quantity: number
  total_amount: number
  order_status: string
  order_item_count: number
  order_items: IOrderItemData[]
  createdAt: Date
}

export interface IOrderCart {
  book_id: string
  quantity: number
}

export interface IOrderPayload {
  buyer_id: string;
  carts: IOrderCart[];
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
}

const useOrder = () => {
  const token = storage.getItem(KEYS.token)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<IOrderData[]>([])
  const [order, setOrder] = useState<IOrderData>()
  const [pagination, setPagination] = useState<IPagination>()
  const router = useRouter()

  const getOrders = async (queryParams: IQueryParams) => {
    setIsLoading(true);
    try {
      const { page, limit, orderBy } = queryParams;
      const res = await fetch(`${BASE_URL}/api/v1/me/orders?page=${page}&limit=${limit}&orderBy=${orderBy}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        console.log(errRes)
      } else {
        const resData: IBaseSuccessResponse<IOrderData[]> = await res.json();
        setOrders((prevState) => [...prevState, ...resData.data]);
        setPagination(resData.meta);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getOrderById = async (orderId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/me/orders/${orderId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        console.log(errRes)
      } else {
        const resData: IBaseSuccessResponse<IOrderData> = await res.json();
        setOrder(resData.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const createOrder = async (bodyPayload: IOrderPayload) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/orders`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        toastError(errRes.message);
      } else {
        const resData: IBaseSuccessResponse<string> = await res.json();
        toastSuccess('Order created')
        router.push('/order')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    orders,
    order,
    pagination,
    getOrders,
    getOrderById,
    createOrder,
  }
}

export { useOrder }
