"use client"

import { formatUSD } from "@/helper/utils";
import { useBook } from "@/hooks/book";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLoading, books, resetBooks, pagination, getBooks } = useBook();
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [orderBy, setOrderBy] = useState("createdAt__desc")
  const [search, setSearch] = useState("")
  let ignore = false;

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const onKeyDownSearchInput = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      resetBooks()
      getBooks({ page: 1, limit, orderBy, search })
    }
  }

  const handleClickLoadMore = () => {
    setPage(pagination?.nextPage!);
  }

  useEffect(() => {
    if (!ignore) {
      getBooks({ page, limit, orderBy, search });
    }
    return () => {
      ignore = true
    }
  }, [page])

  return (
    <div className="flex flex-col min-h-[calc(100vh-225px)]">
      <div className="mx-auto -mt-8 relative">
        <svg className="fill-gray-500 absolute top-6 left-6" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" role="img">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.6002 12.0498C9.49758 12.8568 8.13777 13.3333 6.66667 13.3333C2.98477 13.3333 0 10.3486 0 6.66667C0 2.98477 2.98477 0 6.66667 0C10.3486 0 13.3333 2.98477 13.3333 6.66667C13.3333 8.15637 12.8447 9.53194 12.019 10.6419C12.0265 10.6489 12.0338 10.656 12.0411 10.6633L15.2935 13.9157C15.6841 14.3063 15.6841 14.9394 15.2935 15.33C14.903 15.7205 14.2699 15.7205 13.8793 15.33L10.6269 12.0775C10.6178 12.0684 10.6089 12.0592 10.6002 12.0498ZM11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z"></path>
        </svg>
        <input type="text" className="w-[32rem] py-5 pl-14 pr-5 shadow-lg rounded-md" placeholder="Search..." onChange={onChangeSearchInput}
          onKeyDown={onKeyDownSearchInput}></input>
      </div>
      <div className="flex flex-wrap justify-center gap-10 mt-10 mb-10">
        {books.map(book => {
          return (
            <Link prefetch={false} href={'/book/' + book.id} key={book.id}>
              <div className="w-64 shadow-lg rounded-md p-5 cursor-pointer hover:shadow-md transition-shadow">
                <Image src={book.cover_image} alt="" width={200} height={70}
                  className="mx-auto" />
                <div className="mt-3 text-lg font-semibold">{book.title}</div>
                <div className="-mt-1 text-sm text-gray-500">by {book.author}</div>
                <div className="mt-2">{formatUSD(book.price)}</div>
              </div>
            </Link>
          )
        })}
      </div>
      {!isLoading && books.length === 0 &&
        <div className="mx-auto text-center text-2xl">
          No books found
        </div>
      }
      {!isLoading && pagination?.nextPage &&
        <div className="mx-auto mt-10 mb-20">
          <button className="bg-gray-900 text-white px-5 py-3 rounded-md font-semibold" onClick={handleClickLoadMore}>load more</button>
        </div>
      }
    </div>
  )
}
