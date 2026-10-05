'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Scan, ArrowUpRight, ArrowRight, Sparkles, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { ResilientImage } from '@/components/common/ResilientImage';
import { PLANT_MONITOR_IMAGE } from '@/lib/media';

export default function WorkbenchPage() {
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/projects?filter=for_inventory&sort=recommended'),
        ]);

        if (statsRes.ok && projectsRes.ok) {
          const statsData = await statsRes.json();
          const projectsData = await projectsRes.json();
          setStats(statsData);
          setProjects(projectsData.projects || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProject = projects.find((p) => p.projectNumber === '014') || projects[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
            Your next idea is already on your bench
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
            Welcome back, Alex.
          </h1>
          <p className="text-sm text-[#5A6B63] mt-1">
            Turn the parts you have into something worth making.
          </p>
        </div>

        <Link
          href="/identify"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0F382A] hover:bg-[#144232] text-white font-medium text-sm transition-all duration-150 shadow-sm active:scale-95 shrink-0"
        >
          <Scan className="w-4 h-4 text-[#D4F55C]" />
          <span>Identify a component</span>
        </Link>
      </div>

      {/* Featured Match Hero Card (Deep Forest Green) */}
      <div className="bg-[#0F382A] text-white rounded-3xl overflow-hidden border border-[#184F3B] shadow-sm relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Hero Content */}
          <div className="p-7 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                  Matched to your inventory
                </span>
                <span className="text-xs font-mono text-[#8EA69B] uppercase tracking-wider">
                  Project / {featuredProject?.projectNumber || '014'}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-[1.15] text-white">
                {featuredProject?.tagline || 'A second life for your parts. A little help for your plants.'}
              </h2>

              <p className="text-sm text-[#B4CDC1] leading-relaxed max-w-xl">
                {featuredProject?.description ||
                  'Build a smart plant monitor with your rescued Arduino, moisture sensor and LEDs.'}
              </p>
            </div>

            {/* Metrics & Feasibility */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#C5DCD1]">
              <span className="text-[#D4F55C] font-semibold text-sm">
                {featuredProject?.matchResult?.feasibilityScore || 86}% feasible
              </span>
              <span>•</span>
              <span>≈ ${featuredProject?.estimatedExtraCost?.toFixed(2) || '4.50'} extra</span>
              <span>•</span>
              <span>{featuredProject?.estimatedHours || '2–3 hours'}</span>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center space-x-4">
              <Link
                href={`/plans/${featuredProject?.id || 'default'}`}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#D4F55C] text-[#0F382A] font-semibold text-sm hover:bg-[#C2E83E] transition-colors shadow-sm"
              >
                <span>Explore project</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-[#8EA69B] font-medium">
                {featuredProject?.difficulty || 'Beginner friendly'}
              </span>
            </div>
          </div>

          {/* Right Hero Image / Engineered Visual */}
          <div className="lg:col-span-5 h-full p-4 lg:p-6 flex items-center justify-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-[#1C5B46] bg-[#0A261C]">
              <ResilientImage
                src={PLANT_MONITOR_IMAGE}
                alt="Arduino circuit board and hand tools arranged on a maker workbench"
                priority
                className="w-full h-64 lg:h-72 object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                fallbackClassName="w-full h-64 lg:h-72"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Parts on bench */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5EDE8] shadow-xs">
          <div className="text-xs font-medium text-[#5A6B63] mb-2">
            Parts on your bench
          </div>
          <div className="text-3xl font-serif text-[#11221B] font-normal">
            {stats?.componentsCount || 24}
          </div>
          <div className="text-xs text-[#7E9187] mt-2">
            Across {stats?.componentTypesCount || 8} component types
          </div>
        </div>

        {/* Card 2: Potential project matches */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5EDE8] shadow-xs">
          <div className="text-xs font-medium text-[#5A6B63] mb-2">
            Potential project matches
          </div>
          <div className="text-3xl font-serif text-[#11221B] font-normal">
            {stats?.projectsMatchesCount || 12}
          </div>
          <div className="text-xs text-[#7E9187] mt-2">
            Matched by what your parts can do
          </div>
        </div>

        {/* Card 3: Parts given a second life */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5EDE8] shadow-xs">
          <div className="text-xs font-medium text-[#5A6B63] mb-2">
            Parts given a second life
          </div>
          <div className="text-3xl font-serif text-[#11221B] font-normal">
            {stats?.impact?.partsReusedCount || 6}
          </div>
          <div className="text-xs text-[#7E9187] mt-2">
            In your {stats?.impact?.completedBuildsCount || 2} completed demo builds
          </div>
        </div>

        {/* Card 4: Reuse mass (Deep Green card) */}
        <div className="bg-[#0F382A] text-white rounded-2xl p-5 border border-[#184F3B] shadow-xs">
          <div className="text-xs font-medium text-[#8EA69B] mb-2">
            Reuse mass · illustrative
          </div>
          <div className="text-3xl font-serif text-[#D4F55C] font-normal flex items-baseline space-x-1.5">
            <span>{stats?.impact?.reusedMassKg || '0.18'}</span>
            <span className="text-lg font-sans font-normal text-[#D4F55C]">kg</span>
          </div>
          <div className="text-xs text-[#8EA69B] mt-2">
            Estimated mass used in completed builds
          </div>
        </div>
      </div>

      {/* Lower Section: Made for what you have */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif text-[#11221B]">
              Made for what you have
            </h3>
            <p className="text-xs text-[#5A6B63]">
              Small builds. Shared impact.
            </p>
          </div>
          <Link
            href="/discover"
            className="text-xs font-medium text-[#11221B] hover:text-[#144232] flex items-center space-x-1"
          >
            <span>View all 12 matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.slice(0, 3).map((project) => (
            <Link
              key={project.id}
              href={`/plans/${project.id}`}
              className="group bg-white rounded-2xl p-5 border border-[#E5EDE8] hover:border-[#1C5B46] transition-all duration-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F6F5EE] text-[#5A6B63] font-medium">
                    Project / {project.projectNumber}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#144232] bg-[#E4FA8A] px-2 py-0.5 rounded">
                    {project.matchResult?.feasibilityScore || 85}% feasible
                  </span>
                </div>
                <h4 className="font-serif text-lg text-[#11221B] group-hover:text-[#0F382A] transition-colors leading-snug">
                  {project.title}
                </h4>
                <p className="text-xs text-[#5A6B63] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EFE6] flex items-center justify-between text-xs text-[#7E9187]">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{project.estimatedHours}</span>
                </div>
                <div className="flex items-center space-x-1 text-[#0F382A] font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>View plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
