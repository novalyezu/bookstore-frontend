"use client"

import { ICreateBookPayload, useBookAdmin } from "@/hooks/bookAdmin";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateBook() {
  const [coverPreview, setCoverPreview] = useState("")
  const { isLoadingPost, book, updateBook, getBookById } = useBookAdmin()
  const [isSubmit, setIsSubmit] = useState(false)
  const [bookPayload, setBookPayload] = useState<ICreateBookPayload>({
    title: '',
    synopsis: '',
    author: '',
    publisher: '',
    publish_date: '',
    pages: '',
    quantity: '',
    price: '',
    cover_image_file: null
  });
  const params = useParams()
  let ignore = false;

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setBookPayload((prevState) => ({ ...prevState, [key]: e.target.value }))
  }

  const onChangeNumberInput = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setBookPayload((prevState) => ({ ...prevState, [key]: e.target.value }))
  }

  const onChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    setBookPayload((prevState) => ({ ...prevState, [key]: e.target.value }))
  }

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setBookPayload((prevState) => ({ ...prevState, [key]: e.target.files![0] }))
      setCoverPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleClickSubmit = () => {
    setIsSubmit(true)
    let isValid = true;

    if (!bookPayload.title || !bookPayload.author || !bookPayload.synopsis || !bookPayload.publisher || !bookPayload.publish_date ||
      !bookPayload.pages || !bookPayload.quantity || !bookPayload.price) {
      isValid = false;
    }

    if (isValid) {
      updateBook(params.id as string, bookPayload)
    }
  }

  useEffect(() => {
    if (book) {
      setBookPayload({
        title: book.title,
        synopsis: book.synopsis,
        author: book.author,
        publisher: book.publisher,
        publish_date: book.publish_date,
        pages: `${book.pages}`,
        quantity: `${book.quantity}`,
        price: `${book.price}`,
        cover_image_file: null
      })
      setCoverPreview(book.cover_image)
    }
  }, [book])

  useEffect(() => {
    if (!ignore) {
      getBookById(params.id as string)
    }
    return () => {
      ignore = true;
    }
  }, [])

  return (
    <div>
      <div className="text-2xl mb-4">Update Book</div>
      <div className="flex">
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="title">Title *</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="title" id="title"
            value={bookPayload.title} onChange={(e) => onChangeInput(e, 'title')} />
          {isSubmit && !bookPayload.title && <span className="text-sm text-red-500">title is required</span>}
        </div>
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="author">Author *</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="author" id="author"
            value={bookPayload.author} onChange={(e) => onChangeInput(e, 'author')} />
          {isSubmit && !bookPayload.author && <span className="text-sm text-red-500">author is required</span>}
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="synopsis">Synopsis *</label>
        <textarea className="p-2 border-2 rounded-md" name="synopsis" id="synopsis" cols={30} rows={10}
          value={bookPayload.synopsis} onChange={(e) => onChangeTextarea(e, 'synopsis')}></textarea>
        {isSubmit && !bookPayload.synopsis && <span className="text-sm text-red-500">synopsis is required</span>}
      </div>
      <div className="flex">
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="publisher">Publisher *</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="publisher" id="publisher"
            value={bookPayload.publisher} onChange={(e) => onChangeInput(e, 'publisher')} />
          {isSubmit && !bookPayload.publisher && <span className="text-sm text-red-500">publisher is required</span>}
        </div>
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="publish_date">Publish Date (YYYY) *</label>
          <input className="w-96 p-2 border-2 rounded-md" type="text" name="publish_date" id="publish_date"
            value={bookPayload.publish_date} onChange={(e) => onChangeInput(e, 'publish_date')} />
          {isSubmit && !bookPayload.publish_date && <span className="text-sm text-red-500">publish date is required</span>}
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="pages">Pages *</label>
          <input className="w-96 p-2 border-2 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number" name="pages" id="pages" value={bookPayload.pages} min={0} onChange={(e) => onChangeNumberInput(e, 'pages')} />
          {isSubmit && !bookPayload.pages && <span className="text-sm text-red-500">pages is required</span>}
        </div>
        <div className="flex flex-col mb-4 basis-1/2">
          <label htmlFor="quantity">Quantity *</label>
          <input className="w-96 p-2 border-2 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="number" name="quantity" id="quantity" value={bookPayload.quantity} min={0} onChange={(e) => onChangeNumberInput(e, 'quantity')} />
          {isSubmit && !bookPayload.quantity && <span className="text-sm text-red-500">quantity is required</span>}
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="price">Price *</label>
        <input className="w-96 p-2 border-2 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number" name="price" id="price" value={bookPayload.price} min={0} onChange={(e) => onChangeNumberInput(e, 'price')} />
        {isSubmit && !bookPayload.price && <span className="text-sm text-red-500">price is required</span>}
      </div>
      <div className="flex flex-col mb-4">
        {coverPreview && <Image src={coverPreview} width={100} height={50} alt="" />}
        <label htmlFor="cover_image">Cover Image</label>
        <input className="" type="file" name="cover_image" id="cover_image" onChange={(e) => onChangeFile(e, 'cover_image_file')} />
      </div>
      <button className="bg-gray-900 py-2 mb-4 w-full rounded-md text-white font-semibold" disabled={isLoadingPost} onClick={handleClickSubmit}>
        {isLoadingPost ? 'Loading...' : 'Submit'}
      </button>
    </div>
  )
}