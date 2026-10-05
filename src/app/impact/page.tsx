'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Package, DollarSign, Zap, ChevronDown, ChevronUp, Info, Download } from 'lucide-react';

type Range = '30_days' | '90_days' | 'all_time';

interface CategoryBreakdown {
  category: string;
  massKg: number;
  count: number;
  co2eKg: number;
}

interface Insight {
  type: string;
  message: string;
  action?: string;
}

interface ImpactData {
  summary: {
    totalMassKg: number;
    totalCostAvoided: number;
    totalPartsReused: number;
    totalCo2eKg: number;
    eventCount: number;
    dateRange: string;
    methodology: { version: string; co2eFactor: number; standard: string };
  };
  categoryBreakdowns: CategoryBreakdown[];
  actionableInsights: Insight[];
}

const RANGE_LABELS: Record<Range, string> = {
  '30_days': 'Last 30 days',
  '90_days': 'Last 90 days',
  'all_time': 'All time',
};

function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#E5EDE8] p-6 shadow-xs flex flex-col space-y-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-serif text-[#11221B] font-normal">{value}</div>
        <div className="text-xs font-mono text-[#5A6B63] uppercase tracking-wider mt-0.5">{unit}</div>
      </div>
      <div className="text-xs text-[#7E9187]">{label}</div>
    </div>
  );
}

export default function ImpactPage() {
  const [range, setRange] = useState<Range>('all_time');
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/impact?range=${range}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => setData(payload))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range]);

  const maxMass = data ? Math.max(...data.categoryBreakdowns.map((c) => c.massKg), 0.001) : 1;

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
            Lifecycle Ledger · Phase 3
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
            Community impact
          </h1>
          <p className="text-sm text-[#5A6B63] mt-1">
            Verified e-waste diversion and CO₂e avoidance across your workspace.
          </p>
        </div>

        {/* Range selector */}
        <div className="flex items-center space-x-1 bg-white border border-[#E5EDE8] rounded-xl p-1 shadow-xs">
          {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                range === r
                  ? 'bg-[#0F382A] text-white shadow-sm'
                  : 'text-[#5A6B63] hover:text-[#0F382A] hover:bg-[#F0F7F4]'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-[#E5EDE8] p-6 h-36 animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total mass diverted from landfill"
              value={data.summary.totalMassKg.toFixed(2)}
              unit="kg diverted"
              icon={Package}
              accent="bg-[#E4FA8A] text-[#0F382A]"
            />
            <MetricCard
              label="Estimated cost of new parts avoided"
              value={`$${data.summary.totalCostAvoided.toFixed(0)}`}
              unit="cost avoided"
              icon={DollarSign}
              accent="bg-[#D4F55C] text-[#0F382A]"
            />
            <MetricCard
              label="Individual components reused"
              value={String(data.summary.totalPartsReused)}
              unit="parts reused"
              icon={Zap}
              accent="bg-[#E5EDE8] text-[#0F382A]"
            />
            <MetricCard
              label="CO₂e emissions avoided"
              value={data.summary.totalCo2eKg.toFixed(2)}
              unit="kg CO₂e avoided"
              icon={Leaf}
              accent="bg-[#BBF7D0] text-[#065F46]"
            />
          </div>

          {/* Category breakdown */}
          {data.categoryBreakdowns.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#E5EDE8] p-6 shadow-xs space-y-4">
              <h2 className="text-base font-serif text-[#11221B]">Breakdown by category</h2>
              <div className="space-y-3">
                {data.categoryBreakdowns.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-medium text-[#0F382A] uppercase tracking-wider">
                        {cat.category}
                      </span>
                      <span className="text-[#5A6B63]">
                        {cat.count} parts · {cat.massKg.toFixed(2)} kg · {cat.co2eKg.toFixed(2)} kg CO₂e
                      </span>
                    </div>
                    <div className="h-2 bg-[#F0F7F4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4F55C] rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (cat.massKg / maxMass) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Accessible table */}
              <details className="pt-2">
                <summary className="text-xs font-mono text-[#7E9187] cursor-pointer hover:text-[#0F382A]">
                  View as table (accessible)
                </summary>
                <table className="mt-3 w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5EDE8]">
                      <th className="text-left py-1 text-[#5A6B63] font-mono">Category</th>
                      <th className="text-right py-1 text-[#5A6B63] font-mono">Parts</th>
                      <th className="text-right py-1 text-[#5A6B63] font-mono">Mass (kg)</th>
                      <th className="text-right py-1 text-[#5A6B63] font-mono">CO₂e (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.categoryBreakdowns.map((cat) => (
                      <tr key={cat.category} className="border-b border-[#F0F7F4]">
                        <td className="py-1.5 font-medium">{cat.category}</td>
                        <td className="py-1.5 text-right">{cat.count}</td>
                        <td className="py-1.5 text-right">{cat.massKg.toFixed(3)}</td>
                        <td className="py-1.5 text-right">{cat.co2eKg.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          )}

          {/* Actionable insights */}
          {data.actionableInsights.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#E5EDE8] p-6 shadow-xs space-y-3">
              <h2 className="text-base font-serif text-[#11221B]">Next steps</h2>
              <div className="space-y-2">
                {data.actionableInsights.map((ins, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-3 p-3 bg-[#F8F7F2] rounded-2xl border border-[#EBE8DC]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#E4FA8A] text-[#0F382A] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs text-[#11221B] font-medium">{ins.message}</div>
                      {ins.action && (
                        <div className="text-xs text-[#7E9187] mt-0.5">{ins.action}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Methodology disclosure */}
          <div className="bg-white rounded-3xl border border-[#E5EDE8] shadow-xs overflow-hidden">
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F8F7F2] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#5A6B63]" />
                <span className="text-sm font-medium text-[#0F382A]">How we calculate this</span>
                <span className="text-xs font-mono text-[#7E9187]">
                  {data.summary.methodology.version}
                </span>
              </div>
              {showMethodology ? (
                <ChevronUp className="w-4 h-4 text-[#5A6B63]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#5A6B63]" />
              )}
            </button>
            {showMethodology && (
              <div className="px-6 pb-5 space-y-2 border-t border-[#F0F7F4]">
                <p className="text-xs text-[#5A6B63] leading-relaxed pt-3">
                  CO₂e avoidance is calculated using a factor of{' '}
                  <strong>{data.summary.methodology.co2eFactor} kg CO₂e per kg</strong> of electronic
                  component, based on average manufacturing lifecycle emissions. This aligns with the{' '}
                  <strong>{data.summary.methodology.standard}</strong> standard.
                </p>
                <p className="text-xs text-[#7E9187] leading-relaxed">
                  Cost savings represent the estimated retail replacement value of reused parts at time of
                  diversion. Mass figures are derived from component type reference weights and adjusted
                  by quantity.
                </p>
                <div className="pt-1">
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 bg-[#F0F7F4] text-[#5A6B63] rounded">
                    {data.summary.methodology.version}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <div className="flex justify-end">
            <a
              href={`/api/impact?range=${range}&format=csv`}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-[#E5EDE8] bg-white text-xs font-mono text-[#5A6B63] hover:text-[#0F382A] hover:border-[#0F382A] transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5EDE8] p-10 text-center text-sm text-[#7E9187]">
          No impact data yet. Log components to your inventory to start tracking.
        </div>
      )}
    </div>
  );
}
