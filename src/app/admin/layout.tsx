import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify'
import Sidebar from '@/components/admin/sidebar/Sidebar';
import Navbar from '@/components/admin/navbar/Navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bookstore',
  description: 'Bookstore for shopping books',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <div className='flex flex-row'>
          <Sidebar />
          <div className='w-full'>
            <Navbar />
            <div className='p-10'>{children}</div>
          </div>
        </div>
      </body>
    </html>
  )
}
