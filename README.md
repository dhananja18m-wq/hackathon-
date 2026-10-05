# SECONDLIFE AI (reboard) — Phase 1

> **“Don’t throw it away. Build something new.”**
> AI-powered electronic-waste reuse, component intelligence, and project discovery platform.

---

## 📸 Visual Design System Contract
This implementation faithfully replicates the approved **reboard** UI design system:
- **Palette**: Deep Forest Green (`#0F382A`), Electric Lime (`#D4F55C`), Warm Linen Cream (`#F6F5EE`), Charcoal Slate (`#11221B`), and Muted Sage (`#5A6B63`).
- **Typography**: Editorial Serif headings paired with clean geometric Sans-Serif and Uppercase Monospaced tracking metadata eyebrows.
- **Surfaces**: Tactile workbench cards, responsive drawers, high-contrast metric indicators, and accessible focus states.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js `v18+` or `v20+` / `v24+`
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database & Environment
```bash
# SQLite is pre-configured out-of-the-box with zero server setup required:
cp .env.example .env
```

### 3. Generate Schema & Seed Benchmark Data
```bash
# Push Prisma schema to SQLite database:
npm run db:push

# Seed with 24 realistic benchmark components & 12 curated projects:
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the automated test suite covering all deterministic domain services:
```bash
npm test
```
**Test Coverage:**
- `ComponentNormalizer`: Canonical alias matching, part number parsing, weight and capability heuristics.
- `CapabilityResolver`: Pinouts, voltage domains, and multi-protocol derivation.
- `ProjectMatcher`: 4-tier explainable feasibility algorithm (70% required coverage, 15% optional coverage, 10% condition adequacy, 5% constraint fit).
- `ImpactCalculator`: Electronic waste diverted mass (kg), dollar purchase costs avoided, and lifecycle CO2e estimates.

---

## 📐 Architecture & Domain Services

```
├── prisma/
│   ├── schema.prisma          # User, Workspace, Component, Capability, Project, Requirement, BOM
│   └── seed.ts                # Realistic dataset matching UI benchmark (24 parts, 12 projects)
├── src/
│   ├── app/
│   │   ├── page.tsx           # 01 Workbench Dashboard
│   │   ├── identify/          # 02 Component AI Scan, Bounding Box & Review pipeline
│   │   ├── inventory/         # 03 Inventory Table, Search, Category/Condition Filters & Details
│   │   ├── discover/          # 04 Discover Projects, Feasibility Scoring & Capability Banner
│   │   ├── plans/             # 05 Project Plan Detail, Interactive BOM & Firmware Viewer
│   │   ├── impact/            # Phase 2 Community Impact Preview
│   │   ├── classroom/         # Phase 2 Classroom & Teams Preview
│   │   └── api/               # Typed Next.js Route Handlers
│   ├── domain/
│   │   ├── normalizer.ts      # ComponentNormalizer
│   │   ├── capability.ts      # CapabilityResolver
│   │   ├── matcher.ts         # ProjectMatcher (4-tier feasibility scoring)
│   │   └── impact.ts          # ImpactCalculator (sustainability metrics)
│   └── components/
│       ├── layout/            # Sidebar, Header, ShellLayout
│       └── common/            # Custom engineered SVG illustrations & visualizers
```

---

## 📋 Phase 2+ Deferred Features

The following items are intentionally deferred to subsequent phases as per specification:
1. **Live Camera OCR / Vision Model Integration**: Phase 1 establishes the deterministic heuristics, photo capture bounding box, and normalization pipeline.
2. **LLM Custom Project Generation**: Phase 1 includes curated inventory-matched project catalog and BOM generator.
3. **Institutional Carbon Ledger**: Community carbon certificates and multi-tenant lab checkouts (preview routes available at `/impact` and `/classroom`).
