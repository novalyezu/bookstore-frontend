import { BASE_URL, KEYS } from "@/helper/constant";
import storage from "@/helper/storage";
import { toastError, toastSuccess } from "@/helper/toast";
import { IBaseErrorResponse, IBaseSuccessResponse, IPagination, IQueryParams } from "@/helper/type";
import { useRouter } from "next/navigation";
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

export interface ICreateBookPayload {
  title: string;
  synopsis: string;
  author: string;
  publisher: string;
  publish_date: string;
  pages: string;
  quantity: string;
  price: string;
  cover_image_file: any;
}

const useBookAdmin = () => {
  const token = storage.getItem(KEYS.token)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPost, setIsLoadingPost] = useState(false)
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
        setBooks(resData.data);
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

  const createBody = (bodyPayload: ICreateBookPayload) => {
    const formData = new FormData();
    formData.append('title', bodyPayload.title);
    formData.append('synopsis', bodyPayload.synopsis);
    formData.append('author', bodyPayload.author);
    formData.append('publisher', bodyPayload.publisher);
    formData.append('publish_date', bodyPayload.publish_date);
    formData.append('pages', bodyPayload.pages);
    formData.append('quantity', bodyPayload.quantity);
    formData.append('price', bodyPayload.price);
    formData.append('cover_image_file', bodyPayload.cover_image_file);
    return formData;
  }

  const createBook = async (bodyPayload: ICreateBookPayload) => {
    setIsLoadingPost(true);
    try {
      const formData = createBody(bodyPayload);

      const res = await fetch(`${BASE_URL}/api/v1/books`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        toastError(errRes.message)
      } else {
        const resData: IBaseSuccessResponse<IBookData> = await res.json();
        toastSuccess('Book created')
        router.push('/admin/book')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingPost(false)
    }
  }

  const updateBook = async (bookId: string, bodyPayload: ICreateBookPayload) => {
    setIsLoadingPost(true);
    try {
      const formData = createBody(bodyPayload);

      const res = await fetch(`${BASE_URL}/api/v1/books/${bookId}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        toastError(errRes.message)
      } else {
        const resData: IBaseSuccessResponse<IBookData> = await res.json();
        toastSuccess('Book updated')
        router.push('/admin/book')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingPost(false)
    }
  }

  const deleteBook = async (bookId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/v1/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        },
      })
      if (!res.ok) {
        const errRes: IBaseErrorResponse = await res.json();
        toastError(errRes.message)
      } else {
        toastSuccess('Book deleted')
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    isLoadingPost,
    books,
    book,
    pagination,
    getBooks,
    resetBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
  }
}

export { useBookAdmin }
