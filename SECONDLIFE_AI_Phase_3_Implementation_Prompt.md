# SECONDLIFE AI — Phase 3 Implementation Brief

## Instruction to Antigravity

Build **Phase 3** of **SECONDLIFE AI** on top of the completed Phase 1 and Phase 2 application. Do not rebuild, regress, or restyle the existing product. Inspect the current workspace, database, prior-phase implementation, and uploaded SECONDLIFE AI UI screenshots/design files before changing code.

The uploaded design remains the visual source of truth. Preserve the existing design tokens, layout, navigation, typography, colours, components, responsive rules, imagery direction, animation language, accessibility practices, database conventions, and service boundaries. Extend them carefully; do not introduce a separate generic “admin dashboard,” social feed template, or a new visual brand.

## Product context

**Product:** SECONDLIFE AI  
**Tagline:** “Don’t throw it away. Build something new.”

SECONDLIFE AI helps students, makers, educators, laboratories, and institutions understand unused electronics and turn them into useful projects. Phase 3 demonstrates the wider value of reuse: measurable sustainability impact, shareable projects, collaboration, and organisation-level intelligence.

## Phase 3 objective

Deliver the platform’s **impact and community layer**:

1. Personal users see credible, understandable reuse and environmental-impact progress.
2. Completed projects can be documented, safely published, discovered, and remixed by the community.
3. Workspaces can collaborate through roles, project participation, comments, and activity.
4. Educational labs and institutions gain an organisation-level view of inventory, reuse activity, projects, participation, and impact.

Make the product feel like a real, trustworthy engineering-sustainability platform. All metrics, estimates, community content, and permissions must be traceable and honest. Avoid gamification that makes safety or sustainability claims feel superficial.

## Preserve and extend the visual system — mandatory in all later phases

The approved screenshots and existing Phase 1/2 implementation are the visual contract.

- Reuse existing semantic tokens and components. Any new chart, data table, feed, status, modal, profile, analytics control, or collaboration surface must look native to SECONDLIFE AI.
- Maintain a calm, tactile, practical engineering aesthetic. Avoid excessive gradients, neon, glassmorphism, generic stock-people imagery, decorative AI artwork, and dense random card layouts.
- Use data visualisation purposefully: readable labels, explanatory context, accessible legends, tooltips that are not the sole way to access information, responsive layouts, and non-colour-only encodings.
- Retain polished but restrained motion: page/section entrances, filtering and chart transitions, live status feedback, hover/focus/pressed states, skeletons, empty/error states, and non-blocking success toasts.
- Respect `prefers-reduced-motion` everywhere. Motion must explain change, never hide data or slow essential actions.
- Use authentic project and component imagery where it communicates a result. Respect attribution, user permissions, image optimisation, and meaningful alt text.

## Required Phase 3 experiences

### 1. Personal impact dashboard

Create a dedicated Impact experience, plus a concise dashboard summary:

- Show a user/workspace’s components reused, projects completed, estimated e-waste diverted, estimated new-purchase cost avoided, reuse value, active inventory, and project completion rate.
- Support clear date ranges (for example 30 days, 90 days, all time) and explain which events contribute to each metric.
- Include useful trends and breakdowns: impact over time, category contribution, project contribution, reuse versus unused inventory, and components rescued/reused.
- Use a transparent calculation-assumptions panel: estimates, units, source/constant versions, data coverage, and limitations. Never present estimates as certified environmental measurements or carbon-offset equivalents without a documented methodology.
- Allow users to inspect a metric’s contributing components/projects; data displayed on charts must be reachable in accessible text/table form.
- Include actionable, inventory-aware prompts such as items with high reuse potential, stalled projects, and low-effort next steps—not generic sustainability platitudes.

### 2. Project completion and portfolio

Extend Phase 2 project workspaces into completed outcomes:

- Allow owners/participants to mark a project as completed, paused, or archived, with a completion date and optional reflection.
- Create a project outcome/portfolio page with project story, problem solved, inventory reused, missing/new components, build highlights, final images/video links, documented changes from the original plan, challenges, learnings, cost/reuse summary, and impact summary.
- Keep work-in-progress/private projects private by default. Make publishing an explicit, reversible choice.
- Support cover selection, image ordering, alt text, captions, attribution/source notes, upload validation, and strong no-media states.
- Preserve project revision/history details so viewers can distinguish the original generated plan from the actual finished build.

### 3. Community discovery and safe publishing

Build a structured Community / Explore area—not an unbounded social-media clone:

- Allow eligible users to publish completed projects to a discoverable gallery with title, purpose, difficulty, categories/tags, required skills, estimated build time, safety labels, cover image, and reuse/impact summary.
- Provide search, categories, tags, skill level, project type, reuse level, availability/required tools, newest/popular/trending sorting, and pagination or suitable virtualisation.
- Project detail must prioritise useful technical information: what it does, what was reused, requirements, substitutions, build highlights, warnings, outcomes, and source/author credit.
- Provide a “Remix this project” action that creates a private project workspace for the viewer, checks their inventory through the Phase 2 matcher, and clearly identifies substitutions/missing parts. Never modify the source project.
- Let authors update, unpublish, archive, or delete their own community posts; preserve appropriate audit records and handle remixes safely.
- Add low-noise appreciation/bookmark features if useful (for example Save and “Helpful”), but do not introduce addictive ranking mechanics or misleading popularity signals.

### 4. Collaboration and workspace management

Expand the Phase 1 workspace model into practical collaboration:

- Workspace settings: name, description, logo/avatar, type, visibility, and data ownership information.
- Membership and roles: owner, admin, editor/contributor, and viewer. Define and enforce a clear permission matrix server-side.
- Invite by email/token/link only if secure email delivery is already configured; otherwise implement a safe development invite flow and clearly label its limitation. Never expose member data across workspaces.
- Allow project-specific participants with appropriate role constraints.
- Add focused comments/notes on a project or build step, with author, timestamp, edit/delete permissions, simple mentions only if permissions are checked, and accessible thread/reply handling. Avoid real-time presence/chat unless a reliable existing infrastructure supports it.
- Add an activity feed for meaningful actions: inventory additions, scan confirmations, project creation/completion, participant changes, and publication. Offer a concise filter and avoid noisy events.

### 5. Institution / lab insights

Create an organisation-level Insights experience for workspace owners/admins; personal users must not see restricted organisation data.

- Inventory health: total items/quantity, categories, estimated reusable value, condition distribution, unassigned/unknown items, inactive inventory, and high-potential components.
- Reuse activity: components reused over time, reuse rate, projects in progress/completed, common project categories, and outstanding missing-part patterns.
- Impact: aggregate estimated e-waste diverted, cost avoided, reused components, and method/assumption version, segmented by time/category/project where useful.
- Participation: active members, contribution activity, project involvement, and team progress; present carefully and avoid invasive individual performance ranking.
- Provide scoped filters for date range, category, location, project, and member where the viewer’s role allows it.
- Offer simple export of tables/aggregates to CSV and print-friendly/shareable report views. Exports must be authorised, validated, and free of irrelevant private data.
- Include clear empty states and recommendations for how a new lab can improve data quality or start tracking impact.

## Data model and migration requirements

Extend the existing schema with safe migrations and no loss of Phase 1/2 data. Use UUIDs, timestamps, foreign keys, indexes for common queries, audited state transitions, soft archive/deletion where appropriate, and server-side ownership checks.

Add or adapt models for at least:

- `ImpactEvent` / `ImpactLedger`: event type, component/project/workspace linkage, dated quantity, value/weight factors, calculation version, source/provenance, and immutable or auditable recalculation history;
- `ImpactSnapshot` / aggregate cache only if needed for performance, with refresh/invalidation strategy;
- project completion/outcome/reflection, outcome media, project revision or completion snapshot;
- community publication/post state, visibility, moderation status, tags, featured media, counters, and source project snapshot;
- project saves/bookmarks and helpful reactions with uniqueness constraints;
- remix lineage (`sourcePublication` / source project snapshot), derived workspace linkage, attribution, and change history;
- workspace invitations, membership roles, project participants, and invitation expiry/revocation;
- project comments/replies with author, edit/delete markers, optional resolution state, and moderation/audit metadata;
- workspace/project activity events;
- organisation/lab profile and report/export audit records;
- media consent/visibility/attribution metadata, including explicit controls for community publication.

Do not store recalculated dashboard totals as the only record of impact. Preserve enough event-level evidence to explain and reproduce each estimate. Version the impact methodology and document assumptions/constants centrally.

## Domain services and API boundaries

Keep all calculations and permissions out of React presentation components. Build or extend clearly named, tested server-side services:

- `ImpactLedgerService`: produces auditable events from component reuse, project status, and corrections; calculates estimates using versioned assumptions.
- `ImpactAnalyticsService`: aggregates authorised impact/inventory/project data by date and dimension, including data-quality coverage.
- `ProjectCompletionService`: validates final outcome, captures a project snapshot, updates state, and emits activity/impact events idempotently.
- `PublicationService`: prepares safe project snapshots for publishing, validates visibility/media/attribution, manages publish/unpublish, and protects source integrity.
- `RemixService`: copies a public project into a new private workspace project with lineage/credit, then runs existing feasibility matching.
- `WorkspaceAccessService`: centralises role checks, membership/invites, resource scoping, and project participation policy.
- `CollaborationService`: manages comments, activity events, and moderation-friendly audit data.
- `ReportExportService`: creates authorised, rate-limited CSV/print datasets with clear aggregation/filters and no cross-workspace leakage.

Use typed server actions/routes, validation, rate limiting, idempotency for event-producing operations, and consistent error formats. Never rely solely on client-side UI gating for permissions.

## Impact methodology and responsible claims

SECONDLIFE AI’s impact figures are estimates. Implement a documented methodology file/configuration containing factor sources, units, versions, and calculation formulas.

- Distinguish measured user data from inferred estimates.
- Never invent weight, emissions, cost, or component specifications. Mark missing inputs and reduce certainty/coverage accordingly.
- Show data coverage and methodology version with dashboards/reports. Provide a visible disclaimer and an “How we calculate this” view.
- Use plain language such as “estimated e-waste diverted” and “estimated purchase cost avoided.”
- Do not use certificates, equivalencies, claims of offsets, or regulatory/compliance statements unless backed by verified methodology and scope.

## Community safety, privacy, and moderation readiness

- Default source projects, inventory, scans, and personal data to private. Publishing must be explicit, granular, reversible, and authorised by the owner.
- Before publishing, preview exactly what will be visible; strip private notes, workspace-only files, raw uploads, addresses/locations, member data, and sensitive metadata unless the user chooses otherwise and policy permits it.
- Add clear safety and attribution fields to published projects. Let users report a public post/comment and persist reports for future moderation; implement a minimal authorised moderation state/workflow if an admin role exists.
- Validate and sanitise user content, Markdown/rich text, URLs, uploads, image metadata, CSV inputs/exports, and display names. Defend against XSS, CSV formula injection, insecure direct-object references, and upload abuse.
- Enforce media access and all workspace/project/community operations server-side.
- Add privacy-aware account/workspace data deletion/export pathways only if the existing auth/data model can support them safely; otherwise document the extension point, do not fake compliance tooling.

## Seed data, demo mode, and assets

- Expand seeds with realistic personal and lab workspaces, varied member roles, components, completed/in-progress projects, impact events, project outcomes, community publications, remixes, comments, and reportable analytics.
- Ensure demo data exercises high/low data coverage, empty/new workspace, unpublished/private project, published/remixed project, expired invite, restricted viewer, and admin scenarios.
- Use supplied, user-provided, or suitable permitted local/royalty-free project/component imagery. Store source/attribution details. Do not require external paid services for a full demo.
- Ensure seeded analytics are derived from the same ledger/calculation services wherever possible, rather than manually hard-coded dashboard values.

## Accessibility, responsiveness, and performance

- Maintain WCAG 2.1 AA: keyboard-operable filters/dialogs/comments, semantic headings, visible focus, labels, error/live announcements, adequate contrast, alt text, and accessible charts/tables.
- Provide data-table equivalents or accessible summaries for all charts. Tooltips cannot contain essential information only available on hover.
- Make the gallery, feeds, tables, exports, and analytics responsive across desktop, tablet, and mobile.
- Paginate/virtualise large galleries and activity feeds; index filters and use aggregate caching only where needed. Keep cache refresh auditable and correct.
- Provide meaningful loading, empty, error, restricted-access, and offline/unavailable states consistent with the existing UI.

## Testing and verification

Add or update automated tests for:

- impact-event generation, calculation-factor/methodology versioning, corrections, date aggregation, coverage, and score/value boundaries;
- idempotent project completion and impact ledger updates;
- role matrix and server-side authorisation for every workspace/project/member/comment/publication/report/export endpoint;
- publication privacy scrubbing, publish/unpublish, remix attribution/immutability, and saved/reaction uniqueness;
- comment permissions, invite expiry/revocation, and activity scoping;
- CSV export correctness and formula-injection-safe output;
- essential end-to-end flows: complete project → see impact → publish → discover → remix; invite collaborator → work on project → comment; admin views/exports scoped lab insight.

Run and report linting, type checks, schema migrations, seed scripts, unit tests, production build, and an end-to-end smoke suite. Manually verify desktop/tablet/mobile design fidelity, charts/tables, empty/loading/error states, keyboard navigation, reduced motion, restricted-role routes, and a fresh database setup.

## Phase 3 acceptance checklist

Phase 3 is complete only when:

- Phases 1 and 2 continue working, with no visual or behavioural regressions.
- Users receive traceable, clearly labelled personal/workspace impact estimates with date ranges, breakdowns, assumptions, coverage, and actionable next steps.
- Users can complete projects, document outcomes, manage media/attribution, and keep work private or explicitly publish it.
- Community discovery supports useful search/filtering, safe public technical project pages, saving, and inventory-aware remixing with proper attribution.
- Workspaces have server-enforced roles, collaboration participants, focused comments, and meaningful activity records.
- Owners/admins can view scoped, accessible lab/institution insights and generate secure, accurate exports.
- Privacy controls, publication previews, validation, reporting/moderation readiness, and media controls prevent accidental data exposure.
- All additions consistently use the approved UI design system, responsive behaviour, asset direction, polished effects, and accessibility standards.
- Migrations, seed data, documentation, tests, lint/type checks, and production build pass from a clean environment.

## Explicitly defer beyond Phase 3

Do not introduce a marketplace, payments, public direct messaging, open real-time chat, complex gamification, social follow systems, live hardware telemetry, enterprise SSO/provisioning, regulatory certification, or unverified carbon-accounting claims. Leave clear schema/service extension points where appropriate, but do not build placeholder functionality that implies these features already exist.

## Delivery expectations

When finished, provide a concise implementation summary; database migration, seed, run, test, and build commands; relevant environment variables; documented impact-methodology assumptions; any demo limitations; and the remaining out-of-scope items for a future phase.
