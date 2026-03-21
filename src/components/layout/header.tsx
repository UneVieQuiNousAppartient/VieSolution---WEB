'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-lg font-bold text-white">Vie<span className="gradient-text">Solution</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>
                {item.children && openDropdown === item.href && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-[#111118] rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/diagnostic">
              <Button variant="outline" size="sm">Diagnostic gratuit</Button>
            </Link>
            <Link href="/contact">
              <Button size="sm">Nous contacter</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#111118] border-t border-white/5 px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block py-2 text-gray-300 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-1.5 text-sm text-gray-500 hover:text-blue-400"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
            <Link href="/diagnostic" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Diagnostic gratuit</Button>
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">Nous contacter</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
