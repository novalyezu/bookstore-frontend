"use client"

import { IRegisterPayload, useAuth } from "@/hooks/auth";
import { useGlobalState } from "@/hooks/state";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Register() {
  const router = useRouter()
  const { isLoading, register } = useAuth()
  const [user] = useGlobalState('user')
  const [isSubmit, setIsSubmit] = useState(false)
  const [registerPayload, setRegisterPayload] = useState<IRegisterPayload>({
    email: '',
    name: '',
    password: '',
  });

  const onChangeEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterPayload((prevState) => ({ ...prevState, email: e.target.value }))
  }

  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterPayload((prevState) => ({ ...prevState, name: e.target.value }))
  }

  const onChangePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterPayload((prevState) => ({ ...prevState, password: e.target.value }))
  }

  const handleClickRegister = async () => {
    setIsSubmit(true)
    let isValid = true;

    if (!registerPayload.name || !registerPayload.email || !registerPayload.password) {
      isValid = false;
    }

    if (isValid) {
      register(registerPayload)
        .then(() => {
          if (user) {
            router.replace('/')
          }
        })
    }
  }

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user])

  return (
    <div className="w-96 mx-auto mt-10 min-h-[calc(100vh-268px)]">
      <div className="text-2xl text-gray-900 font-semibold mb-4">Register to Bookstore</div>
      <div className="flex flex-col mb-4">
        <label htmlFor="name">Name *</label>
        <input className="w-full p-2 border-2 rounded-md" type="text" name="name" id="name" onChange={onChangeNameInput} />
        {isSubmit && !registerPayload.name && <span className="text-sm text-red-500">name is required</span>}
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="email">Email *</label>
        <input className="w-full p-2 border-2 rounded-md" type="email" name="email" id="email" onChange={onChangeEmailInput} />
        {isSubmit && !registerPayload.email && <span className="text-sm text-red-500">email is required</span>}
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="password">Password *</label>
        <input className="w-full p-2 border-2 rounded-md" type="password" name="password" id="password" onChange={onChangePasswordInput} />
        {isSubmit && !registerPayload.password && <span className="text-sm text-red-500">password is required</span>}
      </div>
      <button className="bg-gray-900 py-2 mb-4 w-full rounded-md text-white font-semibold" onClick={handleClickRegister}
        disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Register'}
      </button>
      <div className="text-center text-gray-500">
        Already have an account? <Link className="text-gray-900 font-semibold underline" href="/login">Login</Link>
      </div>
    </div>
  )
}