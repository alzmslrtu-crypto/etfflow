'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="font-bold text-lg text-foreground hover:text-primary transition-colors">
          ETF Flow
        </Link>

        {/* 네비게이션 - 데스크톱 */}
        <nav className="hidden md:flex items-center gap-7">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ETF 비교
          </Link>
          <Link href="/etf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ETF 모음
          </Link>
          <Link href="/tools/drip" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            배당 계산기
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            블로그
          </Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            소개
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            피드백
          </Link>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              ETF 비교
            </Link>
            <Link
              href="/etf"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              ETF 모음
            </Link>
            <Link
              href="/tools/drip"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              배당 계산기
            </Link>
            <Link
              href="/blog"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              블로그
            </Link>
            <Link 
              href="/about" 
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              소개
            </Link>
            <Link 
              href="/contact" 
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              피드백
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
