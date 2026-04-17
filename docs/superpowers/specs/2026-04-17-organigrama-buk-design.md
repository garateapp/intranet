# Organigrama BUK Design

## Context

The intranet already has two related but distinct capabilities:

- An admin-managed organizational units module backed by `organizational_units`.
- A user-facing `/organigrama` page that currently renders from organizational units and assigned internal users.

The requested behavior changes the source of truth for the visible organigram. Instead of depending on internal users or manual unit assignment, the visible org chart must be generated from a CSV exported from BUK.

The CSV file `Organigrama al 16-04-2026.csv` is treated as a validated and well-structured external source. The business rule is explicit:

- the CSV is the operational source for the organigram
- a new upload fully replaces the currently visible organigram
- the organigram may include people who are not registered as intranet users
- only administrators can upload a new CSV

This means the organigram view must be decoupled from `users` and from the existing organizational unit maintenance flow.

## Product Goal

Allow administrators to upload a BUK CSV and immediately replace the intranet organigram with the structure contained in that file, while keeping the viewing experience simple and reliable for employees.

## Explicit Non-Goals

- Linking organigram people to `users`
- Reassigning or updating internal user accounts based on the CSV
- Reusing `organizational_units` as the source of truth for the visible organigram
- Building bidirectional sync with BUK
- Supporting multiple import formats beyond the agreed BUK CSV contract
- Building advanced history browsing or rollback in the first version

## Source Contract

The BUK CSV is expected to use `;` as delimiter and to include these headers:

- `Nombre Empresa`
- `Rut`
- `Nombre Completo`
- `Cargo`
- `Centro de Costo`
- `Nombre Supervisor`
- `Sexo`

The system should validate that:

- a file was uploaded
- the file is a CSV or text file that can be read as CSV
- the header row matches the expected columns
- the file can be parsed with `;`

Because the file is already considered validated upstream by BUK, the application does not need aggressive repair logic or heuristic cleanup.

## High-Level Design

Introduce a dedicated file-based organigram module for display purposes only.

The flow is:

1. An administrator uploads a BUK CSV from an admin page.
2. The backend validates the file contract and parses all rows.
3. The backend builds a normalized snapshot specifically shaped for rendering.
4. The snapshot is stored as the current organigram.
5. The `/organigrama` page reads only from the current snapshot.

This design intentionally avoids touching `users` and avoids mutating `organizational_units`.

## Data Model

Create a dedicated persistence model for imports.

### `organigram_imports`

Add a new table with fields:

- `id`
- `original_filename`
- `stored_filename`
- `uploaded_by`
- `row_count`
- `snapshot_json`
- `is_current`
- timestamps

Field notes:

- `uploaded_by` references the admin user who performed the upload
- `row_count` stores the number of imported people rows
- `snapshot_json` stores the processed display structure
- `is_current` marks the single import currently used by the public organigram page

This model gives traceability for who uploaded the current organigram without introducing a more complex version-management product.

## Snapshot Shape

The stored snapshot should be precomputed for rendering rather than reconstructed on every request.

Recommended JSON shape:

```json
{
  "generated_at": "2026-04-17T12:00:00Z",
  "source": {
    "filename": "Organigrama al 16-04-2026.csv",
    "row_count": 123
  },
  "companies": [
    {
      "name": "Greenex SpA",
      "slug": "greenex-spa",
      "roots": [
        {
          "person": {
            "key": "greenex-spa::12.463.824-0",
            "name": "Romero Donoso Ivan Alejandro",
            "rut": "12.463.824-0",
            "position": "Gerente",
            "sex": "M",
            "cost_center": "Gerencia General",
            "company": "Greenex SpA",
            "supervisor_name": "Romero Donoso Ivan Alejandro"
          },
          "children": [
            {
              "person": {
                "key": "greenex-spa::14.334.328-6",
                "name": "Yañez Arenas Mario Alonso",
                "rut": "14.334.328-6",
                "position": "Gerente de Administración y Finanzas",
                "sex": "M",
                "cost_center": "Gerencia Administración y Finanzas",
                "company": "Greenex SpA",
                "supervisor_name": "Romero Donoso Ivan Alejandro"
              },
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

Key design choices:

- top-level grouping is by company
- each company contains one or more root people nodes
- hierarchy is built from `Nombre Supervisor`
- identity must use a stable internal key based on company plus RUT, not only full name
- if a person reports to themselves, they become a root node
- if the supervisor is not found in the same company dataset, that person also becomes a root node

This gives a true person-based organigram instead of an area listing.

## Render Strategy

The user-facing `/organigrama` page should stop querying `OrganizationalUnit` and `User` for display data.

Instead:

- load the single import marked `is_current`
- return the parsed `snapshot_json` to Inertia
- render companies as root sections
- render each company root as the top of a person tree
- render each node recursively with its direct reports below it

This structure matches the organigram semantics directly.

## UI and Navigation

### Organigram View

The existing organigram page should be updated to reflect the new source and hierarchy.

Expected behavior:

- if a current snapshot exists, render it
- if no snapshot exists yet, show a clean empty state explaining that the organigram has not been uploaded
- do not show warnings about unassigned internal users because that concept is no longer relevant for this page

Visual hierarchy:

- company section or banner
- one or more root person cards below the company header
- recursive child rows beneath each person node
- connector lines between each supervisor and their direct reports
- person cards with:
  - full name
  - position
  - optional cost center as metadata
  - optional RUT

### Admin Upload

Add an admin-only upload entry point.

Recommended placement:

- a dedicated action in the existing organizational administration area, or
- a dedicated simple admin page such as `admin/organigram`

The first version should include:

- current active file name
- current active upload date
- current imported row count
- file input
- upload button

No extra workflow is needed beyond replacing the active snapshot.

## Route Design

Keep the existing public route:

- `GET /organigrama` -> organigram index

Add admin-only routes:

- `GET /admin/organigram` -> upload page
- `POST /admin/organigram` -> import and replace current snapshot

Naming should follow the existing route naming pattern used elsewhere in the project.

## Backend Responsibilities

### Controller Layer

Introduce a dedicated admin controller for uploads and keep viewing concerns separate from import concerns.

Suggested responsibilities:

- `OrganigramController@index`
  - load current snapshot
  - render organigram page

- `AdminOrganigramController@index`
  - load current import metadata
  - render upload page

- `AdminOrganigramController@store`
  - validate file
  - parse CSV
  - build snapshot
  - persist new import
  - clear previous `is_current`
  - redirect with success message

### Service Layer

Use a dedicated service class to isolate CSV parsing and snapshot construction.

Suggested service responsibilities:

- open uploaded file safely
- read and validate header row
- iterate over records
- normalize key string fields
- build all person nodes first
- connect nodes using supervisor relationships
- detect roots by self-reference or missing supervisor
- build company -> roots -> recursive children structure
- return final snapshot and row count

This keeps controllers thin and makes the transformation testable without HTTP concerns.

## Replacement Semantics

Replacement is authoritative.

When a new CSV is uploaded:

- the current snapshot is fully replaced
- the previously active import is no longer current
- the organigram page reflects only the new upload

There is no partial merge behavior and no attempt to preserve manual edits because manual edits are outside the chosen operating model.

## Error Handling

The first version only needs deterministic validation failures.

Failure scenarios:

- no file uploaded
- unreadable file
- invalid header row
- parsing failure

Behavior on failure:

- do not modify the current active snapshot
- redirect back with an actionable error message

Success response:

- confirm the organigram was updated
- include imported row count
- include uploaded filename if useful

## Security and Authorization

Only administrators can access the upload screen or execute imports.

Regular authenticated users:

- can view `/organigrama`
- cannot access admin upload routes

The upload endpoint must stay behind existing admin middleware patterns already used in the app.

## Relationship to Existing Organizational Units

The existing `organizational_units` module should remain untouched for now unless the business later decides to remove it.

Important boundary:

- `organizational_units` remains an internal admin module with its current behavior
- the visible organigram becomes a separate display system powered by BUK CSV imports

This avoids risky cross-effects in other parts of the intranet.

## Testing Expectations

Minimum automated coverage should verify:

- an admin can upload a valid BUK CSV and create a current snapshot
- a second upload replaces the current snapshot
- a non-admin cannot access upload routes
- invalid headers are rejected
- `/organigrama` renders successfully from the current snapshot
- `/organigrama` shows empty state when no current snapshot exists

Service-level tests should verify:

- header validation
- grouping by company
- root creation for self-managed people
- root creation when supervisor is missing
- recursive parent-child connections
- row counting

## Delivery Outcome

At the end of this work, the intranet will have:

- an admin-only CSV upload flow for BUK organigrams
- a persistent current organigram snapshot
- a public organigram page rendered as a hierarchical person-based chart
- full replacement semantics on every upload

The resulting system matches the operational rule that the BUK CSV is the source of truth for the visible organizational chart and presents it as a true organigram.
