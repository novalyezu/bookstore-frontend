"use client"

import { toastError } from "@/helper/toast"
import { formatUSD } from "@/helper/utils"
import { useBook } from "@/hooks/book"
import { useCart } from "@/hooks/cart"
import { useGlobalState } from "@/hooks/state"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const StockComp = (props: any) => {
  if (props.quantity <= 0) {
    return (
      <span className="text-red-500">Out of stock!</span>
    )
  }
  return (
    <>
      <span className="text-purple-500">{props.quantity}</span> pcs
    </>
  )
}

export default function BookDetail() {
  const [user] = useGlobalState('user')
  const { isLoading, book, getBookById } = useBook()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const params = useParams()
  let ignore = false;

  const onChangeQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value))
  }

  const handleClickDecreaseQty = () => {
    if (quantity <= 1) {
      return;
    }
    setQuantity((prevState) => prevState - 1)
  }

  const handleClickIncreaseQty = () => {
    if (quantity >= book!.quantity) {
      return;
    }
    setQuantity((prevState) => prevState + 1)
  }

  const handleClickAddToCart = () => {
    if (!user) {
      router.push(`/login?redirect=/book/${params.id}`)
      return;
    }
    if (quantity <= 0 || quantity > book!.quantity) {
      toastError(`Min qty is 1 and max qty is ${book!.quantity}`);
      return;
    }
    addToCart({
      book_id: params.id as string,
      quantity: quantity,
    })
  }

  useEffect(() => {
    if (!ignore) {
      getBookById(params.id as string)
    }
    return () => {
      ignore = true;
    }
  }, [])

  return (
    <div className="flex flex-row pt-10 h-[calc(100vh-5rem)]">
      {!isLoading && book &&
        <>
          <div className="basis-1/2">
            <Image src={book.cover_image} alt="" width={400} height={200}
              className=" mx-auto" />
          </div>
          <div className="basis-1/2">
            <div className="text-5xl font-semibold">{book.title}</div>
            <div className="text-gray-500">by <span className="text-purple-500">{book.author}</span> (Author)</div>
            <hr className="my-3" />
            <div className="">{book.synopsis}</div>
            <hr className="my-3" />
            <div className="text-gray-500">Publisher: <span className="text-purple-500">{book.publisher}</span></div>
            <div className="text-gray-500">Publish Date: <span className="text-purple-500">{book.publish_date}</span></div>
            <div className="text-gray-500">Pages: <span className="text-purple-500">{book.pages}</span></div>
            <div className="text-gray-500">Stock: <StockComp quantity={book.quantity} /></div>
            <div className="mt-3 text-2xl font-semibold">{formatUSD(book.price)}</div>
            <hr className="my-3" />
            <div>
              <button className="bg-transparent px-3 border-b-2 text-gray-900 font-semibold text-3xl" onClick={handleClickDecreaseQty}>-</button>
              <input type="number" className="w-10 mx-10 border-b-2 text-center text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onChange={onChangeQuantityInput} value={quantity} min={0} max={book.quantity} />
              <button className="bg-transparent px-3 border-b-2 text-gray-900 font-semibold text-3xl" onClick={handleClickIncreaseQty}>+</button>
            </div>
            <button className="bg-gray-900 py-2 mt-6 w-48 text-white font-semibold rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={book.quantity <= 0} onClick={handleClickAddToCart}>Add to Cart</button>
          </div>
        </>
      }
      {!isLoading && !book &&
        <div className="mx-auto text-center">
          <div className="text-5xl font-semibold">404</div>
          <div className="text-2xl">
            Book not found
          </div>
          <div className="mt-10">
            <Link href={'/'} className="bg-gray-900 py-2 px-4 rounded-md text-white font-semibold">Back to Home</Link>
          </div>
        </div>
      }
    </div>
  )
}
