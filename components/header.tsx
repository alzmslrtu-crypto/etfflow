'use client'

import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type NavItem = { href: string; label: string }
type NavGroup = { label: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    label: 'ETF',
    items: [
      { href: '/#compare', label: 'ETF 비교' },
      { href: '/etf', label: 'ETF 모음' },
      { href: '/etf/screener', label: 'ETF 파인더 (전체)' },
    ],
  },
  {
    label: '계산기',
    items: [
      { href: '/tools/dividend-goal', label: '월 배당금 목표 계산기' },
      { href: '/tools/drip', label: 'DRIP 복리 계산기' },
      { href: '/tools/tax', label: '배당소득세 계산기' },
      { href: '/tools/exchange', label: '환율 계산기' },
      { href: '/tools/dividend-yield', label: '배당수익률 계산기' },
      { href: '/tools/risk-profile', label: '투자 성향 테스트' },
    ],
  },
  {
    label: '가이드',
    items: [
      { href: '/blog', label: '배당 투자 블로그' },
      { href: '/glossary', label: '투자 용어 사전' },
    ],
  },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="font-bold text-lg text-foreground hover:text-primary transition-colors">
          ETF Flow
        </Link>

        {/* 데스크톱 네비 (드롭다운) */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((group) => (
            <div key={group.label} className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {group.label}
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              {/* 드롭다운 패널 (pt-2로 hover 끊김 방지) */}
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
                <div className="min-w-[200px] bg-card border border-border rounded-xl shadow-xl p-1.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-card max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-5">
            {NAV.map((group) => (
              <div key={group.label}>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{group.label}</div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-sm text-foreground hover:text-primary transition-colors py-1.5 pl-2"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-border flex gap-4 text-sm text-muted-foreground">
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-foreground">소개</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-foreground">피드백</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
