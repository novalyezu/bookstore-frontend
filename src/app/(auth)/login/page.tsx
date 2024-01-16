"use client";

import { ILoginPayload, useAuth } from "@/hooks/auth";
import { useGlobalState } from "@/hooks/state";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Login() {
  const { isLoading, login } = useAuth()
  const [user] = useGlobalState('user')
  const [loginPayload, setLoginPayload] = useState<ILoginPayload>({
    email: '',
    password: '',
  });
  const router = useRouter()
  const searchParams = useSearchParams();

  const onChangeEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPayload((prevState) => ({ ...prevState, email: e.target.value }))
  }

  const onChangePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPayload((prevState) => ({ ...prevState, password: e.target.value }))
  }

  const handleClickLogin = async () => {
    login(loginPayload)
  }

  useEffect(() => {
    if (user) {
      let redirect = searchParams.get('redirect');
      if (!redirect) {
        redirect = '/';
      }
      router.replace(redirect)
    }
  }, [user])

  return (
    <div className="w-96 mx-auto mt-10 min-h-[calc(100vh-268px)]">
      <div className="text-2xl text-gray-900 font-semibold mb-4">Login to Bookstore</div>
      <div className="flex flex-col mb-4">
        <label htmlFor="email">Email</label>
        <input className="w-full p-2 border-2 rounded-md" type="email" name="email" id="email" onChange={onChangeEmailInput} />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="password">Password</label>
        <input className="w-full p-2 border-2 rounded-md" type="password" name="password" id="password" onChange={onChangePasswordInput} />
      </div>
      <button className="bg-gray-900 py-2 mb-4 w-full rounded-md text-white font-semibold" onClick={handleClickLogin}
        disabled={isLoading}>Login</button>
      <div className="text-center text-gray-500">
        Don't have an account? <Link className="text-gray-900 font-semibold underline" href="/register">Register</Link>
      </div>
    </div>
  )
}