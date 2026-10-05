'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  RefreshCw,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  DollarSign,
  Sliders,
  Plus,
  X,
  ShieldAlert,
  Check,
  Zap,
  Bookmark
} from 'lucide-react';
import { ResilientImage } from '@/components/common/ResilientImage';
import { PLANT_MONITOR_IMAGE } from '@/lib/media';

export default function DiscoverProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('for_inventory');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Generator Modal State
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [goalText, setGoalText] = useState('Build an automated watering assistant for desk plants');
  const [skillLevel, setSkillLevel] = useState<'Beginner friendly' | 'Intermediate' | 'Advanced'>('Beginner friendly');
  const [intendedUse, setIntendedUse] = useState<string>('Environment & Plants');
  const [availableTime, setAvailableTime] = useState<string>('2–3 hours');
  const [maxBudget, setMaxBudget] = useState('10');
  const [constraints, setConstraints] = useState<string[]>(['no_soldering']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConcepts, setGeneratedConcepts] = useState<any[]>([]);
  const [activeRefinement, setActiveRefinement] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?filter=${activeFilter}&sort=recommended`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects && data.projects.length > 0) {
          setSelectedProject(data.projects[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeFilter]);

  const handleGenerateCustom = async (refinement?: string) => {
    setIsGenerating(true);
    if (refinement) setActiveRefinement(refinement);
    try {
      const res = await fetch('/api/generate-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalText,
          skillLevel,
          intendedUse,
          availableTime,
          maxBudgetUsd: parseFloat(maxBudget) || 10,
          constraints,
          refinementType: refinement,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedConcepts(data.concepts || []);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleConstraint = (c: string) => {
    setConstraints((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
            03 / Match by capability, not just by name
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
            Build from what you already have.
          </h1>
          <p className="text-sm text-[#5A6B63] mt-1">
            Useful projects, ranked by your inventory and explained in plain language.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              setGeneratorModalOpen(true);
              if (generatedConcepts.length === 0) handleGenerateCustom();
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0F382A] hover:bg-[#144232] text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4F55C]" />
            <span>Generate custom build</span>
          </button>

          <button
            onClick={fetchProjects}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0EFE6] text-[#11221B] font-medium text-xs border border-[#DDD9CD] transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#5A6B63]" />
            <span>Refresh matches</span>
          </button>
        </div>
      </div>

      {/* Capabilities Banner (Deep Green #0F382A) */}
      <div className="bg-[#0F382A] text-white rounded-3xl p-6 lg:p-7 border border-[#184F3B] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="shrink-0">
            <div className="text-[10px] uppercase font-mono text-[#8EA69B] tracking-wider mb-1">
              Your bench
            </div>
            <div className="text-xl md:text-2xl font-serif text-white">
              24 parts. 11 capabilities.
            </div>
          </div>

          <div className="hidden lg:block text-[#8EA69B] text-xl">
            →
          </div>

          <div className="flex-1">
            <div className="text-[10px] uppercase font-mono text-[#8EA69B] tracking-wider mb-2">
              What they can do
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#D4F55C] text-[#0F382A] text-xs font-semibold rounded-lg">
                Sense moisture
              </span>
              <span className="px-3 py-1 bg-[#D4F55C] text-[#0F382A] text-xs font-semibold rounded-lg">
                Read analog values
              </span>
              <span className="px-3 py-1 bg-[#D4F55C] text-[#0F382A] text-xs font-semibold rounded-lg">
                Control outputs
              </span>
              <span className="px-3 py-1 bg-[#D4F55C] text-[#0F382A] text-xs font-semibold rounded-lg">
                Connect circuits
              </span>
            </div>
          </div>

          <div className="hidden lg:block text-[#8EA69B] text-xl">
            →
          </div>

          <div className="shrink-0">
            <div className="text-[10px] uppercase font-mono text-[#8EA69B] tracking-wider mb-1">
              New possibilities
            </div>
            <div className="text-xl md:text-2xl font-serif text-white">
              12 project matches
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('for_inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeFilter === 'for_inventory'
                ? 'bg-[#0F382A] text-white shadow-xs'
                : 'bg-white text-[#5A6B63] hover:bg-[#F0EFE6] border border-[#E5EDE8]'
            }`}
          >
            For my inventory
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#0F382A] text-white shadow-xs'
                : 'bg-white text-[#5A6B63] hover:bg-[#F0EFE6] border border-[#E5EDE8]'
            }`}
          >
            All projects
          </button>
          <button
            onClick={() => setActiveFilter('beginner')}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#5A6B63] hover:bg-[#F0EFE6] border border-[#E5EDE8] flex items-center space-x-1"
          >
            <span>Beginner friendly</span>
            <ChevronDown className="w-3 h-3 text-[#7E9187]" />
          </button>
          <button
            onClick={() => setActiveFilter('under_10')}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#5A6B63] hover:bg-[#F0EFE6] border border-[#E5EDE8] flex items-center space-x-1"
          >
            <span>Under $10 extra</span>
            <ChevronDown className="w-3 h-3 text-[#7E9187]" />
          </button>
        </div>

        <div className="text-xs font-medium text-[#5A6B63] flex items-center space-x-1.5">
          <span>Sort:</span>
          <span className="text-[#11221B] font-semibold">Recommended</span>
          <ChevronDown className="w-3 h-3 text-[#7E9187]" />
        </div>
      </div>

      {/* Main Split View: Project Cards on Left, Side Explainer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Project Cards List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#7E9187] font-mono px-1">
            <span className="uppercase tracking-wider font-semibold text-[#11221B]">
              Recommended for your bench
            </span>
            <span>Showing {projects.length} of 12 matches</span>
          </div>

          {projects.map((project) => {
            const isCurrentSelected = selectedProject?.id === project.id;
            const match = project.matchResult;

            return (
              <div
                key={project.id}
                onMouseEnter={() => setSelectedProject(project)}
                className={`bg-white rounded-3xl p-5 md:p-6 border transition-all duration-200 shadow-xs cursor-pointer ${
                  isCurrentSelected
                    ? 'border-[#0F382A] ring-1 ring-[#0F382A]'
                    : 'border-[#E5EDE8] hover:border-[#CBDCD1]'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  {/* Project Image */}
                  <div className="sm:col-span-4 rounded-2xl overflow-hidden bg-[#1B4D3E] border border-[#174A38] h-36 flex items-center justify-center">
                    <ResilientImage
                      src={project.imageUrl || PLANT_MONITOR_IMAGE}
                      alt={`${project.title} electronics project on a maker workbench`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      fallbackClassName="w-full h-full"
                    />
                  </div>

                  {/* Project Content */}
                  <div className="sm:col-span-8 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-serif text-[#11221B] leading-snug">
                        {project.title}
                      </h3>
                      <span className="bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold px-2.5 py-1 rounded-md shrink-0 ml-2">
                        {match?.feasibilityScore || 86}% feasible
                      </span>
                    </div>

                    <p className="text-xs text-[#5A6B63] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Capability Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#E5EDE8] text-[#113E2F] font-medium">
                        Analog input ⌵
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#E5EDE8] text-[#113E2F] font-medium">
                        Moisture sensing ⌵
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#E5EDE8] text-[#113E2F] font-medium">
                        Visual output ⌵
                      </span>
                    </div>

                    {/* Bench vs Missing Info */}
                    <div className="text-[11px] text-[#5A6B63] space-y-0.5 font-mono pt-1">
                      <div>
                        From your bench: <strong className="text-[#11221B]">{match?.ownedUnitsTotal || 13} units · {match?.ownedCount || 6} types</strong>
                      </div>
                      <div className="text-[#7E9187]">
                        Missing: USB cable + recycled enclosure
                      </div>
                    </div>

                    {/* Footer Extra Cost & CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F0EFE6] text-xs">
                      <div className="text-[#5A6B63] font-mono">
                        ≈ ${project.estimatedExtraCost?.toFixed(2) || '4.50'} extra
                      </div>
                      <Link
                        href={`/plans/${project.id}`}
                        className="font-medium text-[#0F382A] hover:underline flex items-center space-x-1"
                      >
                        <span>View project & plan</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Side Explainer Card */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5EDE8] shadow-xs space-y-6">
            <div>
              <h3 className="text-2xl font-serif text-[#11221B]">
                Why the {selectedProject?.title?.toLowerCase() || 'plant monitor'}?
              </h3>
              <div className="mt-2">
                <span className="bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold px-2.5 py-1 rounded-md inline-block">
                  {selectedProject?.matchResult?.feasibilityScore || 86}% feasibility · estimate
                </span>
              </div>
            </div>

            <p className="text-xs text-[#5A6B63] leading-relaxed">
              {selectedProject?.matchResult?.summaryExplanation ||
                'You have all the core sensing and control capabilities. Power access and an enclosure still need attention.'}
            </p>

            {/* Subscore Breakdown Bars */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#11221B] font-semibold">Functional capability</span>
                  <span className="text-[#5A6B63]">100%</span>
                </div>
                <div className="w-full h-2.5 bg-[#EBE8DC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F382A] rounded-full w-[100%]" />
                </div>
                <div className="text-[11px] text-[#7E9187]">
                  Your Uno, sensor and LEDs cover the core functions.
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#11221B] font-semibold">Electrical fit</span>
                  <span className="text-[#5A6B63]">100%</span>
                </div>
                <div className="w-full h-2.5 bg-[#EBE8DC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F382A] rounded-full w-[100%]" />
                </div>
                <div className="text-[11px] text-[#7E9187]">
                  5V power and analog signals are compatible.
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#11221B] font-semibold">Power readiness</span>
                  <span className="text-[#5A6B63]">50%</span>
                </div>
                <div className="w-full h-2.5 bg-[#EBE8DC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F382A] rounded-full w-[50%]" />
                </div>
                <div className="text-[11px] text-[#7E9187]">
                  USB-powered board; a cable is missing.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/plans/${selectedProject?.id || 'default'}`}
                className="w-full py-3 px-4 rounded-xl bg-[#0F382A] hover:bg-[#144232] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>Open full build plan</span>
                <ArrowRight className="w-4 h-4 text-[#D4F55C]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 2 AI PROJECT GENERATOR MODAL */}
      {generatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 border border-[#E5EDE8] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-[#1C5B46] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Project Concept Generator</span>
                </div>
                <h3 className="text-2xl font-serif text-[#11221B] mt-1">
                  Design a build tailored to your bench
                </h3>
              </div>
              <button
                onClick={() => setGeneratorModalOpen(false)}
                className="p-1.5 rounded-xl text-[#7E9187] hover:bg-[#F6F5EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Generator Inputs */}
            <div className="space-y-4 bg-[#F8F7F2] p-5 rounded-2xl border border-[#EBE8DC]">
              <div>
                <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                  What would you like to build? (Goal or inspiration)
                </label>
                <input
                  type="text"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  className="w-full bg-white border border-[#DDD9CD] rounded-xl px-3.5 py-2 text-xs text-[#11221B] outline-none focus:border-[#0F382A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#5A6B63] block mb-1">
                    Domain / Field
                  </label>
                  <select
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    className="w-full bg-white border border-[#DDD9CD] rounded-xl px-2.5 py-1.5 text-xs text-[#11221B] outline-none"
                  >
                    <option value="Environment & Plants">Environment & Plants</option>
                    <option value="Lighting & Energy">Lighting & Energy</option>
                    <option value="Robotics & Actuation">Robotics & Actuation</option>
                    <option value="Home Automation">Home Automation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#5A6B63] block mb-1">
                    Skill Level
                  </label>
                  <select
                    value={skillLevel}
                    onChange={(e: any) => setSkillLevel(e.target.value)}
                    className="w-full bg-white border border-[#DDD9CD] rounded-xl px-2.5 py-1.5 text-xs text-[#11221B] outline-none"
                  >
                    <option value="Beginner friendly">Beginner friendly</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#5A6B63] block mb-1">
                    Max Extra Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-[#7E9187]">$</span>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      className="w-full bg-white border border-[#DDD9CD] rounded-xl pl-6 pr-2 py-1.5 text-xs text-[#11221B] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Constraint Tags */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[#5A6B63] block">
                  Constraints & Requirements:
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { id: 'no_soldering', label: 'No soldering (Breadboard only)' },
                    { id: 'classroom_friendly', label: 'Classroom & Student friendly' },
                    { id: 'max_reuse', label: 'Maximize inventory reuse' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleToggleConstraint(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        constraints.includes(c.id)
                          ? 'bg-[#0F382A] text-white border-[#0F382A]'
                          : 'bg-white text-[#5A6B63] border-[#DDD9CD]'
                      }`}
                    >
                      {constraints.includes(c.id) ? '✓ ' : '+ '} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Refinement Controls */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] font-mono text-[#5A6B63] uppercase font-semibold">
                Refine Proposal:
              </span>
              {[
                { id: 'simpler', label: '⚡ Make simpler' },
                { id: 'lower_budget', label: '💵 Lower budget ($0 extra)' },
                { id: 'no_soldering', label: '🔌 100% Solderless' },
                { id: 'use_more_inventory', label: '📦 Use more bin parts' },
              ].map((refine) => (
                <button
                  key={refine.id}
                  onClick={() => handleGenerateCustom(refine.id)}
                  disabled={isGenerating}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                    activeRefinement === refine.id
                      ? 'bg-[#D4F55C] text-[#0F382A] font-bold border-[#B9E234]'
                      : 'bg-[#F6F5EE] text-[#5A6B63] hover:bg-[#EBE8DC] border-[#DDD9CD]'
                  }`}
                >
                  {refine.label}
                </button>
              ))}
            </div>

            {/* Generated Concepts Grid */}
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase text-[#7E9187] tracking-wider font-semibold">
                Generated Concepts ({generatedConcepts.length})
              </div>

              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#0F382A]" />
                  <span className="text-xs font-mono text-[#5A6B63]">Evaluating inventory compatibility...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedConcepts.map((concept) => (
                    <div
                      key={concept.id}
                      className="bg-[#FBFBF8] p-5 rounded-2xl border border-[#E5EDE8] space-y-3 flex flex-col justify-between hover:border-[#0F382A] transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#D4F55C] text-[#0F382A] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                            {concept.feasibilityScore}% feasible
                          </span>
                          <span className="text-[11px] font-mono text-[#7E9187]">
                            ≈ ${concept.estimatedExtraCost.toFixed(2)} extra
                          </span>
                        </div>

                        <h4 className="font-serif text-lg text-[#11221B] leading-snug">
                          {concept.title}
                        </h4>
                        <p className="text-xs text-[#5A6B63] leading-relaxed">
                          {concept.oneSentenceValue}
                        </p>

                        {/* Refinement Diff Note */}
                        {concept.refinementDiffNote && (
                          <div className="p-2 bg-[#EBF7EE] rounded-lg border border-[#D0ECD7] text-[11px] text-[#1B6F3E] font-mono">
                            ↳ {concept.refinementDiffNote}
                          </div>
                        )}

                        <div className="text-[11px] font-mono text-[#5A6B63] space-y-0.5 pt-1">
                          <div>• Reuses: {concept.reusedParts.join(', ')}</div>
                          {concept.missingParts.length > 0 && (
                            <div className="text-[#7E9187]">• Missing: {concept.missingParts.join(', ')}</div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#EBE8DC] flex justify-end">
                        <button
                          onClick={() => {
                            setGeneratorModalOpen(false);
                            router.push('/plans/default');
                          }}
                          className="px-4 py-2 bg-[#0F382A] hover:bg-[#144232] text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
                        >
                          <span>Save as Project Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4F55C]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
