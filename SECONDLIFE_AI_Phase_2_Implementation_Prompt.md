# SECONDLIFE AI — Phase 2 Implementation Brief

## Instruction to Antigravity

Build **Phase 2** of **SECONDLIFE AI** on top of the completed Phase 1 application. Phase 2 turns the useful inventory foundation into a compelling intelligence workflow: users can identify components from photographs, receive reliable capability analysis, generate and refine project ideas from their available e-waste, and follow practical build plans.

Treat the existing Phase 1 codebase, database, and the uploaded SECONDLIFE AI UI screenshots/design files as authoritative. Inspect them before modifying anything. Preserve working Phase 1 behaviour and reuse its design tokens, components, route patterns, database conventions, motion system, and service boundaries. Do not recreate the application from scratch or replace the approved design with generic AI chat, dashboard, or template UI.

## Product context

**Product:** SECONDLIFE AI  
**Tagline:** “Don’t throw it away. Build something new.”

SECONDLIFE AI helps students, makers, educators, laboratories, and institutions understand unused electronics and turn them into useful projects. It should feel like a precise, credible engineering-and-sustainability product—not a toy prototype or an opaque AI demo.

## Phase 2 objective

Deliver the core “scan → understand → build” journey:

1. A user uploads or photographs an electronic component.
2. The system identifies likely components and asks the user to confirm ambiguous results.
3. The component is converted into a structured, editable inventory item with transparent capability analysis.
4. The user receives inventory-aware project ideas and can generate/refine a project concept.
5. The user opens a project workspace with requirements, missing parts, feasibility, costs, reuse value, and a practical build plan.

This phase must use real persistence, explicit confidence and provenance, graceful fallback behaviour, and explainable results. It must not claim AI certainty where the system is guessing.

## Preserve the visual system — mandatory

The approved screenshots remain the visual source of truth throughout Phase 2 and every later phase. Closely match their hierarchy, navigation, spacing, colour, typography, surfaces, illustration/photo treatment, iconography, data displays, and responsive layouts.

- Use the Phase 1 semantic design tokens and reusable components; extend them only when genuinely necessary.
- Keep the interface calm, tactile, technical, and sustainability-led. Avoid neon, glassmorphism overload, floating-gradient effects, generic ChatGPT layouts, random cards, and oversized decorative metrics.
- Carry the same polished interaction language into all new screens: subtle entrances, responsive hover/focus/pressed states, skeletons, status transitions, progress feedback, and useful success/error feedback.
- Honour `prefers-reduced-motion`; motion must clarify state, never delay a task.
- Use component/product imagery only where it adds comprehension. Prefer user-provided images, supplied assets, or appropriate licensed/royalty-free visual assets. Optimise images and include meaningful alt text and attribution/source records where applicable.

## Required Phase 2 experiences

### 1. Component scanner and intake

Create a scanner flow accessible from the dashboard and inventory:

- Offer image upload, drag/drop, paste, and mobile-camera capture where supported by the browser.
- Show clear pre-upload guidance: use good lighting, photograph labels/pins, include multiple angles for ambiguous boards, and do not upload sensitive documents.
- Validate file type, image dimensions, and size. Provide client-side preview, remove/replace controls, upload progress, retry behaviour, and accessible errors.
- Support one primary image and optional supplementary images (label, pins, reverse side).
- Present the analysis in stages: uploaded → analysing → candidate results → confirmation → saved to inventory. Each state must work with keyboard and screen readers.
- Never make a low-confidence prediction silently become inventory truth. Let users edit, reject, or create a custom component.

### 2. Component identification and analysis service

Implement the scanning capability behind a provider-agnostic server-side interface. Keep external secrets and network calls off the client.

- Define a `VisionAnalysisProvider` interface with typed request/result contracts.
- Implement a development/demo provider that returns deterministic, realistic candidate results from seeded fixtures or image metadata/file names, so the full experience works without paid credentials.
- If a real vision provider is configured, isolate it in an adapter selected through environment configuration. Include strict timeouts, retries/backoff, output validation, rate limits, and actionable fallback messages. Never expose provider keys to the browser.
- Record analysis version, provider name, timestamp, confidence, image/media linkage, raw/normalised result boundaries, and user confirmation/correction.
- Do not use the model’s output as an unrestricted source of truth. Normalise it through the Phase 1 catalog/normaliser; validate all structured fields with Zod or the existing validation layer.

The displayed result should include:

- top candidate(s), confidence level, category, and visual/label evidence where available;
- manufacturer, model/part number, and specifications only when supported by evidence;
- inferred capabilities, common use cases, safety cautions, and what requires manual confirmation;
- a friendly “why we think this” explanation, not hidden reasoning traces;
- clear editing and confirm-to-inventory controls.

### 3. Advanced component intelligence

Extend the Phase 1 capability model and detail page:

- Generate structured capabilities from a confirmed component identity and specifications: voltage/power, interfaces, pins, form factor, sensor/actuator behaviour, compatible platforms, typical applications, and constraints.
- Add compatibility relationships (for example Arduino-compatible, 3.3 V only, requires driver/transistor, serial/UART, I2C) using explicit data rather than unverified AI prose.
- Show safety/use-condition flags when relevant, such as high voltage, battery handling, polarity, ESD sensitivity, unknown condition, or required supervision. Use careful language: this is educational guidance, not a replacement for manufacturer documentation or professional safety advice.
- Allow users to correct AI-derived fields and retain source/provenance per field where practical: user-entered, catalog, inferred rule, or AI suggestion.
- Add an “analysis history” timeline that distinguishes scan results, user edits, and catalog updates.

### 4. AI project discovery and generation

Create a dedicated Discover/Generate Projects experience that feels like a structured engineering assistant—not a bare chatbot.

- Start with inventory-aware recommended projects from the Phase 1 project catalog.
- Add a guided generator where users select a goal, skill level, intended use, available time, budget for missing parts, and optional constraints (for example education, accessibility, gardening, home automation, robotics, art).
- Generate 2–4 distinct project concepts with an understandable rationale tied to the actual inventory.
- Each concept must include: title, one-sentence value, difficulty, estimated time, reusable components used, missing/optional components, estimated purchase cost, estimated reuse value, feasibility score, assumptions, and safety/skill prerequisites.
- Let users refine a concept with bounded controls such as “simpler,” “lower budget,” “use more of my inventory,” “no soldering,” or “classroom-friendly.” Preserve the original proposal and display what changed.
- Make it possible to save one concept as a project workspace.

Implement generation with a provider abstraction such as `ProjectGenerationProvider` and a deterministic demo implementation. If an LLM-backed provider is configured, use server-side calls only; require structured output, validate it, apply moderation/guardrails, impose timeouts/limits, and always fall back to curated recommendations when unavailable. Never show invented component compatibility, electrical values, or safety-critical instructions as fact.

### 5. Project workspace and build plan

Expand a saved project into a focused workspace with:

- project overview, intended outcome, cover imagery, and status;
- an explainable feasibility score and live compatibility/requirements breakdown;
- “available,” “missing,” “optional,” and “substitution” component groups tied to the user’s inventory;
- cost summary: estimated new-purchase cost, missing-part cost, reuse value, and clearly labelled estimates/assumptions;
- a sequenced build plan with materials, preparation, numbered steps, checks/milestones, warnings, estimated duration, and troubleshooting prompts;
- a start/continue flow that saves current step/progress and supports future collaboration without a schema rewrite;
- the ability to add/remove a project component, select an alternative, and re-evaluate feasibility.

Generated build steps must remain cautious and actionable. Avoid unsafe mains-voltage work and high-risk instructions. Where a project would require specialised expertise, label it appropriately and steer toward safer alternatives.

## Data model and migration requirements

Extend the Phase 1 schema through migrations; do not break existing records. Add or adapt models for:

- `ComponentScan`/`AnalysisRun`: request state, provider, version, media, normalised candidates, confidence, errors, and completion times;
- `ComponentIdentificationCandidate`: canonical component linkage, evidence summary, confidence, and user disposition;
- per-field component provenance/correction history where appropriate;
- component compatibility rules/relationships and safety guidance;
- `ProjectGenerationRequest` and `ProjectGenerationResult`, including constraints, provider/version, inputs snapshot, validation state, and outcome;
- `ProjectWorkspace` or extension of `ProjectMatch` for saved project state, owner/workspace, selected components, status, and progress;
- `ProjectWorkspaceComponent` / requirement resolution with selected inventory component, quantity, substitution, cost assumption, and availability state;
- `BuildStep`, build-step warnings/checks, and `ProjectProgress`;
- media/source/attribution metadata for user uploads and supplied/generated project images;
- auditable activity records for scan confirmation, project generation, saving, and progress updates.

Use UUIDs, timestamps, foreign keys, ownership/authorisation boundaries, appropriate indexes, soft archiving where needed, and JSON fields only for data that is genuinely variable. Version AI/generation inputs and outputs so results are reproducible and debuggable.

## Domain services and API boundaries

Keep business logic out of presentation components. Extend the Phase 1 service layer with clearly tested domain modules:

- `ScanOrchestrator`: media validation, provider invocation, lifecycle state, fallback, and persistence.
- `IdentificationResolver`: catalog normalisation, candidate ranking, evidence handling, and confirmation application.
- `CompatibilityEvaluator`: checks requirements, specifications, quantity, power/interface constraints, and substitutions.
- `ProjectGenerationService`: validates user goals/constraints, selects provider or curated catalog fallback, validates structured results, and persists results.
- `BuildPlanService`: creates/updates a safe structured plan and validates step data.
- Updated `ProjectMatcher` and `ImpactCalculator`: evaluate live inventory/project workspace state with explainable score/cost/impact breakdowns.

Expose typed, authorised server actions/routes. Apply rate limiting and idempotency where uploads and provider calls could duplicate work. All workspace reads/writes must enforce membership server-side.

## Seed data, demo mode, and error handling

- Expand seed data with varied components, component images/fixtures where permitted, canonical specifications/capabilities, compatibility rules, and at least 8–12 practical project templates.
- Include demo scan fixtures that exercise high-confidence, low-confidence, ambiguous, unsupported, and failed-analysis states.
- Include generated-project fixtures covering high feasibility, partial feasibility, low budget, no-soldering, and missing-critical-part cases.
- The application must be demonstrable end-to-end without external API keys. Clearly mark demo analysis/generation as such in development/demo mode.
- Make unavailable-provider behaviour helpful: retain the upload, offer retry, show curated alternatives, and never lose the user’s work.

## Accessibility, privacy, security, and quality

- Preserve WCAG 2.1 AA standards across all scanner, editor, wizard, results, and build-plan interactions.
- Use labels, meaningful progress states, keyboard-operable drop zones/dialogs, visible focus, semantic data tables/lists, and announced async status/errors.
- Authorise every media, inventory, scan, generation, project, and progress operation server-side by workspace membership.
- Validate/sanitise all inputs and uploaded media; enforce limits and safe content types; use private media storage patterns where supported.
- Give users a way to delete an uploaded scan image and associated analysis when appropriate, respecting retention/audit requirements.
- Make generated text clearly distinguishable from verified catalog data and user input.

## Testing and verification

Add or update automated tests for:

- scan media validation, provider fallback, result validation, normalisation, and confirmation;
- compatibility evaluation and feasibility-score boundary cases;
- generated-project structured output validation and safe curated fallback;
- cost/impact calculations and provenance recording;
- workspace authorisation for all new data paths;
- essential end-to-end journeys: scan/confirm/save, discover/generate/save, requirements resolution, and build-step progress.

Run linting, type checking, database migration/seed checks, unit tests, production build, and a small end-to-end smoke suite. Manually verify desktop, tablet, and mobile states; empty/loading/error states; reduced motion; keyboard navigation; and a clean database setup.

## Phase 2 acceptance checklist

Phase 2 is complete only when:

- Phase 1 remains functional and visually consistent.
- A user can upload/capture component images, receive clear candidates, correct/confirm the result, and persist the result to inventory.
- Scan results have explicit confidence, evidence/provenance, safe fallback behaviour, and honest status language.
- Component details show editable advanced capabilities, compatibility information, cautions, and a traceable history.
- Users can discover inventory-aware projects, generate/refine bounded project ideas, and save one as a project workspace.
- Saved projects show live requirement resolution, explainable feasibility, costs/estimates, reuse value, and an actionable safe build plan.
- The full flow works in demo mode with no external paid API configured.
- Any configured AI/vision service is server-side, validated, rate-limited, replaceable, and never represented as infallible.
- All new UI honours the approved design, animation language, asset direction, responsive behaviour, and accessibility standards.
- Database migrations, seed scripts, tests, linting, type checking, and production build pass from a clean setup.

## Explicitly defer to Phase 3+

Do not prematurely build community feeds, public project publishing, social collaboration, institutional multi-admin analytics, advanced impact reporting, marketplace features, hardware integrations, or broad notification systems. Keep the Phase 2 models extensible for them, but implement only the scan-to-build intelligence workflow described here.

## Delivery expectations

When finished, provide a concise summary of what was built, setup/migration/seed/run commands, required and optional environment variables, test/build results, known limitations of demo and configured AI providers, and a precise list of Phase 3+ items that remain deferred.
