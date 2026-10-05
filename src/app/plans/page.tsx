'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Bookmark, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { PlantMonitorHeroIllustration, DeskLightIllustration } from '@/components/common/Illustrations';

export default function PlansListPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setPlans(data.projects || []);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
          04 / Inventory-adapted project plans
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
          My project plans
        </h1>
        <p className="text-sm text-[#5A6B63] mt-1">
          Saved builds adapted to your exact bench components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-3xl p-6 border border-[#E5EDE8] shadow-xs flex flex-col justify-between space-y-5 hover:border-[#1C5B46] transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F6F5EE] text-[#5A6B63] font-medium">
                  Project / {project.projectNumber}
                </span>
                <span className="bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                  {project.matchResult?.feasibilityScore || 86}% feasible
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden bg-[#1B4D3E] h-40 flex items-center justify-center">
                {project.projectNumber === '014' ? (
                  <PlantMonitorHeroIllustration className="w-full h-full object-cover" />
                ) : (
                  <DeskLightIllustration className="w-full h-full object-cover" />
                )}
              </div>

              <div>
                <h3 className="text-2xl font-serif text-[#11221B] leading-tight">
                  {project.title}
                </h3>
                <p className="text-xs text-[#5A6B63] mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] text-[#5A6B63] font-mono pt-1">
                <span>⏱ {project.estimatedHours}</span>
                <span>•</span>
                <span>≈ ${project.estimatedExtraCost?.toFixed(2) || '4.50'} extra</span>
                <span>•</span>
                <span>13 parts reused</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EFE6] flex items-center justify-between">
              <span className="text-xs text-[#1B6F3E] font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready to build</span>
              </span>

              <Link
                href={`/plans/${project.id}`}
                className="px-4 py-2 rounded-xl bg-[#0F382A] hover:bg-[#144232] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <span>Open build plan</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4F55C]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
