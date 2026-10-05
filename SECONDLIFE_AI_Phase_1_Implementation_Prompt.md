# SECONDLIFE AI — Phase 1 Implementation Brief

## Instruction to Antigravity

Build **Phase 1** of **SECONDLIFE AI**, an AI-powered electronic-waste reuse and component-intelligence platform. Work as a senior product engineer: produce a working, maintainable application foundation—not a visual mock-up, a throwaway prototype, or a generic dashboard.

Before writing UI code, inspect the project workspace for the uploaded SECONDLIFE AI UI screenshots/design files. Those files are the **visual source of truth**. Reproduce their layout, hierarchy, spacing, colours, typography, components, iconography, data visualisations, and interaction patterns as faithfully as possible. If a screenshot and this brief conflict, follow the screenshot. Do not replace the design with a generic AI SaaS template.

## Product context

**Product:** SECONDLIFE AI  
**Tagline:** “Don’t throw it away. Build something new.”

SECONDLIFE AI helps students, makers, educators, laboratories, and institutions understand unused electronics, organise reusable components, and discover viable projects to build from them. The product combines component identification, e-waste inventory, capability analysis, project/component matching, feasibility scoring, missing-part analysis, cost and reuse savings, project generation, instructions, and environmental-impact tracking.

The product should feel like a credible engineering and sustainability tool: calm, precise, tactile, and optimistic. It must never look like a basic college CRUD app, a cryptocurrency dashboard, a ChatGPT clone, a neon cyberpunk interface, or a “vibe-coded” site with random cards and decorative gradients.

## Phase 1 objective

Create the production-quality foundation on which every later SECONDLIFE AI phase can be built. Phase 1 must deliver an authenticated, data-backed core experience with a polished dashboard, reusable component inventory, component detail/intelligence, and the first useful project-matching flow. Implement real persistence and realistic seeded data; do not rely on hard-coded UI-only states.

Later phases will add richer AI scanning, project generation/build guides, deeper savings/impact analytics, community functionality, and institutional workflows. Establish the architecture, design system, schemas, API conventions, and intelligence abstractions so those additions fit naturally without a rewrite.

## Required technology and architecture

Use the stack already present in the workspace if one exists. Otherwise, use a pragmatic modern TypeScript web stack:

- Next.js (App Router) + TypeScript
- Tailwind CSS for design tokens and responsive styling
- A component system built from accessible, composable primitives; do not ship an uncustomised component-library look
- PostgreSQL with Prisma (or the project’s existing ORM) and schema migrations
- Auth.js or an equivalent secure authentication solution
- Zod for input validation and typed server/API contracts
- Server-side data access, route handlers or server actions, and clear service/repository boundaries
- Local object/file storage abstraction for component photos, designed to swap to cloud storage later
- Vitest/Jest for unit tests and Playwright or equivalent for key end-to-end smoke tests

Keep secrets in environment variables. Include an `.env.example`, database setup instructions, migration/seed scripts, linting, formatting, and a concise README. Do not call paid external AI services during Phase 1. Make the intelligence layer provider-agnostic with deterministic local heuristics and mockable adapters so a vision/LLM provider can be introduced in a later phase without changing the UI or database contracts.

## Information architecture and Phase 1 screens

Implement only these surfaces fully, while creating route/component structure that can accommodate the later modules named in the navigation.

### 1. Auth and onboarding

- Sign in and account creation in the visual language of the provided design.
- A short onboarding flow that captures display name, role (student, maker, educator, lab/institution), experience level, and primary goal.
- Let users create or join a personal workspace. Model organisation/workspace membership even if the first release focuses on a single personal workspace.

### 2. Application shell and dashboard

- Faithfully implement the screenshot’s navigation, header, background treatment, cards, controls, empty states, and responsive behaviour.
- Dashboard should show real aggregate data: total reusable items, estimated reuse value, estimated e-waste diverted, recent additions, inventory categories, and a focused “what can I build?”/recommendation preview.
- Include purposeful loading, empty, error, and populated states.
- Any unavailable later-phase navigation destination should be visibly marked “Coming soon” or represented by a non-deceptive placeholder route; do not pretend unfinished functionality works.

### 3. Inventory

- List/grid view following the approved design, with search, category/type filters, condition filter, location filter, availability filter, sorting, and pagination or virtualisation as appropriate.
- Add, edit, archive, and restore components. Support a photo upload, but provide a strong no-photo state.
- A compact quick-add path plus a fuller form. Validate every field and show useful inline errors.
- Seed enough varied sample records to make filtering, dashboard metrics, and matching meaningful.

### 4. Component detail and component intelligence

- Build a rich detail page with photo, identity, category, manufacturer/model/part number when known, condition, quantity, location, acquisition source, notes, technical properties, tags, and lifecycle metadata.
- Model and display component capabilities in a structured way—for example voltage range, interfaces/protocols, pins, physical form factor, power characteristics, sensors/actuators, and supported use cases.
- Add a confidence-labelled “AI-assisted analysis” panel. In Phase 1, it must be powered by transparent deterministic rules from the entered data/seed catalog, with wording that does not imply a real image-recognition result.
- Include an edit flow and activity history for created/updated/archived actions.

### 5. Project matching: first useful intelligence loop

- Provide a “Discover projects” route or dashboard entry point that recommends a small curated Phase 1 project catalog based on the current inventory.
- Each project needs structured requirements, categories, difficulty, estimated build time, estimated new-purchase cost, a concise outcome, and an appropriate royalty-free/locally supplied image or engineered illustration.
- Calculate and display a deterministic feasibility score based on required components available, optional components available, condition/quantity, and compatibility constraints.
- Explain the score in plain language: available components, missing components, substitutions, estimated purchase cost, and a next action.
- A project detail can be concise in Phase 1, but its data model must support later build steps, richer instructions, generated variants, saved projects, and collaboration.

## Core data model

Create migrations and seed data for at least these concepts. Use UUIDs, created/updated timestamps, soft archive/deletion where appropriate, foreign keys, indexes for common queries, and clear ownership boundaries.

- `User`, `Workspace`, `WorkspaceMember`, and user profile/preferences
- `ComponentCategory` and optional category hierarchy
- `Component` (workspace ownership, identity, status, condition, quantity, location, photo reference, notes, acquisition metadata)
- `ComponentSpecification` or structured JSON/spec rows for technical properties
- `ComponentCapability` and `ComponentTag`
- `ComponentMedia`
- `InventoryActivity`
- `Project`, `ProjectRequirement`, `ProjectStep` (future-ready), `ProjectMedia`, and project tags
- `ProjectMatch`/saved recommendation, including score breakdown and missing-item snapshot
- `ImpactRecord` or a clearly documented calculation layer for reuse value, estimated cost avoided, and diversion metrics

Do not over-normalise arbitrary specifications that differ by category; keep common queryable fields normalised and permit a validated typed JSON extension for category-specific data. Introduce a catalog/normalisation service so later camera scans can resolve messy names and manufacturer part numbers to a canonical component record.

## Intelligence and calculation requirements

Implement an explicit domain service layer—not business logic scattered through React components.

- `ComponentNormalizer`: maps user input/seed aliases to canonical categories, tags, and capabilities.
- `CapabilityResolver`: derives transparent capabilities from specifications and known catalog entries.
- `ProjectMatcher`: evaluates a workspace inventory against project requirements; produces a 0–100 feasibility score and structured reasons.
- `ImpactCalculator`: computes clearly labelled estimates for reuse value, avoided purchase cost, and estimated e-waste diversion. Store the assumptions/constants in one documented location.

Use explainable scoring. A suggested baseline: 70% required-part coverage, 15% optional-part coverage, 10% condition/quantity adequacy, and 5% compatibility/constraint fit. Make weights configurable and write tests for the score boundaries. Never present estimates as certified environmental measurements.

## Visual quality, motion, and assets — mandatory for this and every future phase

The uploaded UI design remains the visual contract throughout Phase 1 and **all later phases**. Build a small reusable design system now: semantic colour tokens, typography scale, spacing, surfaces, borders, radii, shadows, icon rules, form controls, charts, status badges, and responsive breakpoints. Every new page in later phases must reuse these tokens and components rather than introduce a competing style.

Implement motion deliberately and accessibly:

- Subtle page and section entrance transitions; avoid theatrical effects.
- Responsive hover, focus, pressed, selected, drag/drop, filtering, and progress states.
- Gentle list/card transitions and numeric count updates where consistent with the design.
- Skeleton loaders that match final layouts and informative success/error toasts.
- Respect `prefers-reduced-motion`; animations must never block input or reduce readability.

Use imagery only where it communicates product value: real-looking electronic components, textured workbench context, material close-ups, and project imagery. Prefer licensed/royalty-free assets or supplied assets, optimise them, provide meaningful alt text, and keep an attribution/source note where required. Do not use generic floating-AI art, stock people pointing at screens, or decorative imagery that conflicts with the approved screenshots.

## Accessibility, quality, and security

- Meet WCAG 2.1 AA colour contrast, semantic heading order, keyboard navigation, visible focus, labels, error announcements, and alt text.
- Ensure forms, dialogs, menus, tables, charts, uploads, and drag/drop workflows remain usable with keyboard and assistive technology.
- Protect workspace data through server-side authorisation on every read/write; never rely only on client-side filtering.
- Validate and sanitise input, enforce file type/size limits, and design media URLs/access for future private storage.
- Optimise for desktop first while fully supporting tablet and mobile layouts without broken navigation or clipped content.

## Acceptance checklist

Phase 1 is complete only when all of the following are true:

- The supplied UI screenshots have been inspected and their system is recognisably implemented, without generic substitutions.
- A new user can sign up, complete onboarding, create a workspace, and use the authenticated application shell.
- A user can create, edit, search, filter, and archive inventory components with persisted data.
- Dashboard figures, category breakdowns, recent activity, and inventory states are calculated from the database.
- Component detail shows structured capabilities and an honest, deterministic assistance result.
- Project discovery returns inventory-aware recommendations with explainable feasibility, missing parts, and estimated cost/value information.
- Data migrations, seed data, environment template, documentation, tests, linting, and build checks succeed from a clean local setup.
- Empty/loading/error states, keyboard interaction, reduced motion, responsive layouts, and basic authorisation paths are verified.
- The implementation leaves clear extension points for image recognition, LLM-assisted suggestions, build instructions, impact dashboards, community/institution workflows, and richer analytics in later phases.

## Delivery expectations

At the end, provide a short implementation summary, the setup/run steps, database migration and seed commands, test commands/results, relevant environment variables, and a clear list of what is intentionally deferred to Phase 2+. Do not add Phase 2+ features prematurely. Do not sacrifice the approved UI quality, motion language, or data architecture to move faster.
