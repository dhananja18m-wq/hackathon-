'use client';

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Bookmark, ThumbsUp, GitFork, Tag, Clock } from 'lucide-react';
import { ResilientImage } from '@/components/common/ResilientImage';
import { PLANT_MONITOR_IMAGE } from '@/lib/media';

interface Publication {
  id: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: string;
  category: string;
  estimatedHours: string;
  coverImageUrl?: string | null;
  partsReusedCount: number;
  divertedMassKg: number;
  tags: string[];
  remixCount: number;
  helpfulCount: number;
  createdAt: string;
  author: { name: string };
}

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

function PublicationCard({ pub, onRemix }: { pub: Publication; onRemix: (id: string) => void }) {
  const [remixing, setRemixing] = useState(false);
  const [remixed, setRemixed] = useState(false);

  async function handleRemix() {
    setRemixing(true);
    try {
      const res = await fetch(`/api/community/${pub.id}/remix`, { method: 'POST' });
      if (res.ok) {
        setRemixed(true);
        onRemix(pub.id);
      }
    } finally {
      setRemixing(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E5EDE8] shadow-xs overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="h-28 bg-[#123F30] overflow-hidden">
        <ResilientImage src={pub.coverImageUrl || PLANT_MONITOR_IMAGE} alt={`${pub.title} completed electronics reuse project`} className="w-full h-full object-cover" fallbackClassName="w-full h-full" />
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-3">
        {/* Difficulty + tags */}
        <div className="flex items-center space-x-2 flex-wrap gap-1">
          <span
            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
              pub.difficulty.toLowerCase().includes('beginner')
                ? 'bg-[#E4FA8A] text-[#0F382A]'
                : pub.difficulty.toLowerCase().includes('intermediate')
                ? 'bg-[#FFF9C4] text-[#78610A]'
                : 'bg-[#FFE4E4] text-[#9B1C1C]'
            }`}
          >
            {pub.difficulty}
          </span>
          {pub.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-2 py-0.5 bg-[#F0F7F4] text-[#5A6B63] rounded border border-[#E5EDE8]"
            >
              {t}
            </span>
          ))}
        </div>

        <div>
          <h3 className="font-serif text-[#11221B] text-base leading-snug">{pub.title}</h3>
          <p className="text-xs text-[#5A6B63] mt-1 leading-relaxed line-clamp-2">{pub.description}</p>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-mono text-[#7E9187]">
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{pub.estimatedHours}</span>
          </span>
          <span>by {pub.author.name}</span>
        </div>

        <div className="flex-1" />

        <div className="text-[10px] font-mono text-[#5A6B63] bg-[#F0F7F4] rounded-lg px-2.5 py-2">
          {pub.partsReusedCount} parts reused · {pub.divertedMassKg.toFixed(2)} kg estimated diversion
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F7F4]">
          <div className="flex items-center space-x-3 text-xs text-[#7E9187]">
            <span className="flex items-center space-x-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{pub.remixCount} remixes</span>
            </span>
            <span className="flex items-center space-x-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{pub.helpfulCount}</span>
            </span>
          </div>
          <button
            onClick={handleRemix}
            disabled={remixing || remixed}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              remixed
                ? 'bg-[#D4F55C] text-[#0F382A] cursor-default'
                : 'bg-[#0F382A] text-white hover:bg-[#144232]'
            }`}
          >
            <GitFork className="w-3 h-3" />
            <span>{remixed ? 'Remixed!' : remixing ? 'Adding…' : 'Remix'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (difficulty !== 'all') params.set('difficulty', difficulty);
    const res = await fetch(`/api/community?${params}`);
    const json = await res.json();
    setPublications(json.publications ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  function handleRemix(id: string) {
    setPublications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, remixCount: p.remixCount + 1 } : p))
    );
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
          Community · Phase 3
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
          Maker gallery
        </h1>
        <p className="text-sm text-[#5A6B63] mt-1">
          Explore and remix projects published by the SECONDLIFE community.
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex items-center space-x-3 flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E9187]" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E5EDE8] rounded-xl focus:outline-none focus:border-[#0F382A] transition-colors text-[#11221B] placeholder:text-[#B0BDB8]"
          />
        </div>
        <div className="flex items-center space-x-1 bg-white border border-[#E5EDE8] rounded-xl p-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                difficulty === d
                  ? 'bg-[#0F382A] text-white shadow-sm'
                  : 'text-[#5A6B63] hover:text-[#0F382A]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          onClick={load}
          className="p-2.5 rounded-xl border border-[#E5EDE8] bg-white text-[#5A6B63] hover:text-[#0F382A] hover:border-[#0F382A] transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-[#E5EDE8] h-56 animate-pulse" />
          ))}
        </div>
      ) : publications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5EDE8] p-12 text-center space-y-2">
          <Tag className="w-8 h-8 text-[#D4F55C] mx-auto" />
          <p className="text-sm font-serif text-[#0F382A]">No projects found</p>
          <p className="text-xs text-[#7E9187]">Try adjusting your search or difficulty filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publications.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} onRemix={handleRemix} />
          ))}
        </div>
      )}
    </div>
  );
}
