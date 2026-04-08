# Intranet Fase 1 Design

## Context

The existing application is a Laravel + Inertia + React intranet with these foundations already in place:

- Authenticated and public entry points rendered by Inertia.
- Existing content management for categories, posts, useful links, and settings.
- Tailwind-based visual system with branded CSS variables and reusable layout/components.
- Current authenticated entry page at `Dashboard` and current public landing page at `Welcome`.

The user explicitly does not want a parallel app or a rewrite. Phase 1 must extend the current intranet naturally, reuse the existing architecture and naming patterns, and raise the product quality of the portal experience.

## Product Goal

Turn the current intranet into a more complete internal portal that helps employees:

- Find information quickly.
- Access important tools quickly.
- Find people.
- Resolve common questions.
- See relevant dates and events.
- Reach the external HR platform clearly without duplicating HR workflows internally.

The portal should feel modern, clean, attractive, and genuinely useful for daily use.

## Scope

Phase 1 includes:

- A stronger home experience.
- Global search.
- A people directory.
- FAQ.
- Corporate calendar.
- Clear access to the external HR platform in Buk.
- Better presentation of quick access shortcuts using the existing links.

Phase 1 also includes maintainable admin CRUD interfaces for all new data domains introduced in this phase.

## Explicit Non-Goals

- Replacing the existing posts, categories, or links modules.
- Rebuilding the app into a separate SPA architecture.
- Duplicating HR workflows such as vacations, permits, receipts, or employee documents inside the intranet.
- Building a complex calendar system similar to Google Calendar.
- Introducing unnecessary UI libraries or major new dependencies.

## Current Architecture Summary

### Backend

- Laravel controllers return Inertia pages directly.
- Existing content modules follow resource-controller patterns.
- Shared auth context is provided through `HandleInertiaRequests`.
- Existing entities include `Post`, `Category`, `Link`, `Setting`, and `User`.

### Frontend

- React pages live under `resources/js/Pages`.
- Shared authenticated navigation and shell live in `AuthenticatedLayout`.
- Tailwind classes and app-wide portal styling live in `resources/css/app.css`.
- Existing pages mix server-driven data with lightweight local state and Inertia navigation.

### Experience Split

- `Welcome` is the public-facing entry point.
- `Dashboard` is the authenticated internal home.

This split should remain, but both pages should share the same visual language and component primitives so the product feels cohesive.

## High-Level Design

### Shared Portal Language

Create a reusable portal presentation layer that both `Welcome` and `Dashboard` can consume.

This shared layer should provide:

- Consistent section shells and content cards.
- A shared search surface style.
- A shared quick-links card language.
- Shared post highlight cards.
- Shared visual treatment for portal panels, spacing, typography, and micro-interactions.

The shared language should be implemented with reusable React components and the existing Tailwind/CSS variable system rather than a redesign from scratch.

### Public vs Authenticated Roles

#### Welcome

`Welcome` remains a public landing page, but should visually align with the internal portal and communicate the value of the intranet.

It should include:

- Strong branded hero.
- A curated, lighter version of the portal highlights.
- Featured news and selected shortcuts.
- Clear sign-in CTA.

It should not expose the full internal navigation or internal-only operational modules.

#### Dashboard

`Dashboard` becomes the true daily home of the intranet.

It should include:

- Welcome block for the logged-in user.
- Prominent global search.
- Quick links built from the existing `links` data.
- Highlighted posts and recent updates.
- Compact upcoming corporate events.
- Clear Buk HR CTA.
- Lightweight directory and FAQ entry points.

This is the page that should feel like the internal portal homepage, not a generic admin dashboard.

## Data Model Changes

Phase 1 requires persistence in the database for all new modules and directory-related user data.

### Users as Directory Source

Do not create a separate `people` table.

Instead, extend the existing `users` table so authenticated users are also the source of truth for the people directory and people search.

The current schema already includes:

- `name`
- `email`
- `role`
- `department`
- `position`
- `avatar`

Add the missing directory-oriented fields needed for Phase 1:

- `phone`
- `location`
- `bio`
- `is_directory_visible`
- `is_directory_featured`

Field expectations:

- `phone`, `location`, and `bio` should be nullable
- `is_directory_visible` should default to `true`
- `is_directory_featured` should default to `false`

Purpose:

- Support the employee directory and people search from the existing user domain.
- Avoid duplicating identity between `users` and a separate people table.
- Allow curated featured employees on the home page.

### FAQ Categories

Create a `faq_categories` table with fields:

- `name`
- `slug`
- `description`
- `icon`
- `color`
- `sort_order`
- `is_active`
- timestamps

Purpose:

- Organize FAQs in a way that is easy to scan and maintain.

### FAQs

Create a `faqs` table with fields:

- `faq_category_id`
- `question`
- `answer`
- `sort_order`
- `is_published`
- timestamps

Purpose:

- Support searchable and categorized FAQs.

### Corporate Events

Create a `corporate_events` table with fields:

- `title`
- `description`
- `event_date`
- `end_date`
- `location`
- `type`
- `color`
- `is_featured`
- `is_published`
- timestamps

Purpose:

- Support home summaries and a dedicated calendar page.

Date handling:

- `event_date` and `end_date` should be stored as datetimes so the schema can support both all-day and time-specific events without another migration

### HR Portal Configuration

No standalone HR data table is required for Phase 1.

Buk access should be managed through existing settings infrastructure, using seeded configuration values such as:

- `hr_portal_url`
- `hr_portal_title`
- `hr_portal_description`

Initial URL value:

- `https://greenex.buk.cl/users/sign_in`

This keeps the access point maintainable without creating duplicate HR functionality.

## Navigation Design

### Authenticated Navigation

Extend `AuthenticatedLayout` to include user-facing portal destinations:

- `Inicio`
- `Buscador`
- `Personas`
- `FAQ`
- `Calendario`
- `RRHH`

Admin-only content management should remain visibly separate and follow the current conditional navigation pattern:

- Posts
- Categories
- Links
- Settings
- Users
- FAQ Categories
- FAQs
- Corporate Events

The navigation should remain consistent with the current layout rather than introducing a full app-shell rewrite in Phase 1.

### Public Navigation

`Welcome` should keep a lighter header with:

- Brand
- Sign-in CTA
- Optional lightweight anchors or secondary CTA

## Route Design

### Public

- `GET /` -> `DashboardController@welcome`
- Existing public post detail route remains unchanged

### Authenticated User-Facing

- `GET /dashboard` -> `DashboardController@index`
- `GET /search` -> `SearchController@index`
- `GET /directory` -> `PeopleDirectoryController@index`
- `GET /faq` -> `FaqPortalController@index`
- `GET /calendar` -> `CorporateCalendarController@index`
- `GET /rrhh` -> `HrPortalController@index`, an internal informational landing page with Buk CTA and supporting help links
- `GET /rrhh/redirect` -> redirect endpoint to the configured Buk URL

### Authenticated Admin

Add resource routes inside the existing admin middleware group:

- admin-oriented user directory management routes built on top of the existing `User` domain
- `Route::resource('faq-categories', FaqCategoryController::class);`
- `Route::resource('faqs', FaqController::class);`
- `Route::resource('corporate-events', CorporateEventController::class);`

This keeps the route style aligned with existing modules while avoiding a duplicate people resource.

## Home Experience Design

### Dashboard Home Modules

The authenticated home should be built from modular sections, ordered by practical value:

1. Hero/welcome strip
2. Global search
3. Quick links
4. Highlighted posts / news
5. Upcoming events
6. HR entry block
7. People preview
8. FAQ preview

### Dashboard Hero

The hero should be compact and useful rather than oversized.

It should include:

- User greeting.
- Date or contextual microcopy.
- Short framing of the portal value.
- One or two immediate actions.

The hero should feel polished but should not push key utility modules below the fold.

### Global Search on Home

The search input should be highly visible and clearly framed as universal search across the portal.

It should feel like the fastest way to use the intranet.

### Quick Links on Home

Existing `links` data should power this section.

Requirements:

- Present links as visually rich shortcut cards, not plain lists.
- Use the existing `icon` field where available.
- Use title and description with clear hierarchy.
- Support visual emphasis for important items through sorting/curation.
- Have strong hover and click affordance.

Quick-link emphasis should be curated directly from existing link data:

- lower `sort_order` values take priority
- the first 4 to 6 active links become the featured shortcuts on home
- the broader links module continues to expose the full active set

The result should make the existing links module feel substantially more valuable without replacing it.

### Posts on Home

Reuse posts already in the system for:

- featured spotlight
- recent updates
- pinned or important content

This should build on existing backend logic instead of redefining the posts domain.

### Events Summary on Home

Show a compact upcoming-events block:

- next 3 to 5 relevant events
- date-first visual hierarchy
- event type or color label if useful

### HR Block on Home

The HR block should clearly state that HR processes happen in Buk, not inside the intranet.

Required elements:

- Strong CTA to Buk
- Short explanatory copy
- Optional supporting links or FAQ references if useful

### People and FAQ Preview

These sections should serve as entry ramps, not full modules:

- Featured people cards or a compact list
- 3 or so frequently accessed FAQ items
- Clear links to view more

## Global Search Design

### Search Experience

Global search should search at least:

- Posts
- Useful links
- People
- FAQs

The first implementation should stay server-driven through Laravel + Inertia.

That means:

- Search term sent as query parameter
- Backend composes grouped results
- Frontend renders organized sections
- The home search bar and the dedicated `/search` page should use the same backend endpoint and grouped response contract

Visibility rules:

- regular user-facing directory and search results should only include users where `is_directory_visible` is `true`
- admin-facing user maintenance can still view and edit users regardless of directory visibility

This keeps the architecture aligned with the current application and avoids premature client complexity.

### Search Result Structure

Results should be grouped by content type with clear labels and counts.

Each group should use content-appropriate cards:

- Post result: title, excerpt, category, date
- Link result: icon, title, description, destination
- Person result: avatar, name, position, department, email
- FAQ result: question, category, answer preview

Initial grouped result limits should be:

- posts: up to 5
- links: up to 6
- people: up to 6
- FAQs: up to 5

Initial ordering should be:

- posts: newest published first
- links: `sort_order` ascending, then title
- people: featured directory users first, then name
- FAQs: category order, then FAQ `sort_order`

### Search States

Must include:

- Empty initial state before searching
- No-results state
- Partial results state
- Loading perception via Inertia navigation state or subtle pending UI

The layout should be ready to scale to more result types later.

## People Directory Design

### Core Experience

Provide a searchable directory that allows filtering by:

- name
- position
- department

Primary presentation should be modern cards rather than a cold enterprise table.

Each card should include:

- avatar/photo
- name
- position
- department
- email
- optionally phone or location

Directory index defaults should be:

- featured visible users first, then alphabetical by name
- 12 people per page
- free-text query plus optional department filtering if needed during implementation

### Detail View

A dedicated person detail view is out of scope for Phase 1.

Phase 1 should focus on a strong searchable directory index with useful contact information directly on the cards. A detail view can be considered in a later phase if real usage justifies it.

### Data Source Strategy

The people directory should read from `users`, not from a separate people table.

Users should be seeded and/or updated with realistic directory data so the portal is populated and demo-ready from Phase 1.

Directory visibility should be controlled through `is_directory_visible`, and home curation should use `is_directory_featured`.

FAQ categories, FAQs, and corporate events should also ship with initial seed data so the Phase 1 portal is demo-ready without manual setup.

## FAQ Design

### Portal FAQ Experience

The FAQ page should support:

- category filtering
- text search
- accordion or expandable answers
- clear scanability

The emphasis is speed of comprehension, not dense documentation formatting.

FAQ page defaults should be:

- published categories ordered by `sort_order`
- published FAQs ordered by category, then `sort_order`
- initial category filter set to all
- pagination only if filtered result sets exceed 20 items

### Content Management

Admins should be able to:

- create FAQ categories
- order categories
- create and order FAQs
- publish/unpublish entries

## Corporate Calendar Design

### User Experience

The calendar should be a simple corporate agenda, not a scheduling product.

The main page should show:

- upcoming events in chronological order
- date prominence
- event metadata such as location or type

Calendar page defaults should be:

- only published events
- nearest upcoming event first
- 12 events per page
- home summary shows the next 4 upcoming events

### Home Summary

Home should surface only a compact preview of upcoming events.

### Content Management

Admins should be able to create and maintain events through a familiar CRUD flow.

## HR Portal Design

### Purpose

The intranet should act as the clear gateway to the external HR platform.

It should explicitly direct users to Buk for:

- vacations
- permissions
- payroll receipts
- employee documents
- HR-related self-service

### UX Requirements

The Buk access point should be:

- visible from home
- easy to recognize in navigation
- supported by short explanatory copy

The route behavior should be explicit:

- `/rrhh` is an internal explainer page within the intranet
- the explainer page contains the primary CTA to Buk and any supporting help content
- `/rrhh/redirect` performs the actual redirect to the configured Buk URL for cases where a direct handoff is needed

The portal must not imply that these HR flows are available locally.

## Admin Maintainability

Phase 1 must be manageable by administrators without code changes.

That requires admin maintenance flows for:

- Users as directory entries
- FAQ Categories
- FAQs
- Corporate Events

These pages should follow the established project style:

- `Index`, `Create`, `Edit`
- Inertia-rendered pages
- simple filtering and listing where needed
- no unnecessary admin framework

For users, this should not replace the authentication model. It should extend admin capabilities to maintain directory-related profile fields and visibility flags.

## Component Strategy

Create reusable components that elevate the portal while staying aligned with the codebase.

Likely reusable components include:

- `PortalSection`
- `PortalHero`
- `GlobalSearchBar`
- `QuickLinksGrid`
- `QuickLinkCard`
- `PostHighlightCard`
- `PeopleCard`
- `FaqAccordion`
- `EventsList`
- `HrPortalCard`

These should live alongside the existing component conventions in `resources/js/Components` and be styled through Tailwind plus the current CSS variable system.

## Visual Direction

The visual goal is:

- modern
- clean
- attractive
- fast to scan
- corporate but fresh
- clearly useful

Design principles:

- strong hierarchy
- generous spacing
- attractive cards
- clear navigation
- focused CTA treatment
- no cold legacy-enterprise feeling

The implementation should evolve the current branded portal look already present in `resources/css/app.css`, not replace it with a disconnected style.

## Testing Expectations

Phase 1 should include backend verification for the new modules.

Minimum coverage should target:

- authenticated access to new user-facing pages
- admin protection on new CRUD routes
- create/update validations for directory-related user fields, FAQ categories, FAQs, and events
- search endpoint behavior for grouped results

Frontend behavior should remain simple enough that manual verification plus backend feature coverage is sufficient for this phase.

## Risks and Boundaries

### Risk: Overbuilding Search

Mitigation:

- Keep first implementation server-driven.
- Structure response format for future expansion.

### Risk: Portal Feels Like Separate Product

Mitigation:

- Reuse layouts, route patterns, controller style, and visual tokens already in the repo.

### Risk: Admin Surface Bloats Phase 1

Mitigation:

- Keep CRUD experiences simple and consistent with existing admin pages.
- Avoid introducing advanced workflows not requested.

### Risk: HR Scope Creep

Mitigation:

- Limit HR implementation to gateway, explanation, and supporting references.

## Delivery Outcome

At the end of Phase 1, the intranet should evolve from a base of categories, posts, and useful links into a more complete internal portal with:

- a stronger home
- a visible global search
- visually compelling shortcuts from existing links
- a usable people directory
- a searchable FAQ
- a simple corporate calendar
- a clear Buk HR gateway

All of this should feel integrated into the current Laravel + React system rather than bolted on.
