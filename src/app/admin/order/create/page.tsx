"use client"

import { formatUSD } from "@/helper/utils";
import { IBookData, useBookAdmin } from "@/hooks/bookAdmin";
import { IOrderPayload, useOrderAdmin } from "@/hooks/orderAdmin";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ICartTemp {
  book_id: string,
  quantity: number,
  book: IBookData,
}

const StockComp = (props: any) => {
  if (props.quantity <= 0) {
    return (
      <span className="text-red-500">Out of stock!</span>
    )
  }
  return (
    <>
      <span className="text-black font-semibold">{props.quantity}</span> pcs
    </>
  )
}

export default function CreateOrder() {
  const { isLoadingPost, createOrder } = useOrderAdmin()
  const { isLoading, books, getBooks } = useBookAdmin()
  const [isSubmit, setIsSubmit] = useState(false)
  const [searchBook, setSearchBook] = useState("")
  const [carts, setCarts] = useState<ICartTemp[]>([])
  const [orderPayload, setOrderPayload] = useState<IOrderPayload>({
    buyer_id: '',
    carts: [],
    shipping_address: '',
    shipping_name: '',
    shipping_phone: ''
  });

  const getTotalQty = () => {
    return carts.reduce((prev, val) => prev + val.quantity, 0);
  }

  const getTotalAmount = () => {
    return carts.reduce((prev, val) => prev + (val.quantity * val.book.price), 0);
  }

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBook(e.target.value)
  }

  const onKeyDownSearchInput = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      getBooks({ page: 1, limit: 3, orderBy: 'createdAt__desc', search: searchBook })
    }
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setOrderPayload((prevState) => ({ ...prevState, [key]: e.target.value }))
  }

  const onChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setOrderPayload((prevState) => ({ ...prevState, [key]: e.target.value }))
  }

  const handleClickSubmit = () => {
    setIsSubmit(true)
    let isValid = true;

    if (!orderPayload.buyer_id || !orderPayload.shipping_address || !orderPayload.shipping_name || !orderPayload.shipping_phone ||
      orderPayload.carts.length === 0) {
      isValid = false;
    }

    if (isValid) {
      createOrder(orderPayload)
    }
  }

  const handleClickAddToCart = (book: IBookData) => {
    const qty = Number(prompt('Input quantity'));
    if (Number.isNaN(qty)) {
      alert('Please input number')
      return;
    }
    const cart = carts.find(cart => cart.book_id === book.id);
    if (!cart) {
      setCarts((prevState) => [...prevState, {
        book_id: book.id,
        quantity: qty,
        book: book,
      }])
    } else {
      setCarts(carts.map(cr => {
        if (cr.book_id === cart.book_id) {
          return {
            ...cr,
            quantity: cr.quantity + qty,
          }
        } else {
          return cr;
        }
      }))
    }
  }

  const handleClickRemove = (cart: ICartTemp) => {
    setCarts(carts.filter(cr => cr.book_id !== cart.book_id))
  }

  useEffect(() => {
    setOrderPayload((prevState) => ({ ...prevState, carts: carts }))
  }, [carts])

  return (
    <div>
      <div className="text-2xl mb-4">Create Order</div>
      <div className="flex flex-col mb-4">
        <div className="flex flex-col mb-4">
          <label htmlFor="search_book">Search Book</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="search_book" id="search_book" onChange={onChangeSearchInput}
            onKeyDown={onKeyDownSearchInput} />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            {books.map(book => {
              return (
                <div key={book.id} className="flex flex-col p-2 border-2 rounded-md w-96">
                  <div className="flex flex-row gap-1">
                    <div className="basis-1/6">
                      <Image src={book.cover_image} alt="" width={100} height={50}
                        className="" />
                    </div>
                    <div className="basis-5/6 flex flex-col justify-between">
                      <div>
                        <div className="">{book.title}</div>
                        <div className="text-sm text-gray-500">Stock: <StockComp quantity={book.quantity} /></div>
                        <div className="text-sm text-gray-500">Price: <span className="text-black font-semibold">{formatUSD(book.price)}</span></div>
                      </div>
                      <div className="flex justify-between">
                        <div className=""></div>
                        {book.quantity > 0 &&
                          <div className="text-md cursor-pointer underline" onClick={() => handleClickAddToCart(book)}>+ Cart</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 mb-2">Your Cart ({carts.length}) *</div>
          {isSubmit && carts.length === 0 && <span className="text-sm text-red-500">your cart is empty</span>}
          <div className="flex flex-row gap-2">
            {carts.map(cart => {
              return (
                <div key={cart.book_id} className="flex flex-col p-2 border-2 rounded-md w-96">
                  <div className="flex flex-row gap-1">
                    <div className="basis-1/6">
                      <Image src={cart.book.cover_image} alt="" width={100} height={50}
                        className="" />
                    </div>
                    <div className="basis-5/6 flex flex-col justify-between">
                      <div>
                        <div className="">{cart.book.title}</div>
                        <div className="text-sm text-gray-500">Quantity: <span className="text-black font-semibold">{cart.quantity}</span> pcs</div>
                        <div className="text-sm text-gray-500">Price: <span className="text-black font-semibold">{formatUSD(cart.book.price)}</span></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm">Amount: <span className="font-semibold">{formatUSD(cart.quantity * cart.book.price)}</span></div>
                        <div className="text-md cursor-pointer underline text-red-500" onClick={() => handleClickRemove(cart)}>- Cart</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {carts.length > 0 &&
            <div className="flex flex-row">
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
          }
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="buyer_id">Buyer ID *</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="buyer_id" id="buyer_id" onChange={(e) => onChangeInput(e, 'buyer_id')} />
          {isSubmit && !orderPayload.buyer_id && <span className="text-sm text-red-500">buyer id is required</span>}
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="shipping_name">Shipping Name *</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="shipping_name" id="shipping_name" onChange={(e) => onChangeInput(e, 'shipping_name')} />
          {isSubmit && !orderPayload.shipping_name && <span className="text-sm text-red-500">shipping name is required</span>}
        </div>
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="shipping_phone">Shipping Phone *</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="shipping_phone" id="shipping_phone" onChange={(e) => onChangeInput(e, 'shipping_phone')} />
          {isSubmit && !orderPayload.shipping_phone && <span className="text-sm text-red-500">shipping phone is required</span>}
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="shipping_address">Shipping Address *</label>
        <textarea className="p-2 border-2 rounded-md" name="shipping_address" id="shipping_address" cols={30} rows={10} onChange={(e) => onChangeTextarea(e, 'shipping_address')}></textarea>
        {isSubmit && !orderPayload.shipping_address && <span className="text-sm text-red-500">shipping address is required</span>}
      </div>
      <button className="bg-gray-900 py-2 mb-4 w-full rounded-md text-white font-semibold" disabled={isLoadingPost} onClick={handleClickSubmit}>
        {isLoadingPost ? 'Loading...' : 'Submit'}
      </button>
    </div>
  )
}