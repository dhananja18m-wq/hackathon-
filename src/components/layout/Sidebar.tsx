'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Scan,
  Layers,
  Compass,
  FileText,
  Globe,
  Users,
  Sprout,
  ChevronDown,
  Check,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isComingSoon?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'Workbench', href: '/', icon: LayoutGrid },
  { label: 'Identify a component', href: '/identify', icon: Scan },
  { label: 'My inventory', href: '/inventory', icon: Layers },
  { label: 'Discover projects', href: '/discover', icon: Compass },
  { label: 'My project plans', href: '/plans', icon: FileText },
];

const beyondNavItems: NavItem[] = [
  { label: 'Community impact', href: '/impact', icon: Globe },
  { label: 'Maker gallery', href: '/community', icon: Sprout },
  { label: 'Classroom & teams', href: '/classroom', icon: Users },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Alex's maker bench");

  const workspaces = ["Alex's maker bench", "ECE Hardware Lab", "Robotics Club Workspace"];

  return (
    <aside
      className={cn(
        'w-64 bg-[#0F382A] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#174A38] select-none',
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col p-4 space-y-5">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-lg bg-[#D4F55C] flex items-center justify-center text-[#0F382A] shadow-sm">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M9 9h6v6H9z" />
              <path d="M9 2v2" />
              <path d="M15 2v2" />
              <path d="M9 20v2" />
              <path d="M15 20v2" />
              <path d="M20 9h2" />
              <path d="M20 15h2" />
              <path d="M2 9h2" />
              <path d="M2 15h2" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            reboard
          </span>
        </div>

        {/* Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="w-full text-left bg-[#133E2E] hover:bg-[#184B38] transition-colors border border-[#1F5441] rounded-xl px-3 py-2.5 flex items-center justify-between group"
            aria-expanded={workspaceMenuOpen}
          >
            <div className="overflow-hidden">
              <div className="text-[10px] tracking-wider uppercase text-[#8EA69B] font-mono font-medium">
                Personal Workspace
              </div>
              <div className="text-sm font-medium text-white truncate group-hover:text-[#D4F55C] transition-colors">
                {currentWorkspace}
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-[#8EA69B] transition-transform duration-200',
                workspaceMenuOpen && 'rotate-180 text-white'
              )}
            />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#133E2E] border border-[#1F5441] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] uppercase font-mono text-[#8EA69B]">
                Your Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setWorkspaceMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1B523E] transition-colors text-white"
                >
                  <span className="truncate">{ws}</span>
                  {currentWorkspace === ws && <Check className="w-3.5 h-3.5 text-[#D4F55C]" />}
                </button>
              ))}
              <div className="border-t border-[#1F5441] mt-1 pt-1">
                <button
                  onClick={() => {
                    alert('Create workspace flow ready for Phase 2');
                    setWorkspaceMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#D4F55C] hover:bg-[#1B523E] flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New workspace...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 pt-1" aria-label="Main Navigation">
          {mainNavItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#D4F55C] text-[#0F382A] font-semibold shadow-sm'
                    : 'text-[#C5D5CD] hover:text-white hover:bg-[#144232]'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isActive ? 'text-[#0F382A]' : 'text-[#8EA69B]'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Beyond Your Bench Navigation */}
        <div className="pt-3">
          <div className="text-[10px] tracking-wider uppercase text-[#8EA69B] font-mono px-3.5 pb-2">
            Beyond your bench
          </div>
          <nav className="space-y-1" aria-label="Secondary Navigation">
            {beyondNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#D4F55C] text-[#0F382A] font-semibold shadow-sm'
                      : 'text-[#C5D5CD] hover:text-white hover:bg-[#144232]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0F382A]' : 'text-[#8EA69B]'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-4">
        {/* Brand Quote Card */}
        <div className="bg-[#144232] border border-[#1D5642] rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-[#D4F55C] mb-2">
            <Sprout className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-lg leading-tight text-white mb-1.5">
            Good parts deserve a second act.
          </h4>
          <p className="text-xs text-[#9BB5A9] leading-relaxed">
            Start small. Build something that matters.
          </p>
        </div>

        {/* User Profile */}
        <div className="pt-2 border-t border-[#174A38] flex items-center space-x-3 px-1">
          <div className="w-9 h-9 rounded-full bg-[#E5EDE8] text-[#0F382A] font-bold text-xs flex items-center justify-center shrink-0">
            AK
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium text-white truncate">
              Alex Kim
            </div>
            <div className="text-xs text-[#8EA69B] truncate">
              Student / Maker
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
