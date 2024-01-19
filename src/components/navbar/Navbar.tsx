"use client"

import { ROLE, useAuth } from "@/hooks/auth"
import { useGlobalState } from "@/hooks/state"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

export default function Navbar() {
  const { getMe, logout } = useAuth()
  const [user] = useGlobalState('user');
  let ignore = false;

  const handleClickLogout = () => {
    logout();
  }

  useEffect(() => {
    if (!ignore) {
      getMe();
    }
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="p-5 flex justify-between">
      <Link href="/"><Image src="/bookstore.png" alt="" width={200} height={50} /></Link>
      <div className="flex gap-3">
        {user &&
          <>
            {user.role === ROLE.ADMIN &&
              <Link href="/admin" className="p-3 text-lg font-semibold">Dashboard</Link>
            }
            <Link href="/" className="p-3 text-lg font-semibold">Home</Link>
            <Link href="/cart" className="p-3 text-lg font-semibold">Cart</Link>
            <Link href="/order" className="p-3 text-lg font-semibold">Order</Link>
            <div className="p-3">|</div>
            <Link href="/" className="p-3 text-lg font-semibold" onClick={handleClickLogout}>Logout</Link>
          </>
        }
        {!user &&
          <>
            <Link href="/" className="p-3 text-lg font-semibold">Home</Link>
            <Link href="/login" className="p-3 text-lg font-semibold">Login</Link>
            <Link href="/register" className="p-3 text-lg font-semibold text-white bg-gray-900 rounded-xl">Register</Link>
          </>
        }
      </div>
    </div>
  )
}