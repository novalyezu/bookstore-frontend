"use client"

import { formatUSD } from "@/helper/utils";
import { useCart } from "@/hooks/cart";
import { IOrderPayload, useOrder } from "@/hooks/order";
import { useGlobalState } from "@/hooks/state";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cart() {
  const [user] = useGlobalState('user')
  const [isUserLoading] = useGlobalState('isUserLoading')
  const { createOrder } = useOrder()
  const { isLoading, carts, getCarts, removeFromCart } = useCart()
  const [orderPayload, setOrderPayload] = useState<IOrderPayload>({
    buyer_id: '',
    carts: [],
    shipping_address: '',
    shipping_name: '',
    shipping_phone: ''
  });
  const router = useRouter()
  let ignore = false;

  const getTotalQty = () => {
    return carts.reduce((prev, val) => prev + val.quantity, 0);
  }

  const getTotalAmount = () => {
    return carts.reduce((prev, val) => prev + (val.quantity * val.book.price), 0);
  }

  const onChangeShippingNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderPayload((prevState) => ({ ...prevState, shipping_name: e.target.value }))
  }

  const onChangeShippingPhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderPayload((prevState) => ({ ...prevState, shipping_phone: e.target.value }))
  }

  const onChangeShippingAddressInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOrderPayload((prevState) => ({ ...prevState, shipping_address: e.target.value }))
  }

  const handleClickRemove = (bookId: string) => {
    removeFromCart(bookId)
  }

  const handleClickPlaceOrder = () => {
    createOrder(orderPayload)
  }

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login')
      return;
    }

    setOrderPayload((prevState) => ({ ...prevState, buyer_id: user?.id! }));

    if (!ignore) {
      getCarts()
    }
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-4 min-h-[calc(100vh-225px)]">
      {!isLoading && carts.length > 0 &&
        <>
          <div className="text-3xl text-center mb-4">Your Cart</div>
          <div className="flex flex-col gap-2">
            {carts.map(cart => {
              return (
                <div key={cart.book_id} className="flex flex-row p-2 border-2 rounded-md">
                  <div className="basis-1/6">
                    <Image src={cart.book.cover_image} alt="" width={100} height={50}
                      className="" />
                  </div>
                  <div className="basis-5/6 flex flex-col justify-between">
                    <div>
                      <div className="flex">
                        <div className="basis-11/12 text-xl">{cart.book.title + cart.book.title}</div>
                        <div className="basis-1/12 relative">
                          <div className="absolute top-0 right-0 text-red-500 underline cursor-pointer"
                            onClick={() => handleClickRemove(cart.book_id)}>remove</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Quantity: <span className="text-black font-semibold">{cart.quantity}</span> pcs</div>
                      <div className="text-sm text-gray-500">Price: <span className="text-black font-semibold">{formatUSD(cart.book.price)}</span></div>
                    </div>
                    <div className="text-md">Amount: <span className="font-semibold">{formatUSD(cart.quantity * cart.book.price)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex flex-row">
            <div className="basis-1/2"></div>
            <div className="basis-1/2 pt-3 pr-3">
              <div className="flex justify-between">
                <span>Total Quantity</span>
                <span className="font-semibold">{getTotalQty()} <span className="text-gray-500 font-normal">pcs</span></span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-semibold">{formatUSD(getTotalAmount())} </span>
              </div>
            </div>
          </div>
          <hr className="my-3" />
          <div className="text-3xl text-center mb-4">Shipping Information</div>
          <div className="flex flex-col mb-4">
            <label htmlFor="name">What is your name?</label>
            <input className="w-96 p-2 border-2 rounded-md" type="text" name="name" id="name" onChange={onChangeShippingNameInput} />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="phone">What is your phone number?</label>
            <input className="w-96 p-2 border-2 rounded-md" type="tel" name="phone" id="phone" onChange={onChangeShippingPhoneInput} />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="address">Where we have to delivery your orders?</label>
            <textarea className="p-2 border-2 rounded-md" name="address" id="address" cols={30} rows={10} onChange={onChangeShippingAddressInput}></textarea>
          </div>
          <button className="bg-gray-900 py-2 mb-4 w-full rounded-md text-white font-semibold" onClick={handleClickPlaceOrder}>Place Order</button>
        </>
      }
      {!isLoading && carts.length === 0 &&
        <div className="mx-auto text-center text-2xl">
          Your cart is empty
        </div>
      }
    </div>
  )
}