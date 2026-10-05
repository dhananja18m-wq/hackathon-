'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Bookmark,
  ArrowRight,
  Check,
  Cpu,
  Activity,
  Lightbulb,
  Layers,
  Copy,
  Terminal,
  FileCode,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckSquare,
  Square
} from 'lucide-react';
import { ResilientImage } from '@/components/common/ResilientImage';
import { PLANT_MONITOR_IMAGE } from '@/lib/media';

export default function ProjectPlanDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'circuit' | 'notes' | 'steps'>('overview');
  const [isSaved, setIsSaved] = useState(true);
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Build steps with interactive state
  const [steps, setSteps] = useState([
    {
      stepNumber: 1,
      title: 'Inspect and Clean Rescued Probe',
      description: 'Clean the capacitive probe traces with isopropyl alcohol. Check for any hairline fractures or damaged cable solder joints.',
      durationMinutes: 10,
      safetyWarning: 'Ensure board is powered off when cleaning contacts.',
      milestoneCheck: 'Capacitive copper pads clean and free of mineral crust.',
      isCompleted: true,
    },
    {
      stepNumber: 2,
      title: 'Mount Circuit on Breadboard',
      description: 'Place LEDs with 220Ω series resistors on breadboard. Connect Green LED anode to Arduino Pin 9 and Red LED anode to Arduino Pin 8.',
      durationMinutes: 20,
      safetyWarning: 'Check LED polarity: long leg is anode (+).',
      milestoneCheck: 'LED circuit grounded to Arduino common GND.',
      isCompleted: false,
    },
    {
      stepNumber: 3,
      title: 'Wire Sensor to Analog Pin A0',
      description: 'Connect Moisture Sensor VCC -> 5V, GND -> GND, and AOUT -> A0 via 3 jumper wires.',
      durationMinutes: 15,
      safetyWarning: 'Verify 5V and GND orientation before connecting USB.',
      milestoneCheck: 'All 3 sensor leads firmly seated in DuPont headers.',
      isCompleted: false,
    },
    {
      stepNumber: 4,
      title: 'Upload & Test Firmware',
      description: 'Open Arduino IDE, compile the provided firmware, and upload over USB cable.',
      durationMinutes: 20,
      safetyWarning: 'Keep electronics away from open water glasses while connected.',
      milestoneCheck: 'Serial monitor outputs moisture numbers every 2 seconds.',
      isCompleted: false,
    },
    {
      stepNumber: 5,
      title: 'Calibrate Dry/Wet Thresholds',
      description: 'Record raw values in open air (~750) and submerged in moist potting mix (~380). Set threshold halfway.',
      durationMinutes: 15,
      safetyWarning: 'Do not submerge the upper electronics connector into wet mud.',
      milestoneCheck: 'Green LED illuminates when soil is damp, Red when dry.',
      isCompleted: false,
    },
  ]);

  // Project BOM items
  const [ownedItems, setOwnedItems] = useState([
    { name: 'Arduino Uno R3', qty: 1, role: 'Analog input + digital control', isSatisfied: true },
    { name: 'Capacitive moisture sensor', qty: 1, role: 'Soil moisture sensing', isSatisfied: true },
    { name: 'LEDs · green + red', qty: 2, role: 'Visual status output', isSatisfied: true },
    { name: 'Jumper wires', qty: 6, role: 'Signal / power connection', isSatisfied: true },
    { name: 'Mini breadboard', qty: 1, role: 'Solderless prototyping', isSatisfied: true },
  ]);

  const [missingItems, setMissingItems] = useState([
    { name: 'USB-B Power Cable', qty: 1, role: '5V USB power delivery', estCost: '$2.50', isOptional: true },
    { name: 'Recycled Enclosure', qty: 1, role: 'Moisture-resistant housing', estCost: '$2.00 (or repurposed plastic container)', isOptional: true },
  ]);

  const toggleStep = (stepNumber: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.stepNumber === stepNumber ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const completedStepsCount = steps.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedStepsCount / steps.length) * 100);

  const code = `// SECONDLIFE AI — Smart Plant Monitor Firmware
// Clean modular firmware for rescued Arduino + Capacitive Sensor

const int SENSOR_PIN = A0;
const int RED_LED_PIN = 8;
const int GREEN_LED_PIN = 9;

// Moisture threshold: > 580 indicates dry soil
const int DRY_THRESHOLD = 580;

void setup() {
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("reboard Plant Monitor: Sensor Online.");
}

void loop() {
  int moistureRaw = analogRead(SENSOR_PIN);
  Serial.print("Moisture Level: ");
  Serial.println(moistureRaw);

  if (moistureRaw > DRY_THRESHOLD) {
    digitalWrite(RED_LED_PIN, HIGH);
    digitalWrite(GREEN_LED_PIN, LOW);
  } else {
    digitalWrite(RED_LED_PIN, LOW);
    digitalWrite(GREEN_LED_PIN, HIGH);
  }

  delay(2000);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#5A6B63] font-medium mb-1">
            04 / Project 014 · Inventory-adapted workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#11221B] font-normal tracking-tight">
            Smart plant monitor
          </h1>
          <p className="text-sm text-[#5A6B63] mt-1">
            A small build that gives your rescued electronics a useful second life.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0EFE6] text-[#11221B] font-medium text-xs border border-[#DDD9CD] transition-colors shadow-xs"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#0F382A] text-[#0F382A]' : 'text-[#5A6B63]'}`} />
            <span>{isSaved ? 'Plan saved' : 'Save plan'}</span>
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0F382A] hover:bg-[#144232] text-white font-medium text-xs transition-colors shadow-xs"
          >
            <span>{progressPercent === 100 ? 'Build Completed (100%)' : `Continue Build (${progressPercent}%)`}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4F55C]" />
          </button>
        </div>
      </div>

      {/* Hero Dark Green Banner (Screen 5 Source of Truth) */}
      <div className="bg-[#0F382A] text-white rounded-3xl overflow-hidden border border-[#184F3B] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Hero Text */}
          <div className="p-7 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                  86% feasible
                </span>
                <span className="text-xs font-medium text-[#D1DDD7] bg-[#144232] px-3 py-1 rounded-md border border-[#1D5642]">
                  Beginner · 2–3 hours
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-[1.15] text-white">
                Your plant asks for water. Your old parts answer.
              </h2>

              <p className="text-sm text-[#B4CDC1] leading-relaxed max-w-xl">
                Read soil moisture with your capacitive sensor. An Arduino turns that reading into a green &quot;happy&quot; or red &quot;water me&quot; light — no app required.
              </p>
            </div>

            {/* Flow Stages & Parts Reused */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold rounded-md">
                  SENSE
                </span>
                <span className="text-[#8EA69B] text-xs">→</span>
                <span className="px-2.5 py-1 bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold rounded-md">
                  INTERPRET
                </span>
                <span className="text-[#8EA69B] text-xs">→</span>
                <span className="px-2.5 py-1 bg-[#D4F55C] text-[#0F382A] text-xs font-mono font-bold rounded-md">
                  SIGNAL
                </span>
              </div>

              <div className="text-xs font-mono text-[#8EA69B]">
                13 parts reused
              </div>
            </div>
          </div>

          {/* Right Hero Image / Setup */}
          <div className="lg:col-span-5 h-full p-4 lg:p-6 flex items-center justify-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-[#1C5B46] bg-[#0A261C]">
              <ResilientImage
                src={PLANT_MONITOR_IMAGE}
                alt="Arduino circuit board ready for a salvaged smart plant monitor build"
                priority
                className="w-full h-64 lg:h-72 object-cover object-center"
                fallbackClassName="w-full h-64 lg:h-72"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-[#DDD9CD] pt-2">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-medium transition-colors relative ${
              activeTab === 'overview'
                ? 'text-[#11221B] font-semibold'
                : 'text-[#5A6B63] hover:text-[#11221B]'
            }`}
          >
            <span>Overview & plan</span>
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F382A]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`pb-3 text-xs font-medium transition-colors relative ${
              activeTab === 'steps'
                ? 'text-[#11221B] font-semibold'
                : 'text-[#5A6B63] hover:text-[#11221B]'
            }`}
          >
            <span>Step-by-step build ({completedStepsCount}/{steps.length})</span>
            {activeTab === 'steps' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F382A]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('circuit')}
            className={`pb-3 text-xs font-medium transition-colors relative ${
              activeTab === 'circuit'
                ? 'text-[#11221B] font-semibold'
                : 'text-[#5A6B63] hover:text-[#11221B]'
            }`}
          >
            <span>Circuit & code</span>
            {activeTab === 'circuit' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F382A]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-xs font-medium transition-colors relative ${
              activeTab === 'notes'
                ? 'text-[#11221B] font-semibold'
                : 'text-[#5A6B63] hover:text-[#11221B]'
            }`}
          >
            <span>Build notes</span>
            {activeTab === 'notes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F382A]" />
            )}
          </button>
        </div>

        <div className="text-[10px] uppercase font-mono text-[#7E9187] tracking-wider pb-3">
          AI Draft · Review before building
        </div>
      </div>

      {/* TAB 1: OVERVIEW & PLAN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Bill of Materials */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[#E5EDE8] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-serif text-[#11221B]">
                Your bill of materials
              </h3>
              <div className="flex items-center space-x-2 mt-3">
                <span className="px-2.5 py-1 bg-[#EBF7EE] text-[#1B6F3E] text-xs font-medium rounded-md border border-[#D0ECD7]">
                  Owned · 6 types / 13 units
                </span>
                <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] text-xs font-medium rounded-md border border-[#FDE68A]">
                  Missing · 2 types
                </span>
              </div>
            </div>

            {/* Owned Items List */}
            <div className="divide-y divide-[#F2EFE6] text-xs">
              {ownedItems.map((item) => (
                <div key={item.name} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-[#1B6F3E] shrink-0" />
                    <span className="font-semibold text-[#11221B]">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-[#5A6B63]">
                    <span className="font-mono text-center w-6">{item.qty}</span>
                    <span className="w-44 text-right truncate text-[11px]">{item.role}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Missing Items Box */}
            <div className="bg-[#FAF9F5] border border-[#EBE8DC] rounded-2xl p-4 space-y-2">
              <div className="text-xs font-mono uppercase text-[#7E9187] tracking-wider font-semibold">
                Missing / Suggested Substitutions
              </div>
              <div className="space-y-2 text-xs">
                {missingItems.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-[#5A6B63]">
                    <span className="font-medium text-[#11221B]">• {m.name} ({m.qty})</span>
                    <span className="text-[11px] font-mono text-[#7E9187]">{m.estCost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Feasibility Explained */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-[#E5EDE8] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-serif text-[#11221B]">
                Feasibility, explained
              </h3>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-4xl font-serif text-[#11221B]">86%</span>
                <span className="text-xs text-[#7E9187]">Estimated readiness / Not a success guarantee</span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#11221B] font-semibold">Functional capability</span>
                  <span className="text-[#5A6B63]">100%</span>
                </div>
                <div className="w-full h-2.5 bg-[#EBE8DC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F382A] rounded-full w-[100%]" />
                </div>
                <div className="text-[11px] text-[#7E9187]">
                  All core sensing and output functions covered.
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
                  5V logic and analog signal compatibility.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0EFE6] text-xs text-[#5A6B63] leading-relaxed">
              <strong className="text-[#11221B]">Workbench Impact:</strong> Saving ~13 salvaged components from landfill, avoiding ~$31 in new sensor kit expenses.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP BUILD GUIDE (Phase 2 feature) */}
      {activeTab === 'steps' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5EDE8] shadow-xs space-y-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-serif text-[#11221B]">
                Interactive Build Guide
              </h3>
              <p className="text-xs text-[#5A6B63] mt-1">
                Mark each milestone step as complete to track your hardware progress.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-semibold text-[#0F382A]">
                {completedStepsCount} of {steps.length} Steps Done ({progressPercent}%)
              </div>
              <div className="w-44 h-2 bg-[#EBE8DC] rounded-full overflow-hidden mt-1.5 ml-auto">
                <div
                  className="h-full bg-[#0F382A] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {steps.map((step) => (
              <div
                key={step.stepNumber}
                onClick={() => toggleStep(step.stepNumber)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  step.isCompleted
                    ? 'bg-[#FBFBF8] border-[#D0ECD7] opacity-90'
                    : 'bg-white border-[#E5EDE8] hover:border-[#0F382A] shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStep(step.stepNumber);
                    }}
                    className="mt-0.5 text-[#0F382A]"
                  >
                    {step.isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-[#1B6F3E]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#7E9187]" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-base font-serif ${step.isCompleted ? 'text-[#5A6B63] line-through' : 'text-[#11221B]'}`}>
                        Step {step.stepNumber}: {step.title}
                      </h4>
                      <span className="text-[11px] font-mono text-[#7E9187]">
                        ⏱ ~{step.durationMinutes} min
                      </span>
                    </div>

                    <p className="text-xs text-[#5A6B63] leading-relaxed">
                      {step.description}
                    </p>

                    {/* Safety Warning */}
                    {step.safetyWarning && (
                      <div className="p-2.5 bg-[#FEF3C7] rounded-xl border border-[#FDE68A] text-[11px] text-[#92400E] flex items-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Safety Caution:</strong> {step.safetyWarning}</span>
                      </div>
                    )}

                    {/* Milestone Check */}
                    {step.milestoneCheck && (
                      <div className="text-[11px] font-mono text-[#1B6F3E] flex items-center space-x-1.5 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B6F3E]" />
                        <span><strong>Milestone:</strong> {step.milestoneCheck}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CIRCUIT & CODE */}
      {activeTab === 'circuit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Wiring Pinout Table */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E5EDE8] shadow-xs space-y-4">
            <h3 className="font-serif text-lg text-[#11221B]">
              Circuit Wiring Matrix
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F8F7F2] font-mono text-[10px] text-[#7E9187]">
                  <tr>
                    <th className="p-2.5">Component Pin</th>
                    <th className="p-2.5">Arduino Pin</th>
                    <th className="p-2.5">Signal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE6]">
                  <tr>
                    <td className="p-2.5 font-medium">Moisture Sensor VCC</td>
                    <td className="p-2.5 font-mono">5V</td>
                    <td className="p-2.5 text-[#1B6F3E]">Power (5V DC)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Moisture Sensor GND</td>
                    <td className="p-2.5 font-mono">GND</td>
                    <td className="p-2.5 text-[#5A6B63]">Ground</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Moisture Sensor AOUT</td>
                    <td className="p-2.5 font-mono">A0</td>
                    <td className="p-2.5 text-[#3B82F6]">Analog Input (0-3V)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Green LED Anode (+)</td>
                    <td className="p-2.5 font-mono">Pin 9</td>
                    <td className="p-2.5 text-[#1B6F3E]">Digital High (OK)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Red LED Anode (+)</td>
                    <td className="p-2.5 font-mono">Pin 8</td>
                    <td className="p-2.5 text-[#DC2626]">Digital High (Dry)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Arduino Firmware Editor */}
          <div className="lg:col-span-7 bg-[#0F382A] rounded-3xl p-6 text-white border border-[#184F3B] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#D4F55C]">
                <FileCode className="w-4 h-4" />
                <span>plant_monitor_firmware.ino</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-[#144232] hover:bg-[#1B5641] text-xs font-mono text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#D4F55C]" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-[#D1DDD7] bg-[#0A261C] p-4 rounded-2xl overflow-x-auto border border-[#144232] leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: BUILD NOTES */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5EDE8] shadow-xs space-y-6 max-w-4xl">
          <h3 className="text-xl font-serif text-[#11221B]">
            Step-by-step Assembly & Calibration
          </h3>
          <div className="space-y-4 text-xs text-[#5A6B63] leading-relaxed">
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#EBE8DC] space-y-2">
              <h4 className="font-semibold text-[#11221B] text-sm">1. Clean the Probe Traces</h4>
              <p>Wipe the salvaged capacitive sensor with isopropyl alcohol. Ensure no residual mineral salts bridge the dual copper plates.</p>
            </div>
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#EBE8DC] space-y-2">
              <h4 className="font-semibold text-[#11221B] text-sm">2. Breadboard Assembly</h4>
              <p>Insert the LEDs with 220Ω current-limiting resistors into the mini breadboard to prevent overloading the ATmega328P output pins.</p>
            </div>
            <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-[#EBE8DC] space-y-2">
              <h4 className="font-semibold text-[#11221B] text-sm">3. In-Soil Calibration</h4>
              <p>Soil composition alters conductivity. Submerge probe halfway into thoroughly watered soil and adjust DRY_THRESHOLD constant if necessary.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
