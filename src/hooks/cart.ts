import { BASE_URL, KEYS } from "@/helper/constant";
import storage from "@/helper/storage";
import { toastError, toastSuccess } from "@/helper/toast";
import { IBaseErrorResponse, IBaseSuccessResponse } from "@/helper/type";
import { useState } from "react"

export interface ICartData {
  book_id: string;
  book: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    cover_image: string;
  }
  quantity: number;
}

export interface IAddToCart {
  book_id: string;
  quantity: number;
}

const useCart = () => {
  const token = storage.getItem(KEYS.token)
  const [isLoading, setIsLoading] = useState(true)
  const [carts, setCarts] = useState<ICartData[]>([])

  const getCarts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/me/carts?page=1&limit=99999&orderBy=createdAt__desc`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
      } else {
        const resData: IBaseSuccessResponse<ICartData[]> = await res.json();
        setCarts(resData.data);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (bodyPayload: IAddToCart) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/me/carts`, {
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
        const resData: IBaseSuccessResponse<ICartData[]> = await res.json();
        toastSuccess('Added to cart')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (bookId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/me/carts`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ book_id: bookId })
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        toastError(errRes.message);
      } else {
        const resData: IBaseSuccessResponse<ICartData[]> = await res.json();
        toastSuccess('Removed from cart')
        getCarts()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    carts,
    getCarts,
    addToCart,
    removeFromCart,
  }
}

export { useCart }
