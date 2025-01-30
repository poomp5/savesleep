import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'
import BottomNav from './components/bottom-nav'


const kanit = Kanit({ subsets: ['thai'], weight: '400' })

export const metadata: Metadata = {
  title: 'SaveSleep - เก็บชั่วโมงนอน ให้หลับฝันดี',
  description: 'ติดตามการนอนของคุณ และเก็บข้อมูลการนอนให้ครบถ้วน ให้หลับฝันดี',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <link rel="icon" href={'/profile.png'}/>
      <link rel="apple-touch-icon" href={'/profile.png'} />
      <body className={kanit.className}>
        <main className="min-h-screen pb-16">
            {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}