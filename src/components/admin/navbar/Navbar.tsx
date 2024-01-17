"use client"

import { ROLE, useAuth } from "@/hooks/auth";
import { useGlobalState } from "@/hooks/state";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
  const { getMe, logout } = useAuth()
  const [user] = useGlobalState('user');
  const [isUserLoading] = useGlobalState('isUserLoading');
  const router = useRouter()
  let ignore = false;

  const handleClickLogout = () => {
    logout()
  }

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/')
      return;
    }
    if (!isUserLoading && user && user.role !== ROLE.ADMIN) {
      router.replace('/')
      return;
    }
  }, [isUserLoading, user])

  useEffect(() => {
    if (!ignore) {
      getMe();
    }
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="flex justify-end p-5 bg-slate-300">
      <div className="">
        <Link href="/" className="p-3 text-lg font-semibold" onClick={handleClickLogout}>Logout</Link>
      </div>
    </div>
  )
}