import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-72 bg-slate-400 min-h-[100vh] px-10 pt-5">
      <Link href="/admin" className="mx-auto"><Image src="/bookstore.png" alt="" width={200} height={50} /></Link>
      <div className="mt-10 font-semibold mb-5 text-sm">DASHBOARD</div>
      <div className="flex flex-col gap-4">
        <Link href={'/admin'} className="underline text-lg font-semibold">Order</Link>
        <Link href={'/admin/book'} className="underline text-lg font-semibold">Book</Link>
      </div>
    </div>
  )
}