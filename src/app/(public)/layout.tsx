import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'react-toastify/dist/ReactToastify.min.css';
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { ToastContainer } from 'react-toastify'

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
        <div className='container max-w-screen-xl mx-auto'>
          <Navbar />
        </div>
        <div className='w-full h-20 bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100'></div>
        <div className='container max-w-screen-xl mx-auto'>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
