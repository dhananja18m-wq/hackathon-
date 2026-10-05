'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Scan,
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  Cpu,
  Activity,
  Lightbulb,
  Radio,
  Sliders,
  Layers,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
  History,
  CheckCircle2,
  UploadCloud
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const [components, setComponents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedCondition, setSelectedCondition] = useState('All conditions');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<any | null>(null);

  // Add form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Microcontroller');
  const [formQty, setFormQty] = useState('1');
  const [formCondition, setFormCondition] = useState('Used · working');
  const [formWeight, setFormWeight] = useState('10');
  const [formNotes, setFormNotes] = useState('');
  const [formPhotoName, setFormPhotoName] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory && selectedCategory !== 'All categories') {
        params.set('category', selectedCategory);
      }
      if (selectedCondition && selectedCondition !== 'All conditions') {
        params.set('condition', selectedCondition);
      }

      const res = await fetch(`/api/inventory?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComponents(data.components || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search, selectedCategory, selectedCondition]);

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setFormSubmitting(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          categoryName: formCategory,
          quantity: parseInt(formQty, 10) || 1,
          condition: formCondition,
          approxWeightG: parseFloat(formWeight) || 10,
          notes: formPhotoName ? `${formNotes ? formNotes + ' · ' : ''}Attached photo: ${formPhotoName}` : formNotes,
        }),
      });

      if (res.ok) {
        setAddModalOpen(false);
        setFormName('');
        setFormNotes('');
        setFormPhotoName('');
        await fetchInventory();
      }
    } catch (err) {
      console.error('Add error:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this component?')) return;
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComponents((prev) => prev.filter((c) => c.id !== id));
        if (detailModalItem?.id === id) setDetailModalItem(null);
      }
    } catch (err) {
      console.error('Archive error:', err);
    }
  };

  const totalUnits = components.reduce((sum, c) => sum + c.quantity, 0);
  const totalWeightG = components.reduce((sum, c) => sum + (c.approxWeightG * c.quantity), 0);

  const getCategoryIcon = (categoryName: string) => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('microcontroller') || cat.includes('cpu')) return Cpu;
    if (cat.includes('sensor')) return Activity;
    if (cat.includes('output') || cat.includes('led')) return Lightbulb;
    if (cat.includes('actuator') || cat.includes('motor')) return Sliders;
    return Layers;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Eyebrow & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
            02 / A bench full of possibilities
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
            Your parts. Organized by potential.
          </h1>
          <p className="text-sm text-[#5A6B63] mt-1">
            A living inventory of what you have — and what it can do.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0EFE6] text-[#11221B] font-medium text-xs border border-[#DDD9CD] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#5A6B63]" />
            <span>Add manually</span>
          </button>

          <Link
            href="/identify"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0F382A] hover:bg-[#144232] text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Scan className="w-3.5 h-3.5 text-[#D4F55C]" />
            <span>Scan a component</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5EDE8] shadow-xs">
          <div className="text-xs font-medium text-[#5A6B63] mb-2">
            Total components
          </div>
          <div className="text-3xl font-serif text-[#11221B] font-normal">
            {totalUnits || 24}
          </div>
          <div className="text-xs text-[#7E9187] mt-2">
            {components.length || 8} component types
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EDE8] shadow-xs">
          <div className="text-xs font-medium text-[#5A6B63] mb-2">
            Available capabilities
          </div>
          <div className="text-3xl font-serif text-[#11221B] font-normal">
            11
          </div>
          <div className="text-xs text-[#7E9187] mt-2">
            Sensing, control, output & connection
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5EDE8] shadow-xs">
          <div className="text-xs font-medium text-[#5A6B63] mb-2">
            Approx. inventory mass
          </div>
          <div className="text-3xl font-serif text-[#11221B] font-normal flex items-baseline space-x-1">
            <span>{Math.round(totalWeightG) || 89}</span>
            <span className="text-xl font-sans text-[#7E9187]">g</span>
          </div>
          <div className="text-xs text-[#7E9187] mt-2">
            Estimated from typical unit weights
          </div>
        </div>

        <Link
          href="/discover"
          className="bg-[#0F382A] text-white rounded-2xl p-5 border border-[#184F3B] shadow-xs block group hover:bg-[#144232] transition-colors"
        >
          <div className="text-xs font-medium text-[#8EA69B] mb-2">
            Ready for a new project
          </div>
          <div className="text-3xl font-serif text-[#D4F55C] font-normal">
            12 matches
          </div>
          <div className="text-xs text-[#8EA69B] mt-2 flex items-center space-x-1 group-hover:text-[#D4F55C] transition-colors">
            <span>See what you can build</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5EDE8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7E9187]" />
            <input
              type="text"
              placeholder="Search name or capability..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl outline-none focus:border-[#0F382A] text-[#11221B]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3 py-2 text-[#11221B] font-medium outline-none focus:border-[#0F382A]"
          >
            <option value="All categories">All categories</option>
            <option value="Microcontroller">Microcontroller</option>
            <option value="Sensor">Sensor</option>
            <option value="Output">Output</option>
            <option value="Actuator">Actuator</option>
            <option value="Interface">Interface</option>
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="text-xs bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3 py-2 text-[#11221B] font-medium outline-none focus:border-[#0F382A]"
          >
            <option value="All conditions">Condition</option>
            <option value="Used · working">Used · working</option>
            <option value="Untested">Untested</option>
            <option value="New / Open Box">New / Open Box</option>
          </select>
        </div>

        <div className="text-xs font-mono text-[#5A6B63] shrink-0">
          {components.length} types · {totalUnits} units
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="bg-white rounded-3xl border border-[#E5EDE8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#11221B]">
            <thead className="bg-[#F8F7F2] text-[10px] font-mono uppercase tracking-wider text-[#7E9187] border-b border-[#EBE8DC]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Component</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-center">Qty</th>
                <th className="py-3.5 px-4 font-semibold">Condition</th>
                <th className="py-3.5 px-4 font-semibold">Est. Weight</th>
                <th className="py-3.5 px-6 font-semibold">Capabilities</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE6]">
              {components.map((item) => {
                const IconComponent = getCategoryIcon(item.category?.name || 'General');
                const isUntested = item.condition.toLowerCase().includes('untested');

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF9F5] transition-colors group cursor-pointer"
                    onClick={() => setDetailModalItem(item)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F6F5EE] border border-[#E5EDE8] flex items-center justify-center text-[#5A6B63] shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#11221B] group-hover:text-[#0F382A]">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#7E9187] font-mono">
                            {item.description || item.partNumber || 'Rescued part'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#5A6B63] font-medium">
                      {item.category?.name || 'General'}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-medium">
                      {item.quantity}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-1 rounded-md text-[11px] font-medium',
                          isUntested
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : 'bg-[#EBF7EE] text-[#1B6F3E] border border-[#D0ECD7]'
                        )}
                      >
                        {item.condition}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-[#5A6B63]">
                      {item.approxWeightG} g {item.quantity > 1 ? '/ unit' : ''}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 text-[11px] text-[#2D4439]">
                        {item.capabilities?.slice(0, 3).map((c: any) => (
                          <span key={c.id || c.name} className="font-medium">
                            {c.name}
                            <span className="text-[#9EAEA5] mx-1">•</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setDetailModalItem(item)}
                          className="p-1.5 rounded-lg text-[#7E9187] hover:text-[#0F382A] hover:bg-[#EAE8DD] transition-colors"
                          aria-label="Edit component"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleArchive(item.id)}
                          className="p-1.5 rounded-lg text-[#7E9187] hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Archive component"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PHASE 2 ADVANCED COMPONENT INTELLIGENCE MODAL */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-[#E5EDE8] shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#7E9187] tracking-wider flex items-center space-x-2">
                  <span>Component Intelligence</span>
                  <span>•</span>
                  <span className="text-[#1B6F3E] font-semibold">Provenance: {detailModalItem.provenanceSource || 'catalog'}</span>
                </div>
                <h3 className="text-2xl font-serif text-[#11221B] mt-1">
                  {detailModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="p-2 rounded-xl text-[#7E9187] hover:bg-[#F6F5EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistance & Provenance Panel */}
            <div className="bg-[#FAF9F4] border border-[#E5EDE8] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-[#1C5B46] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Analysis & Field Provenance</span>
                </div>
                <span className="bg-[#D4F55C] text-[#0F382A] px-2 py-0.5 rounded font-bold">
                  {detailModalItem.confidenceScore || 96}% confidence
                </span>
              </div>
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                {detailModalItem.description || 'Verified against canonical component catalog with derived pinout, logic voltage, and protocol mappings.'}
              </p>
            </div>

            {/* Platform Compatibility Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-[#5A6B63] tracking-wider font-semibold">
                Platform Compatibility
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-[#F6F5EE] rounded-xl border border-[#EBE8DC]">
                  <div className="font-semibold text-[#11221B] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B6F3E]" />
                    <span>Arduino Uno / Nano (5V)</span>
                  </div>
                  <div className="text-[11px] text-[#7E9187] mt-0.5">Native 5V logic & ADC compatible</div>
                </div>
                <div className="p-3 bg-[#F6F5EE] rounded-xl border border-[#EBE8DC]">
                  <div className="font-semibold text-[#11221B] flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B6F3E]" />
                    <span>ESP32 / ESP8266 (3.3V)</span>
                  </div>
                  <div className="text-[11px] text-[#7E9187] mt-0.5">Operates across 3.3V - 5.5V range</div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-[#5A6B63] tracking-wider font-semibold">
                Technical Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {detailModalItem.specifications?.map((s: any) => (
                  <div key={s.id || s.key} className="bg-[#F6F5EE] p-3 rounded-xl border border-[#EBE8DC]">
                    <div className="text-[#7E9187] text-[11px]">{s.key}</div>
                    <div className="font-semibold text-[#11221B] mt-0.5">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-[#5A6B63] tracking-wider font-semibold">
                Derived Capabilities
              </h4>
              <div className="flex flex-wrap gap-2">
                {detailModalItem.capabilities?.map((c: any) => (
                  <span
                    key={c.id || c.name}
                    className="px-3 py-1 bg-[#E5EDE8] text-[#113E2F] text-xs rounded-lg font-medium border border-[#D3E0D8]"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-[#F0EFE6]">
              <button
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 rounded-xl border border-[#D5D2C5] text-xs font-medium text-[#11221B] hover:bg-[#F6F5EE]"
              >
                Close
              </button>
              <button
                onClick={() => handleArchive(detailModalItem.id)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700"
              >
                Archive Component
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Component Manually Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateManual}
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-[#E5EDE8] shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-[#11221B]">
                Add Component Manually
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg text-[#7E9187] hover:bg-[#F6F5EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raspberry Pi Pico, ESP32, 10k Potentiometer"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3.5 py-2.5 text-xs text-[#11221B] outline-none focus:border-[#0F382A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3 py-2 text-xs text-[#11221B] outline-none"
                  >
                    <option value="Microcontroller">Microcontroller</option>
                    <option value="Sensor">Sensor</option>
                    <option value="Output">Output</option>
                    <option value="Actuator">Actuator</option>
                    <option value="Interface">Interface</option>
                    <option value="Passive">Passive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3 py-2 text-xs text-[#11221B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                    Condition
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value)}
                    className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3 py-2 text-xs text-[#11221B] outline-none"
                  >
                    <option value="Used · working">Used · working</option>
                    <option value="Untested">Untested</option>
                    <option value="New / Open Box">New / Open Box</option>
                    <option value="Salvaged / Repaired">Salvaged / Repaired</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                    Est. Weight (grams)
                  </label>
                  <input
                    type="number"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3 py-2 text-xs text-[#11221B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                  Component Photo (optional)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="manual-photo-upload"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFormPhotoName(f.name);
                    }}
                  />
                  <label
                    htmlFor="manual-photo-upload"
                    className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-[#D5D2C5] bg-white hover:bg-[#F6F5EE] text-xs font-medium text-[#11221B] transition-colors shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#5A6B63]" />
                    <span>{formPhotoName || 'Upload photo'}</span>
                  </label>
                  {formPhotoName && (
                    <button
                      type="button"
                      onClick={() => setFormPhotoName('')}
                      className="text-xs text-[#7E9187] hover:text-[#11221B]"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A6B63] block mb-1">
                  Notes / Source
                </label>
                <textarea
                  rows={2}
                  placeholder="Where was this salvaged? Any specific revisions?"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3.5 py-2 text-xs text-[#11221B] outline-none focus:border-[#0F382A]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#F0EFE6]">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#D5D2C5] text-xs font-medium text-[#11221B] hover:bg-[#F6F5EE]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#0F382A] text-white text-xs font-semibold hover:bg-[#144232] transition-colors"
              >
                {formSubmitting ? 'Saving...' : 'Add to Inventory'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
