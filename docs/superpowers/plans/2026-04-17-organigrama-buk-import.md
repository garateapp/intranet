# Organigrama BUK Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the visible intranet organigram with a BUK CSV-driven snapshot that admins can upload and fully replace.

**Architecture:** Add a dedicated `organigram_imports` persistence model plus a CSV parsing service that builds a render-ready snapshot. Keep the admin upload flow isolated from `organizational_units`, and update `/organigrama` to read only from the current snapshot.

**Tech Stack:** Laravel 12, Inertia, React, PHPUnit, Tailwind

---

### Task 1: Persistence and parser foundation

**Files:**
- Create: `database/migrations/2026_04_17_000001_create_organigram_imports_table.php`
- Create: `app/Models/OrganigramImport.php`
- Create: `app/Services/OrganigramCsvImporter.php`
- Test: `tests/Unit/OrganigramCsvImporterTest.php`

- [ ] **Step 1: Write the failing parser tests**

```php
public function test_it_builds_snapshot_grouped_by_company_cost_center_and_supervisor(): void
{
    $importer = new OrganigramCsvImporter();

    $snapshot = $importer->importFromString($this->validCsv());

    $this->assertSame(3, $snapshot['source']['row_count']);
    $this->assertCount(2, $snapshot['companies']);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Unit/OrganigramCsvImporterTest.php`
Expected: FAIL because importer class does not exist yet

- [ ] **Step 3: Write minimal migration, model, and parser implementation**

Implement:
- `organigram_imports` table
- `OrganigramImport` model with casts and uploader relation
- `OrganigramCsvImporter` service with header validation and snapshot building

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Unit/OrganigramCsvImporterTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add database/migrations/2026_04_17_000001_create_organigram_imports_table.php app/Models/OrganigramImport.php app/Services/OrganigramCsvImporter.php tests/Unit/OrganigramCsvImporterTest.php
git commit -m "feat: add organigram import persistence and parser"
```

### Task 2: Admin upload flow

**Files:**
- Create: `app/Http/Controllers/AdminOrganigramController.php`
- Create: `resources/js/Pages/AdminOrganigram/Index.jsx`
- Modify: `routes/web.php`
- Modify: `resources/js/Layouts/AuthenticatedLayout.jsx`
- Test: `tests/Feature/Admin/OrganigramImportManagementTest.php`

- [ ] **Step 1: Write the failing admin feature tests**

```php
public function test_admin_can_upload_csv_and_replace_current_snapshot(): void
{
    Storage::fake('local');

    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.organigram.store'), [
        'file' => UploadedFile::fake()->createWithContent('organigrama.csv', $this->validCsv()),
    ]);

    $response->assertRedirect(route('admin.organigram.index'));
    $this->assertDatabaseHas('organigram_imports', ['is_current' => true, 'row_count' => 3]);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/Admin/OrganigramImportManagementTest.php`
Expected: FAIL because routes/controller/page do not exist yet

- [ ] **Step 3: Write minimal admin implementation**

Implement:
- admin routes
- upload page
- file validation and storage
- import transaction that clears previous `is_current`
- navigation entry for admins

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/Admin/OrganigramImportManagementTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Http/Controllers/AdminOrganigramController.php resources/js/Pages/AdminOrganigram/Index.jsx routes/web.php resources/js/Layouts/AuthenticatedLayout.jsx tests/Feature/Admin/OrganigramImportManagementTest.php
git commit -m "feat: add admin buk organigram upload flow"
```

### Task 3: Public organigram rendering from snapshot

**Files:**
- Modify: `app/Http/Controllers/OrganigramController.php`
- Modify: `resources/js/Pages/Organigram/Index.jsx`
- Test: `tests/Feature/Portal/OrganigramPageTest.php`

- [ ] **Step 1: Write the failing portal tests**

```php
public function test_organigram_page_renders_from_current_snapshot(): void
{
    $user = User::factory()->create();
    OrganigramImport::factoryOrCreateCurrentLike(...);

    $this->actingAs($user)
        ->get(route('organigram.index'))
        ->assertOk()
        ->assertSee('Greenex SpA')
        ->assertSee('Contabilidad, Tesorería y Gestión');
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/Portal/OrganigramPageTest.php`
Expected: FAIL because controller/page still use organizational units

- [ ] **Step 3: Write minimal public rendering changes**

Implement:
- current snapshot lookup in controller
- clean empty state if there is no current import
- updated React page that renders companies, cost centers, supervisors, and people from snapshot data

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/Portal/OrganigramPageTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Http/Controllers/OrganigramController.php resources/js/Pages/Organigram/Index.jsx tests/Feature/Portal/OrganigramPageTest.php
git commit -m "feat: render organigram from buk snapshot"
```

### Task 4: Full verification

**Files:**
- Modify: any touched files as needed for fixes

- [ ] **Step 1: Run focused test suite**

Run: `php artisan test tests/Unit/OrganigramCsvImporterTest.php tests/Feature/Admin/OrganigramImportManagementTest.php tests/Feature/Portal/OrganigramPageTest.php`
Expected: PASS

- [ ] **Step 2: Run broader app verification**

Run: `php artisan test`
Expected: PASS

- [ ] **Step 3: Run frontend build verification**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit final fixes if needed**

```bash
git add .
git commit -m "chore: verify organigram buk import feature"
```
