import { BASE_URL, KEYS } from "@/helper/constant";
import storage from "@/helper/storage";
import { IBaseErrorResponse, IBaseSuccessResponse, IPagination, IQueryParams } from "@/helper/type";
import { useState } from "react"

export interface IBookData {
  id: string;
  title: string;
  synopsis: string;
  author: string;
  publisher: string;
  publish_date: string;
  pages: number;
  quantity: number;
  price: number;
  cover_image: string;
  createdAt: Date,
}

export interface IBookQueryParams extends IQueryParams {
  search: string;
}

const useBook = () => {
  const token = storage.getItem(KEYS.token)
  const [isLoading, setIsLoading] = useState(true)
  const [books, setBooks] = useState<IBookData[]>([])
  const [book, setBook] = useState<IBookData>()
  const [pagination, setPagination] = useState<IPagination>()

  const getBooks = async (queryParams: IBookQueryParams) => {
    setIsLoading(true);
    try {
      const { page, limit, orderBy, search } = queryParams;
      const res = await fetch(`${BASE_URL}/api/v1/books?page=${page}&limit=${limit}&orderBy=${orderBy}&search=${search}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
      } else {
        const resData: IBaseSuccessResponse<IBookData[]> = await res.json();
        setBooks((prevState) => [...prevState, ...resData.data]);
        setPagination(resData.meta);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetBooks = () => {
    setBooks([]);
  }

  const getBookById = async (bookId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/books/${bookId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
      } else {
        const resData: IBaseSuccessResponse<IBookData> = await res.json();
        setBook(resData.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    books,
    book,
    pagination,
    getBooks,
    resetBooks,
    getBookById,
  }
}

export { useBook }
