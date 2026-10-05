'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowUpRight, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname === '/') return 'Workbench';
    if (pathname.startsWith('/identify')) return 'Identify a component';
    if (pathname.startsWith('/inventory')) return 'My inventory';
    if (pathname.startsWith('/discover')) return 'Discover projects';
    if (pathname.startsWith('/plans')) return 'My project plans';
    if (pathname.startsWith('/impact')) return 'Community impact';
    if (pathname.startsWith('/classroom')) return 'Classroom & teams';
    return 'Workbench';
  };

  return (
    <header className="h-14 border-b border-[#E8E6DC] bg-[#F6F5EE] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-[#5A6B63] hover:bg-[#ECE9DD]"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#5A6B63]">
          <span>Personal workspace</span>
          <span className="mx-2 text-[#9EAEA5]">/</span>
          <span className="font-medium text-[#11221B]">{getBreadcrumb()}</span>
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        {/* Illustrative Demo Badge */}
        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-[#ECE9DD] text-[#34483E] border border-[#DDD9CD]">
          Illustrative Demo
        </span>

        {/* Notifications */}
        <button
          className="p-1.5 rounded-lg text-[#5A6B63] hover:text-[#11221B] hover:bg-[#ECE9DD] transition-colors relative"
          aria-label="Notifications"
          onClick={() => alert('All hardware checks normal. No urgent notifications.')}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#1C5B46]" />
        </button>

        {/* Help & Safety link */}
        <Link
          href="https://en.wikipedia.org/wiki/Electronic_waste"
          target="_blank"
          className="text-xs font-medium text-[#5A6B63] hover:text-[#11221B] flex items-center space-x-1 transition-colors"
        >
          <span>Help & safety</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#5A6B63]" />
        </Link>
      </div>
    </header>
  );
}
