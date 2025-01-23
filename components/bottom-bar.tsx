'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react'

const BottomBar = () => {
  const t = useTranslations('nav')

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs">{t('home')}</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center">
          <Search className="h-6 w-6" />
          <span className="text-xs">{t('search')}</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs">{t('cart')}</span>
        </Link>
        <Link href="/favorites" className="flex flex-col items-center">
          <Heart className="h-6 w-6" />
          <span className="text-xs">{t('favorites')}</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center">
          <User className="h-6 w-6" />
          <span className="text-xs">{t('profile')}</span>
        </Link>
      </div>
    </div>
  )
}

export default BottomBar

