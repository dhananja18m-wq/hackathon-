'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Camera,
  Check,
  Edit2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { ArduinoIllustration } from '@/components/common/Illustrations';

interface ScanCandidate {
  rank: number;
  name: string;
  categoryName: string;
  partNumber?: string;
  manufacturer?: string;
  confidence: number;
  evidence: string;
  whyExplanation: string;
  capabilities: string[];
  specifications: Array<{ key: string; value: string }>;
  safetyNotes?: string;
}

const DEMO_FIXTURES = [
  {
    id: 'arduino',
    label: 'Arduino Uno R3 (High Confidence 96%)',
    filename: 'bench_arduino.jpg',
    filesize: '2.4 MB · Uploaded just now',
    summary: 'ATmega328P based development board with 14 digital I/O pins and 6 analog inputs.',
    candidates: [
      {
        rank: 1,
        name: 'Arduino Uno R3',
        categoryName: 'Microcontroller board',
        partNumber: 'ATmega328P',
        manufacturer: 'Arduino LLC',
        confidence: 96,
        evidence: 'Visual PCB outline match, silk-screened ARDUINO UNO branding, DIP-28 socketed ATmega328P chip.',
        whyExplanation: 'Matches Arduino Uno Rev 3 reference layout: 16MHz crystal oscillator, USB-B jack, 5V regulator, and standard 2.54mm headers.',
        capabilities: ['Digital I/O', 'Analog sensing', 'PWM output', 'Serial communication', '5V Power regulation'],
        specifications: [
          { key: 'Logic Voltage', value: '5V' },
          { key: 'Microcontroller', value: 'ATmega328P @ 16MHz' },
          { key: 'Digital I/O Pins', value: '14 (6 PWM outputs)' },
          { key: 'Analog Inputs', value: '6 (10-bit ADC)' },
        ],
        safetyNotes: 'Input voltage on VIN should remain between 7V and 12V DC.',
      },
      {
        rank: 2,
        name: 'Arduino Uno SMD Edition',
        categoryName: 'Microcontroller board',
        partNumber: 'ATmega328P-AU',
        manufacturer: 'Arduino LLC',
        confidence: 78,
        evidence: 'Identical form factor and pin layout, but reference image features DIP-28 socket rather than surface-mount TQFP.',
        whyExplanation: 'Secondary candidate if surface-mount variant was used in custom batch.',
        capabilities: ['Digital I/O', 'Analog sensing', 'PWM output'],
        specifications: [
          { key: 'Logic Voltage', value: '5V' },
          { key: 'Package', value: '32-lead TQFP' },
        ],
      },
      {
        rank: 3,
        name: 'Elegoo Uno Clone',
        categoryName: 'Microcontroller board',
        partNumber: 'CH340G / ATmega328P',
        manufacturer: 'Elegoo',
        confidence: 65,
        evidence: 'Open-source PCB clone sharing identical physical pinout and dimensions.',
        whyExplanation: 'May require CH340 USB drivers on older host machines.',
        capabilities: ['Digital I/O', 'Analog sensing', 'PWM output'],
        specifications: [
          { key: 'USB UART Chip', value: 'CH340G' },
        ],
      },
    ],
  },
  {
    id: 'soil',
    label: 'Soil Moisture Sensor (94%)',
    filename: 'soil_capacitive_v12.jpg',
    filesize: '1.8 MB · Uploaded just now',
    summary: 'Capacitive analog soil moisture sensor probe with onboard NE555 timer circuitry.',
    candidates: [
      {
        rank: 1,
        name: 'Soil moisture sensor',
        categoryName: 'Sensor',
        partNumber: 'Capacitive v1.2',
        manufacturer: 'Generic / Open Source',
        confidence: 94,
        evidence: 'Capacitive fork geometry, no exposed copper pads (corrosion resistant).',
        whyExplanation: 'Operates between 3.3V and 5.5V, outputting 0-3V analog DC voltage proportional to moisture.',
        capabilities: ['Soil moisture sensing', 'Analog moisture sensing', 'Corrosion-resistant probe'],
        specifications: [
          { key: 'Operating Voltage', value: '3.3V - 5.5V DC' },
          { key: 'Output', value: '0 - 3.0V Analog' },
        ],
        safetyNotes: 'Do not submerge the top electronics connector into water or wet soil.',
      },
    ],
  },
  {
    id: 'ambiguous',
    label: 'Unidentified 8-Pin IC (Ambiguous 48%)',
    filename: 'salvaged_dip8_chip.jpg',
    filesize: '1.1 MB · Uploaded just now',
    summary: 'Unidentified 8-pin DIP integrated circuit. Printed part number is partially obscured.',
    candidates: [
      {
        rank: 1,
        name: 'NE555 Precision Timer IC',
        categoryName: 'Passive',
        partNumber: 'NE555P',
        manufacturer: 'Texas Instruments / Generic',
        confidence: 48,
        evidence: '8-pin DIP footprint with notched pin 1, common in salvaged timing circuits.',
        whyExplanation: 'Widely used astable / monostable multivibrator timer chip.',
        capabilities: ['Pulse generation', 'Astable timing oscillation', 'PWM generation'],
        specifications: [
          { key: 'Supply Voltage', value: '4.5V - 16V' },
          { key: 'Package', value: 'DIP-8' },
        ],
        safetyNotes: 'Observe index notch orientation to avoid reverse polarity damage.',
      },
      {
        rank: 2,
        name: 'LM358 Dual Operational Amplifier',
        categoryName: 'Passive',
        partNumber: 'LM358N',
        manufacturer: 'National / TI',
        confidence: 42,
        evidence: 'Identical 8-pin DIP footprint, common in analog signal conditioning.',
        whyExplanation: 'Dual op-amp IC used in sensor amplification.',
        capabilities: ['Analog signal amplification', 'Voltage comparator'],
        specifications: [
          { key: 'Supply Voltage', value: '3V - 32V' },
          { key: 'Package', value: 'DIP-8' },
        ],
      },
    ],
  },
];

export default function IdentifyPage() {
  const router = useRouter();
  const [selectedFixture, setSelectedFixture] = useState(DEMO_FIXTURES[0]);
  const [activeCandidateRank, setActiveCandidateRank] = useState(1);
  const [activeStep, setActiveStep] = useState<2 | 3>(2); // 2: Review suggestion, 3: Confirm & save

  // Form Fields
  const currentCandidate = selectedFixture.candidates.find((c) => c.rank === activeCandidateRank) || selectedFixture.candidates[0];
  const [name, setName] = useState(currentCandidate.name);
  const [categoryName, setCategoryName] = useState(currentCandidate.categoryName);
  const [weight, setWeight] = useState('25');
  const [quantity, setQuantity] = useState('1');
  const [condition, setCondition] = useState('Used · working');
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelectFixture = (fixture: (typeof DEMO_FIXTURES)[0]) => {
    setSelectedFixture(fixture);
    setActiveCandidateRank(1);
    const top = fixture.candidates[0];
    setName(top.name);
    setCategoryName(top.categoryName);
    setWeight(fixture.id === 'arduino' ? '25' : fixture.id === 'soil' ? '9' : '1');
    setIsEditingCustom(false);
  };

  const handleSelectCandidate = (candidate: ScanCandidate) => {
    setActiveCandidateRank(candidate.rank);
    setName(candidate.name);
    setCategoryName(candidate.categoryName);
    setIsEditingCustom(false);
  };

  const handleConfirmAndSave = async () => {
    setIsSubmitting(true);
    try {
      // 1. Trigger scan run on server
      const scanRes = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryPhotoUrl: `/images/${selectedFixture.filename}`,
          filename: selectedFixture.filename,
        }),
      });

      if (!scanRes.ok) throw new Error('Scan initiation failed');
      const { scanId } = await scanRes.json();

      // 2. Confirm candidate and persist to inventory
      const confirmRes = await fetch(`/api/scan/${scanId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateRank: activeCandidateRank,
          userEdits: {
            name,
            categoryName,
            quantity: parseInt(quantity, 10) || 1,
            condition,
            approxWeightG: parseFloat(weight) || 10,
          },
        }),
      });

      if (confirmRes.ok) {
        setSuccessToast(`Saved "${name}" to active inventory with verified provenance!`);
        setTimeout(() => {
          router.push('/inventory');
        }, 1200);
      } else {
        alert('Failed to confirm component.');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert('Error saving component to inventory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Eyebrow & Title */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
          01 / Capture → Identify → Confirm
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
          What’s on your bench?
        </h1>
        <p className="text-sm text-[#5A6B63] mt-1">
          Give a rescued part a name. We’ll help you discover what it can do.
        </p>
      </div>

      {/* Stepper Pill Bar */}
      <div className="bg-[#EBE8DC] border border-[#DDD9CD] rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1.5 text-[#5A6B63]">
            <span className="font-semibold">1</span>
            <span>Upload photo</span>
          </div>
          <span className="text-[#9EAEA5]">→</span>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#D4F55C] text-[#0F382A] font-bold shadow-xs">
            <span>2</span>
            <span>Review AI suggestion</span>
          </div>
          <span className="text-[#9EAEA5]">→</span>
          <div className="flex items-center space-x-1.5 text-[#7E9187]">
            <span className="font-semibold">3</span>
            <span>Confirm & add to inventory</span>
          </div>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-wider text-[#5A6B63] self-end sm:self-center">
          Phase 2 Multi-Candidate Scanner
        </div>
      </div>

      {/* Quick Switch Demo Fixtures */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono text-[#5A6B63] uppercase shrink-0 font-semibold">
          Demo Scan Fixtures:
        </span>
        {DEMO_FIXTURES.map((f) => (
          <button
            key={f.id}
            onClick={() => handleSelectFixture(f)}
            className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
              selectedFixture.id === f.id
                ? 'bg-[#0F382A] text-white font-medium shadow-xs'
                : 'bg-white text-[#5A6B63] hover:bg-[#ECE9DD] border border-[#E5EDE8]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Photo Card & Capture Guidelines */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E5EDE8] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-semibold text-base text-[#11221B]">
                Your component photo
              </h3>
              <span className="text-[10px] font-mono text-[#7E9187]">
                Multi-angle supported
              </span>
            </div>

            {/* Photo Preview Frame with Bounding Box Overlay */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1B4D3E] border border-[#174A38] p-4 flex flex-col items-center justify-center min-h-[260px]">
              <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded-md backdrop-blur-xs">
                Photo 1 / 1
              </div>

              {/* Bounding Box Outline */}
              <div className="relative p-2 border-2 border-[#D4F55C] rounded-xl shadow-lg">
                <ArduinoIllustration className="w-64 h-auto" />
                <div className="absolute -top-3 -right-2 bg-[#D4F55C] text-[#0F382A] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm">
                  {currentCandidate.confidence}% Match
                </div>
              </div>
            </div>

            {/* Photo Metadata Footer */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <div className="font-mono font-medium text-[#11221B]">
                  {selectedFixture.filename}
                </div>
                <div className="text-[#7E9187] text-[11px]">
                  {selectedFixture.filesize}
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#EBF7EE] text-[#1B6F3E] font-mono text-[11px] font-semibold border border-[#D0ECD7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1B6F3E]" />
                <span>Scan complete</span>
              </span>
            </div>

            {/* Photo Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => alert('Select component image from local drive.')}
                className="w-full py-2.5 px-3 rounded-xl border border-[#D5D2C5] bg-white hover:bg-[#F6F5EE] text-[#11221B] text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-[#5A6B63]" />
                <span>Upload image</span>
              </button>
              <button
                onClick={() => alert('Accessing camera stream for live bench snapshot.')}
                className="w-full py-2.5 px-3 rounded-xl border border-[#D5D2C5] bg-white hover:bg-[#F6F5EE] text-[#11221B] text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-[#5A6B63]" />
                <span>Camera capture</span>
              </button>
            </div>
          </div>

          {/* Pre-upload Guidance Box */}
          <div className="bg-[#ECE9DC] border border-[#DDD9CD] rounded-2xl p-4 text-xs text-[#5A6B63] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#11221B] font-semibold">
              <Lightbulb className="w-4 h-4 text-[#0F382A]" />
              <span>Intake & Scanning Guidelines</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              • Photograph one part at a time on a plain, well-lit surface.<br />
              • Capture visible printed part numbers (IC markings, resistor bands).<br />
              • Ambiguous results will present multiple ranked candidates for manual verification.
            </p>
          </div>
        </div>

        {/* Right Column: AI Identification & Candidate Selection */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5EDE8] shadow-xs space-y-6">
            {/* Header & Confidence Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#1C5B46]" />
                <span>AI Identification (Rank {activeCandidateRank} of {selectedFixture.candidates.length})</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                currentCandidate.confidence >= 80 ? 'bg-[#D4F55C] text-[#0F382A]' : 'bg-[#FEF3C7] text-[#92400E]'
              }`}>
                {currentCandidate.confidence}% confidence
              </span>
            </div>

            {/* Candidate Selector Tabs if multi-candidate */}
            {selectedFixture.candidates.length > 1 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase text-[#7E9187]">
                  Ranked Candidates:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFixture.candidates.map((cand) => (
                    <button
                      key={cand.rank}
                      onClick={() => handleSelectCandidate(cand)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                        activeCandidateRank === cand.rank
                          ? 'bg-[#0F382A] text-white shadow-xs'
                          : 'bg-[#F6F5EE] text-[#5A6B63] hover:bg-[#EBE8DC] border border-[#DDD9CD]'
                      }`}
                    >
                      #{cand.rank} {cand.name} ({cand.confidence}%)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Component Title & AI Description */}
            <div className="space-y-1.5">
              {isEditingCustom ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-2xl font-serif text-[#11221B] border-b border-[#0F382A] pb-1 outline-none"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-serif text-[#11221B] tracking-tight">
                  {name}
                </h2>
              )}
              <p className="text-xs text-[#5A6B63] leading-relaxed">
                {currentCandidate.whyExplanation}
              </p>
            </div>

            {/* "Why we think this" Evidence Box */}
            <div className="p-3.5 bg-[#FAF9F4] rounded-2xl border border-[#E5EDE8] text-xs space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#1C5B46] font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Visual & Catalog Evidence</span>
              </div>
              <p className="text-[#5A6B63] text-[11px] leading-relaxed">
                {currentCandidate.evidence}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#5A6B63] font-medium block">
                    Category
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3.5 py-2.5 text-xs text-[#11221B] font-medium outline-none focus:border-[#0F382A]"
                  >
                    <option value="Microcontroller board">Microcontroller board</option>
                    <option value="Sensor">Sensor</option>
                    <option value="Output">Output</option>
                    <option value="Actuator">Actuator</option>
                    <option value="Interface">Interface</option>
                    <option value="Power">Power</option>
                    <option value="Passive">Passive</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#5A6B63] font-medium block">
                    Approx. weight · estimate
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3.5 py-2.5 text-xs text-[#11221B] font-medium outline-none focus:border-[#0F382A]"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-[#7E9187] font-mono">
                      g
                    </span>
                  </div>
                </div>
              </div>

              {/* Possible Capabilities */}
              <div className="space-y-2 pt-1">
                <label className="text-xs text-[#5A6B63] font-medium block">
                  Inferred capabilities
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentCandidate.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-2.5 py-1 rounded-lg bg-[#E5EDE8] text-[#113E2F] text-xs font-medium border border-[#D3E0D8]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safety Guidance if present */}
              {currentCandidate.safetyNotes && (
                <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-xs text-[#92400E] flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Safety Guidance</strong>
                    <span className="text-[11px] leading-tight">{currentCandidate.safetyNotes}</span>
                  </div>
                </div>
              )}

              {/* Quantity & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#5A6B63] font-medium block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3.5 py-2.5 text-xs text-[#11221B] font-medium outline-none focus:border-[#0F382A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#5A6B63] font-medium block">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-[#F6F5EE] border border-[#E5EDE8] rounded-xl px-3.5 py-2.5 text-xs text-[#11221B] font-medium outline-none focus:border-[#0F382A]"
                  >
                    <option value="Used · working">Used · working</option>
                    <option value="New / Open Box">New / Open Box</option>
                    <option value="Untested">Untested</option>
                    <option value="Salvaged / Repaired">Salvaged / Repaired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Success Toast */}
            {successToast && (
              <div className="p-3 bg-[#EBF7EE] border border-[#D0ECD7] rounded-xl text-xs text-[#1B6F3E] flex items-center space-x-2 animate-in fade-in">
                <Check className="w-4 h-4 text-[#1B6F3E]" />
                <span className="font-medium">{successToast}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleConfirmAndSave}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#0F382A] hover:bg-[#144232] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4F55C]" />
                  ) : (
                    <Check className="w-4 h-4 text-[#D4F55C]" />
                  )}
                  <span>Confirm & add to inventory</span>
                </button>

                <button
                  onClick={() => setIsEditingCustom(!isEditingCustom)}
                  className="w-full py-3 px-4 rounded-xl border border-[#D5D2C5] bg-white hover:bg-[#F6F5EE] text-[#11221B] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#5A6B63]" />
                  <span>{isEditingCustom ? 'Done editing' : 'Correct identification'}</span>
                </button>
              </div>

              <div className="text-[11px] text-[#7E9187] text-center">
                You’re in control. AI suggestions are never saved without your explicit confirmation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
