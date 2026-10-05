# SECONDLIFE AI — Phase 4 Implementation Brief

## Instruction to Antigravity

Build **Phase 4** of **SECONDLIFE AI** on top of the completed Phase 1, 2, and 3 application. This is the final launch-readiness and product-polish phase. Do not rewrite the product, replace its architecture, or introduce an unrelated visual direction.

Before editing, inspect the current repository, existing routes, database/schema/migrations, tests, technical documentation, and all uploaded SECONDLIFE AI UI screenshots/design files. The screenshots and implemented Phase 1–3 design system are the visual source of truth. Preserve and improve the same product—not a generic alternative.

## Product context

**Product:** SECONDLIFE AI  
**Tagline:** “Don’t throw it away. Build something new.”

SECONDLIFE AI helps students, makers, educators, laboratories, and institutions identify reusable electronic components, organise e-waste, discover safe projects, create build plans, collaborate, and understand the measurable value of reuse.

By the end of Phase 4, the application should be a credible, stable, accessible, secure, and demo-ready product that communicates a complete user journey:

**scan → understand → inventory → discover → build → complete → measure impact → share/remix.**

## Phase 4 objective

Strengthen and polish the full product for real users, hackathon judging, and future deployment:

1. Make the complete existing journey coherent, fast, reliable, and delightful.
2. Close production-quality gaps in onboarding, search, user preferences, notifications, settings, and account/workspace management.
3. Establish observability, security hardening, data operations, testing, deployment readiness, and recovery practices appropriate to the selected stack.
4. Create a high-quality guided demo mode and presentation-ready states using the real application—not a separate fake showcase.

Do not expand scope into a marketplace, payments, public direct messaging, live hardware telemetry, complex social networking, enterprise SSO/provisioning, regulatory certification, or unverified environmental claims.

## Preserve the visual system, assets, and motion language — mandatory

The approved UI screenshots and the existing Phase 1–3 design system remain the visual contract in Phase 4 and any future work.

- Reuse existing semantic tokens, typography, spacing, radii, surfaces, icons, form controls, chart rules, responsive breakpoints, and shared components. Remove visual drift; do not create a competing admin/template style.
- Maintain the product’s calm, precise, tactile engineering-and-sustainability aesthetic. Avoid default SaaS dashboards, neon, excessive gradients/glass, decorative AI art, and meaningless metric cards.
- Apply restrained, high-quality animation: responsive hover/focus/pressed states, skeletons, transitions that clarify filters/progress/state changes, feedback toasts, and smooth navigation where compatible with the framework.
- Honour `prefers-reduced-motion`. No animation may delay essential interaction, obscure data, or cause layout instability.
- Use imagery only when it supports comprehension: components, build outcomes, workbench/material context, and user-approved project media. Optimise assets, preserve source/attribution/consent, and provide alt text.
- Audit every screen for coherent empty, loading, success, error, offline/unavailable, permission-denied, and mobile states in the approved visual language.

## Required Phase 4 experiences

### 1. End-to-end product polish

Audit and improve every implemented primary path from Phases 1–3:

- account creation/onboarding → workspace setup → inventory creation;
- component scan/upload → candidate review → correction/confirmation → capability view;
- discovery/generation → feasibility review → project workspace → build progress;
- project completion → impact review → private/public portfolio → remix;
- collaborator invite → scoped project collaboration → comments/activity;
- institution/lab insight → filtering → accessible report/export.

For each path, remove dead ends and misleading affordances. Ensure that calls to action lead somewhere useful, forms preserve unsaved draft data when reasonable, destructive actions require clear confirmation, and success states offer an appropriate next action.

### 2. Global search and navigation

Implement a fast, accessible command/search experience that works across the user’s authorised workspace data:

- Search components, projects, project workspaces, community publications, members (where permitted), and common actions such as add component or start a scan.
- Support keyboard opening, navigation, selection, clear empty states, result grouping, and mobile usability.
- Search only data the current user is permitted to access. Do not expose private inventory, unpublished projects, or member information through suggestion text, counts, timing, or deep links.
- Use a simple, index-friendly search strategy suitable for the project’s database. Document how it can evolve to full-text/external search later; do not add infrastructure solely for speculation.
- Review global navigation labels, breadcrumb/back behaviour, route loading, and mobile navigation so primary work is always easy to find.

### 3. Settings, preferences, and data controls

Create coherent account and workspace settings that respect the existing roles/permissions:

- Account: display name, avatar, role/experience preferences, timezone/locale if supported, accessibility preferences, and notification preferences.
- Workspace: profile, type, logo, member/role management, invite policy, visibility defaults, and data/impact methodology view for owners/admins.
- Personal preferences: default workspace, dashboard date range, motion preference override only when user controlled, scanner/generation demo-mode messaging, and privacy defaults for newly completed projects.
- Data controls: a user-facing way to delete uploaded scan media and clear a failed scan; safe archive/restore flows for components/projects; appropriate account/workspace export/deletion extension points. Do not falsely claim legal compliance or offer unsafe irreversible deletion paths.
- Every settings change must validate input, state effects plainly, be persisted, authorised server-side, and give accessible success/error feedback.

### 4. Notification centre and purposeful reminders

Add a modest, non-intrusive in-app notification system for meaningful events only:

- collaborator invitation and role changes;
- comment/mention where existing collaboration permissions allow it;
- project shared/updated where relevant;
- scan/generation completion or failure for asynchronous tasks;
- inventory-aware reminders such as a saved project whose feasibility changed after inventory changes;
- export completion/failure if exports are asynchronous.

Requirements:

- Group and deduplicate notifications; never create noisy event spam.
- Support unread/read state, deep links, mark-all-read, and notification preferences.
- Enforce authorisation at creation and read time; hide content that becomes inaccessible.
- Prefer in-app delivery. Add email only if the existing deployment/configuration supports it securely; otherwise document the adapter/interface rather than simulating email.

### 5. Guided demo mode and product storytelling

Create a robust demonstration experience using real, seeded product data—not a static landing page or separate mock app:

- Provide a clearly labelled Demo workspace/account or demo-data bootstrap command.
- Seed a compelling realistic story: a small set of e-waste components, an ambiguous scan, a confirmed component, multiple feasibility outcomes, a completed build, a measured impact result, a public/remixable project, a comment/collaborator, and a lab insight view.
- Add an optional, dismissible guided-tour layer explaining the key value moments in 5–8 short steps. It must be keyboard accessible, reduced-motion aware, non-blocking, and must not hide normal functionality.
- Include a “reset demo data” mechanism only in development/demo environments and protect it from production use. Explain clearly what it resets.
- Add a simple project overview/readme page inside or alongside the app that describes the problem, the user journey, technical architecture, AI/demo boundaries, safety posture, and impact-estimate limitations—use the established visual language.

### 6. Reliability, background work, and graceful degradation

Review Phase 2 scanning/generation and Phase 3 reporting/export workflows for operational resilience:

- Formalise long-running work as a typed job/task abstraction if it is not already one. Track queued/running/succeeded/failed/cancelled state, retry counts, idempotency key, ownership, timestamps, and user-safe error text.
- Use an appropriate existing queue/background mechanism where available. If adding one is unjustified for local demo deployment, keep a clean adapter/interface and a durable database-backed task model that works locally.
- Ensure retries do not duplicate scans, generations, project completion impact events, notifications, or exports.
- Provide status feedback and retry controls in the UI. Preserve user input/uploads when a provider is unavailable.
- The product must remain useful with external vision/LLM providers unavailable: continue inventory, catalog matching, curated project recommendations, build workspaces, impact, collaboration, and community features using existing deterministic/demo fallbacks.

## Security, privacy, and data operations

Conduct and address a practical application security/privacy audit. Do not rely on client UI for any security control.

- Enforce authentication, workspace membership, role, resource ownership, and publication visibility server-side for every page, action, API route, download, media item, export, notification, comment, invitation, and search result.
- Centralise authorisation rules and add regression tests for cross-workspace and cross-role access attempts.
- Validate all inputs with typed schemas; sanitise user-generated text/Markdown/URLs; protect against XSS, CSRF where relevant to the chosen auth model, open redirects, insecure direct-object references, injection, CSV formula injection, and unsafe file handling.
- Restrict uploads by content type, extension, size, image processing policy, and storage visibility. Strip or avoid leaking EXIF/location metadata in public media unless explicitly needed and consented to.
- Use environment variables for credentials and document a complete `.env.example`; do not include secrets in source, seeds, logs, error messages, or client bundles.
- Add structured audit events for material access/permission/publication/export/invite changes, with retention/visibility documented.
- Define backup/restore and migration practices in documentation. Implement safe seed/demo reset boundaries and verify that production data cannot be accidentally reset by a normal application action.

## Observability and operational readiness

Add privacy-conscious observability appropriate to the stack:

- Structured server logs with request/correlation IDs, route/action, workspace-safe identifiers, severity, durations, and sanitised error details.
- Central error boundary/handling for UI routes and server errors; user-facing messages must be helpful without revealing internals.
- Health/readiness endpoint or equivalent documented health check for the application and database dependencies.
- Optional pluggable error/performance monitoring adapter, disabled or no-op locally unless configured through environment variables.
- Measure key performance paths: dashboard load, inventory list/filter, scan/generation workflow, project matching, community discovery, and analytics/export queries. Address obvious N+1 patterns and add appropriate indexes/caching without making data stale or untraceable.
- Document deployment assumptions, environment setup, migration order, seed/demo mode, rollback considerations, and known operational limits.

## Data model and service-layer requirements

Extend existing schema/migrations safely and avoid duplicate logic. Add/adapt models as needed for:

- account/workspace preferences and privacy defaults;
- in-app notification, notification preference, delivery/read state, deduplication key, and authorised target resource;
- background job/task lifecycle, idempotency, attempts, safe error code/message, payload/result references, and actor/workspace linkage;
- guided demo/tour completion state; use seed configuration rather than production user-content shortcuts;
- audit events for material settings, permission, publication, export, and administrative actions;
- search metadata/indexes where supported by the selected database;
- feature/configuration flags only when required for demo versus configured external-provider behaviour. Keep flags typed, server-side, documented, and auditable.

Build or extend focused, tested services such as:

- `GlobalSearchService`
- `PreferenceService`
- `NotificationService`
- `JobOrchestrator`
- `DemoDataService`
- `AuditService`
- `MediaSecurityService`
- `Health/ReadinessService`

Use typed, validated, server-authorised contracts. Keep domain logic outside UI components. Retain all calculation, scan, generation, matching, impact, publication, and workspace services from earlier phases as the single source of truth.

## Documentation and developer experience

Deliver clear, concise project documentation:

- README with prerequisites, environment variables, install/run steps, database migration and seed commands, demo mode, tests, build, and production-start instructions.
- Architecture overview showing frontend/server/data boundaries, major domain services, media handling, provider adapters, jobs, permissions, and impact data flow.
- Database/schema notes and a role/permission matrix.
- AI/provider documentation: demo versus configured provider behaviour, data sent to providers, validation/fallback, rate/cost controls, and user-facing limitations.
- Impact methodology: versioned constants/sources/units, assumptions, coverage, limitations, and how recalculation works.
- Deployment/operations runbook: health checks, migrations, backups, logging, monitoring configuration, common recovery paths, and safe demo-data handling.
- A brief contribution/quality guide covering lint, types, tests, accessibility, visual design-system reuse, and no-secrets policy.

## Testing and verification

Expand automated and manual verification until the app is safe to present and extend.

Automated coverage must include:

- full authorised end-to-end journey from onboarding through scan/inventory/discovery/build/completion/impact/publication/remix;
- all workspace role/visibility boundaries, including search, deep links, media, exports, notifications, and deleted/archived resources;
- notification deduplication/preferences and job idempotency/retry/failure;
- settings/privacy persistence and upload/media safety controls;
- curated/demo fallbacks when AI/vision providers are unavailable or fail;
- impact methodology version/data coverage display and existing Phase 1–3 calculation regression cases;
- critical keyboard flows, reduced-motion behaviour where testable, and responsive smoke coverage;
- CSV/export safety and rate/authorisation controls.

Run and report: formatting/linting, type checking, database migration, clean seed/demo bootstrap, unit/integration tests, production build, and an end-to-end smoke suite. Manually inspect desktop, tablet, and mobile layouts; empty/loading/error/restricted states; screen-reader/keyboard basics; dark/light mode only if already part of the approved design; and the complete demo story on a fresh setup.

## Phase 4 acceptance checklist

Phase 4 is complete only when:

- Phases 1–3 remain complete, stable, and visually consistent.
- The complete scan-to-impact-to-community user journey is coherent, has no obvious dead ends, and is demonstrable using real seeded data without paid external services.
- Global navigation/search, settings/preferences, notifications, and a non-blocking guided demo improve usability without exposing private data or creating noise.
- External-provider failure does not break core product value; jobs are idempotent, observable, retriable, and transparent to the user.
- Server-side authorisation, validation, safe uploads/media, audits, export/search privacy, error handling, and secret management have been reviewed and tested.
- Application health, logs, documentation, environment configuration, migration/backup guidance, and deployment steps are ready for a real handoff.
- All UI preserves the approved design system, component/asset quality, responsive behaviour, accessible motion, and WCAG 2.1 AA practices.
- Migrations, seed/demo setup, linting, type checks, tests, production build, and end-to-end smoke tests pass on a clean setup.

## Delivery expectations

When finished, provide:

- a concise Phase 4 implementation summary;
- exact install, environment, migration, seed/demo, run, test, build, and production-start commands;
- a list of optional provider/monitoring configuration variables and what each enables;
- test/build results and a short security/performance/accessibility verification summary;
- the demo walkthrough steps a judge can follow;
- known limitations and clearly deferred future work.

Do not claim third-party AI accuracy, certified environmental impact, legal compliance, or production SLA guarantees that have not actually been verified.
