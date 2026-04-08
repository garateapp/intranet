# Intranet Fase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the current Laravel + Inertia + React intranet into a coherent internal portal with a stronger home, global search, people directory on top of `users`, FAQ, calendar, HR gateway, and admin-maintainable content flows.

**Architecture:** Keep the current server-driven Inertia architecture and evolve it with focused Laravel controllers, migrations, seeders, and React page/components. Reuse `users` as the directory source, keep Buk HR external, and build a shared portal presentation layer consumed by both `Welcome` and `Dashboard`.

**Tech Stack:** Laravel 12, PHP 8.2, Inertia.js, React 18, Tailwind CSS, existing app CSS variables, PHPUnit feature tests, Laravel migrations/seeders.

---

## File Structure Map

### Existing files to modify

- `routes/web.php`
- `app/Http/Controllers/DashboardController.php`
- `app/Http/Controllers/ProfileController.php`
- `app/Http/Requests/ProfileUpdateRequest.php`
- `app/Http/Middleware/HandleInertiaRequests.php`
- `app/Models/User.php`
- `app/Models/Setting.php`
- `database/seeders/DatabaseSeeder.php`
- `database/seeders/InitialDataSeeder.php`
- `database/seeders/SettingsSeeder.php`
- `resources/css/app.css`
- `resources/js/Layouts/AuthenticatedLayout.jsx`
- `resources/js/Pages/Welcome.jsx`
- `resources/js/Pages/Dashboard.jsx`
- `resources/js/Pages/Profile/Edit.jsx`
- `resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx`

### New backend files likely needed

- `app/Http/Controllers/SearchController.php`
- `app/Http/Controllers/PeopleDirectoryController.php`
- `app/Http/Controllers/FaqPortalController.php`
- `app/Http/Controllers/CorporateCalendarController.php`
- `app/Http/Controllers/HrPortalController.php`
- `app/Http/Controllers/UserDirectoryAdminController.php`
- `app/Http/Controllers/FaqCategoryController.php`
- `app/Http/Controllers/FaqController.php`
- `app/Http/Controllers/CorporateEventController.php`
- `app/Models/FaqCategory.php`
- `app/Models/Faq.php`
- `app/Models/CorporateEvent.php`
- `database/migrations/2026_04_08_000001_add_directory_fields_to_users_table.php`
- `database/migrations/2026_04_08_000002_create_faq_categories_table.php`
- `database/migrations/2026_04_08_000003_create_faqs_table.php`
- `database/migrations/2026_04_08_000004_create_corporate_events_table.php`
- `database/seeders/FaqSeeder.php`
- `database/seeders/CorporateEventSeeder.php`
- `database/seeders/UserDirectorySeeder.php`

### New frontend files likely needed

- `resources/js/Components/PortalSection.jsx`
- `resources/js/Components/PortalHero.jsx`
- `resources/js/Components/GlobalSearchBar.jsx`
- `resources/js/Components/QuickLinksGrid.jsx`
- `resources/js/Components/QuickLinkCard.jsx`
- `resources/js/Components/PostHighlightCard.jsx`
- `resources/js/Components/PeopleCard.jsx`
- `resources/js/Components/FaqAccordion.jsx`
- `resources/js/Components/EventsList.jsx`
- `resources/js/Components/HrPortalCard.jsx`
- `resources/js/Pages/Search/Index.jsx`
- `resources/js/Pages/Directory/Index.jsx`
- `resources/js/Pages/Faq/Index.jsx`
- `resources/js/Pages/Calendar/Index.jsx`
- `resources/js/Pages/Hr/Index.jsx`
- `resources/js/Pages/Users/Index.jsx`
- `resources/js/Pages/Users/Edit.jsx`
- `resources/js/Pages/FaqCategories/Index.jsx`
- `resources/js/Pages/FaqCategories/Create.jsx`
- `resources/js/Pages/FaqCategories/Edit.jsx`
- `resources/js/Pages/Faqs/Index.jsx`
- `resources/js/Pages/Faqs/Create.jsx`
- `resources/js/Pages/Faqs/Edit.jsx`
- `resources/js/Pages/CorporateEvents/Index.jsx`
- `resources/js/Pages/CorporateEvents/Create.jsx`
- `resources/js/Pages/CorporateEvents/Edit.jsx`

### Test files likely needed

- `tests/Feature/Portal/HomePortalTest.php`
- `tests/Feature/Portal/SearchTest.php`
- `tests/Feature/Portal/DirectoryTest.php`
- `tests/Feature/Portal/FaqPortalTest.php`
- `tests/Feature/Portal/CorporateCalendarTest.php`
- `tests/Feature/Portal/HrPortalTest.php`
- `tests/Feature/Admin/UserDirectoryAdminTest.php`
- `tests/Feature/Admin/FaqCategoryManagementTest.php`
- `tests/Feature/Admin/FaqManagementTest.php`
- `tests/Feature/Admin/CorporateEventManagementTest.php`

### Decomposition Notes

- Keep directory behavior on the existing `User` model instead of introducing a parallel people entity.
- Keep admin maintenance split by domain: users-as-directory, FAQ categories, FAQs, events.
- Keep portal presentation components separate from page-level orchestration so `Welcome` and `Dashboard` can share them.

### Task 1: Extend `users` for the directory domain

**Files:**
- Create: `database/migrations/2026_04_08_000001_add_directory_fields_to_users_table.php`
- Modify: `app/Models/User.php`
- Modify: `database/seeders/InitialDataSeeder.php`
- Create: `database/seeders/UserDirectorySeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`
- Test: `tests/Feature/Portal/DirectoryTest.php`

- [ ] **Step 1: Write the failing test**

```php
public function test_directory_page_only_lists_visible_users(): void
{
    $visible = User::factory()->create([
        'is_directory_visible' => true,
        'department' => 'Operaciones',
        'position' => 'Coordinador',
    ]);

    $hidden = User::factory()->create([
        'is_directory_visible' => false,
    ]);

    $this->actingAs($visible)
        ->get(route('directory.index'))
        ->assertOk()
        ->assertSee($visible->name)
        ->assertDontSee($hidden->name);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/Portal/DirectoryTest.php --filter=only_lists_visible_users`
Expected: FAIL because route, fields, or behavior do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('phone')->nullable()->after('avatar');
    $table->string('location')->nullable()->after('phone');
    $table->text('bio')->nullable()->after('location');
    $table->boolean('is_directory_visible')->default(true)->after('bio');
    $table->boolean('is_directory_featured')->default(false)->after('is_directory_visible');
});
```

```php
protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'department',
    'position',
    'avatar',
    'phone',
    'location',
    'bio',
    'is_directory_visible',
    'is_directory_featured',
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/Portal/DirectoryTest.php --filter=only_lists_visible_users`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add database/migrations/2026_04_08_000001_add_directory_fields_to_users_table.php app/Models/User.php database/seeders/InitialDataSeeder.php database/seeders/UserDirectorySeeder.php database/seeders/DatabaseSeeder.php tests/Feature/Portal/DirectoryTest.php
git commit -m "feat: extend users for employee directory"
```

### Task 2: Add FAQ and corporate event persistence

**Files:**
- Create: `database/migrations/2026_04_08_000002_create_faq_categories_table.php`
- Create: `database/migrations/2026_04_08_000003_create_faqs_table.php`
- Create: `database/migrations/2026_04_08_000004_create_corporate_events_table.php`
- Create: `app/Models/FaqCategory.php`
- Create: `app/Models/Faq.php`
- Create: `app/Models/CorporateEvent.php`
- Create: `database/seeders/FaqSeeder.php`
- Create: `database/seeders/CorporateEventSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`
- Test: `tests/Feature/Portal/FaqPortalTest.php`
- Test: `tests/Feature/Portal/CorporateCalendarTest.php`

- [ ] **Step 1: Write the failing tests**

```php
public function test_faq_page_can_render_published_questions(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('faq.index'))
        ->assertOk();
}

public function test_calendar_page_can_render_published_events(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('calendar.index'))
        ->assertOk();
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php`
Expected: FAIL because routes, tables, and models do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```php
Schema::create('faq_categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->string('icon')->nullable();
    $table->string('color')->nullable();
    $table->unsignedInteger('sort_order')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

```php
Schema::create('faqs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('faq_category_id')->constrained()->cascadeOnDelete();
    $table->string('question');
    $table->longText('answer');
    $table->unsignedInteger('sort_order')->default(0);
    $table->boolean('is_published')->default(true);
    $table->timestamps();
});
```

```php
Schema::create('corporate_events', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description')->nullable();
    $table->dateTime('event_date');
    $table->dateTime('end_date')->nullable();
    $table->string('location')->nullable();
    $table->string('type')->nullable();
    $table->string('color')->nullable();
    $table->boolean('is_featured')->default(false);
    $table->boolean('is_published')->default(true);
    $table->timestamps();
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `php artisan test tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add database/migrations/2026_04_08_000002_create_faq_categories_table.php database/migrations/2026_04_08_000003_create_faqs_table.php database/migrations/2026_04_08_000004_create_corporate_events_table.php app/Models/FaqCategory.php app/Models/Faq.php app/Models/CorporateEvent.php database/seeders/FaqSeeder.php database/seeders/CorporateEventSeeder.php database/seeders/DatabaseSeeder.php tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php
git commit -m "feat: add faq and corporate event data models"
```

### Task 3: Add user-facing portal routes and controllers

**Files:**
- Modify: `routes/web.php`
- Create: `app/Http/Controllers/SearchController.php`
- Create: `app/Http/Controllers/PeopleDirectoryController.php`
- Create: `app/Http/Controllers/FaqPortalController.php`
- Create: `app/Http/Controllers/CorporateCalendarController.php`
- Create: `app/Http/Controllers/HrPortalController.php`
- Modify: `app/Http/Controllers/DashboardController.php`
- Modify: `app/Http/Controllers/SettingController.php`
- Test: `tests/Feature/Portal/HomePortalTest.php`
- Test: `tests/Feature/Portal/SearchTest.php`
- Test: `tests/Feature/Portal/DirectoryTest.php`
- Test: `tests/Feature/Portal/FaqPortalTest.php`
- Test: `tests/Feature/Portal/CorporateCalendarTest.php`
- Test: `tests/Feature/Portal/HrPortalTest.php`

- [ ] **Step 1: Write the failing tests**

```php
public function test_authenticated_user_can_open_all_portal_pages(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('dashboard'))->assertOk();
    $this->actingAs($user)->get(route('search.index'))->assertOk();
    $this->actingAs($user)->get(route('directory.index'))->assertOk();
    $this->actingAs($user)->get(route('faq.index'))->assertOk();
    $this->actingAs($user)->get(route('calendar.index'))->assertOk();
    $this->actingAs($user)->get(route('rrhh.index'))->assertOk();
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test tests/Feature/Portal/HomePortalTest.php tests/Feature/Portal/SearchTest.php tests/Feature/Portal/HrPortalTest.php`
Expected: FAIL because named routes and controllers do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/search', [SearchController::class, 'index'])->name('search.index');
    Route::get('/directory', [PeopleDirectoryController::class, 'index'])->name('directory.index');
    Route::get('/faq', [FaqPortalController::class, 'index'])->name('faq.index');
    Route::get('/calendar', [CorporateCalendarController::class, 'index'])->name('calendar.index');
    Route::get('/rrhh', [HrPortalController::class, 'index'])->name('rrhh.index');
    Route::get('/rrhh/redirect', [HrPortalController::class, 'redirect'])->name('rrhh.redirect');
});
```

```php
return Inertia::render('Hr/Index', [
    'portal' => [
        'title' => Setting::get('hr_portal_title', 'Buk RRHH'),
        'description' => Setting::get('hr_portal_description', 'Vacaciones, permisos, liquidaciones y trámites se gestionan en Buk.'),
        'url' => Setting::get('hr_portal_url', 'https://greenex.buk.cl/users/sign_in'),
        'redirect_url' => route('rrhh.redirect'),
        'help_links' => [
            ['label' => 'Ingresar a Buk', 'href' => route('rrhh.redirect')],
            ['label' => 'FAQ de RRHH', 'href' => route('faq.index', ['category' => 'rrhh'])],
        ],
    ],
]);
```

Server-side query contract to implement in this task:

- `SearchController@index` accepts `q` and returns grouped results keyed as `posts`, `links`, `people`, and `faqs`
- `PeopleDirectoryController@index` accepts `q` and optional `department`, orders featured visible users first then name, and paginates 12 per page
- `FaqPortalController@index` accepts `q` and optional `category`, returns only published FAQs inside active categories, ordered by category `sort_order` then FAQ `sort_order`
- `CorporateCalendarController@index` returns only published future events where `event_date >= now()`, ordered by nearest upcoming `event_date`, paginated 12 per page
- `DashboardController@index` returns the next 4 published future events, featured visible users, featured quick links, and FAQ preview data without duplicating page-sized payloads

- [ ] **Step 4: Run tests to verify they pass**

Run: `php artisan test tests/Feature/Portal/HomePortalTest.php tests/Feature/Portal/SearchTest.php tests/Feature/Portal/DirectoryTest.php tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php tests/Feature/Portal/HrPortalTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add routes/web.php app/Http/Controllers/SearchController.php app/Http/Controllers/PeopleDirectoryController.php app/Http/Controllers/FaqPortalController.php app/Http/Controllers/CorporateCalendarController.php app/Http/Controllers/HrPortalController.php app/Http/Controllers/DashboardController.php app/Http/Controllers/SettingController.php tests/Feature/Portal/HomePortalTest.php tests/Feature/Portal/SearchTest.php tests/Feature/Portal/DirectoryTest.php tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php tests/Feature/Portal/HrPortalTest.php
git commit -m "feat: add portal routes and controllers"
```

### Task 4: Add admin maintenance flows for users, FAQ, and events

**Files:**
- Modify: `routes/web.php`
- Create: `app/Http/Controllers/UserDirectoryAdminController.php`
- Create: `app/Http/Controllers/FaqCategoryController.php`
- Create: `app/Http/Controllers/FaqController.php`
- Create: `app/Http/Controllers/CorporateEventController.php`
- Test: `tests/Feature/Admin/UserDirectoryAdminTest.php`
- Test: `tests/Feature/Admin/FaqCategoryManagementTest.php`
- Test: `tests/Feature/Admin/FaqManagementTest.php`
- Test: `tests/Feature/Admin/CorporateEventManagementTest.php`

- [ ] **Step 1: Write the failing tests**

```php
public function test_admin_can_access_directory_user_management(): void
{
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertOk();
}

public function test_regular_user_cannot_access_directory_user_management(): void
{
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertRedirect(route('dashboard'));
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test tests/Feature/Admin/UserDirectoryAdminTest.php tests/Feature/Admin/FaqCategoryManagementTest.php tests/Feature/Admin/FaqManagementTest.php tests/Feature/Admin/CorporateEventManagementTest.php`
Expected: FAIL because routes/controllers do not exist.

- [ ] **Step 3: Write minimal implementation**

```php
Route::middleware(['admin'])->group(function () {
    Route::resource('users', UserDirectoryAdminController::class)->only(['index', 'edit', 'update']);
    Route::resource('faq-categories', FaqCategoryController::class);
    Route::resource('faqs', FaqController::class);
    Route::resource('corporate-events', CorporateEventController::class);
});
```

```php
public function update(Request $request, User $user)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        'department' => ['nullable', 'string', 'max:255'],
        'position' => ['nullable', 'string', 'max:255'],
        'phone' => ['nullable', 'string', 'max:255'],
        'location' => ['nullable', 'string', 'max:255'],
        'bio' => ['nullable', 'string'],
        'is_directory_visible' => ['boolean'],
        'is_directory_featured' => ['boolean'],
    ]);

    $user->update($validated);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `php artisan test tests/Feature/Admin/UserDirectoryAdminTest.php tests/Feature/Admin/FaqCategoryManagementTest.php tests/Feature/Admin/FaqManagementTest.php tests/Feature/Admin/CorporateEventManagementTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add routes/web.php app/Http/Controllers/UserDirectoryAdminController.php app/Http/Controllers/FaqCategoryController.php app/Http/Controllers/FaqController.php app/Http/Controllers/CorporateEventController.php tests/Feature/Admin/UserDirectoryAdminTest.php tests/Feature/Admin/FaqCategoryManagementTest.php tests/Feature/Admin/FaqManagementTest.php tests/Feature/Admin/CorporateEventManagementTest.php
git commit -m "feat: add admin maintenance for directory faq and events"
```

### Task 5: Extend profile editing and shared auth props for directory fields

**Files:**
- Modify: `app/Http/Requests/ProfileUpdateRequest.php`
- Modify: `app/Http/Controllers/ProfileController.php`
- Modify: `app/Http/Middleware/HandleInertiaRequests.php`
- Modify: `resources/js/Pages/Profile/Edit.jsx`
- Modify: `resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx`
- Test: `tests/Feature/ProfileTest.php`

- [ ] **Step 1: Write the failing test**

```php
public function test_user_can_update_directory_profile_fields(): void
{
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('profile.update'), [
        'name' => 'Ana Torres',
        'email' => 'ana@example.com',
        'department' => 'Finanzas',
        'position' => 'Analista',
        'phone' => '+56 9 1111 2222',
        'location' => 'Santiago',
        'bio' => 'Encargada de reportes y control.',
    ]);

    $response->assertRedirect(route('profile.edit'));
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'department' => 'Finanzas',
        'position' => 'Analista',
        'location' => 'Santiago',
    ]);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/ProfileTest.php --filter=update_directory_profile_fields`
Expected: FAIL because validation currently only accepts `name` and `email`.

- [ ] **Step 3: Write minimal implementation**

```php
return [
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
    'department' => ['nullable', 'string', 'max:255'],
    'position' => ['nullable', 'string', 'max:255'],
    'phone' => ['nullable', 'string', 'max:255'],
    'location' => ['nullable', 'string', 'max:255'],
    'bio' => ['nullable', 'string', 'max:1000'],
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/ProfileTest.php --filter=update_directory_profile_fields`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Http/Requests/ProfileUpdateRequest.php app/Http/Controllers/ProfileController.php app/Http/Middleware/HandleInertiaRequests.php resources/js/Pages/Profile/Edit.jsx resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx tests/Feature/ProfileTest.php
git commit -m "feat: extend profile editing for directory fields"
```

### Task 6: Build shared portal components and authenticated navigation

**Files:**
- Create: `resources/js/Components/PortalSection.jsx`
- Create: `resources/js/Components/PortalHero.jsx`
- Create: `resources/js/Components/GlobalSearchBar.jsx`
- Create: `resources/js/Components/QuickLinksGrid.jsx`
- Create: `resources/js/Components/QuickLinkCard.jsx`
- Create: `resources/js/Components/PostHighlightCard.jsx`
- Create: `resources/js/Components/PeopleCard.jsx`
- Create: `resources/js/Components/FaqAccordion.jsx`
- Create: `resources/js/Components/EventsList.jsx`
- Create: `resources/js/Components/HrPortalCard.jsx`
- Modify: `resources/js/Layouts/AuthenticatedLayout.jsx`
- Modify: `resources/css/app.css`
- Test: manual visual verification plus existing feature routes

- [ ] **Step 1: Write the failing test**

Use route smoke coverage instead of component unit tests.

```php
public function test_portal_navigation_links_render_for_authenticated_users(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertSee(route('search.index'), false)
        ->assertSee(route('directory.index'), false)
        ->assertSee(route('faq.index'), false)
        ->assertSee(route('calendar.index'), false);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/Portal/HomePortalTest.php --filter=navigation_links_render`
Expected: FAIL because nav items and page composition are not present yet.

- [ ] **Step 3: Write minimal implementation**

```jsx
<NavLink href={route('search.index')} active={route().current('search.index')}>
    Buscador
</NavLink>
<NavLink href={route('directory.index')} active={route().current('directory.index')}>
    Personas
</NavLink>
```

```css
.portal-card-accent {
    background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(228,241,226,0.88));
    border: 1px solid color-mix(in srgb, var(--brand-green) 22%, white 78%);
    box-shadow: 0 24px 44px -34px rgba(3, 140, 52, 0.42);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/Portal/HomePortalTest.php --filter=navigation_links_render`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add resources/js/Components/PortalSection.jsx resources/js/Components/PortalHero.jsx resources/js/Components/GlobalSearchBar.jsx resources/js/Components/QuickLinksGrid.jsx resources/js/Components/QuickLinkCard.jsx resources/js/Components/PostHighlightCard.jsx resources/js/Components/PeopleCard.jsx resources/js/Components/FaqAccordion.jsx resources/js/Components/EventsList.jsx resources/js/Components/HrPortalCard.jsx resources/js/Layouts/AuthenticatedLayout.jsx resources/css/app.css tests/Feature/Portal/HomePortalTest.php
git commit -m "feat: add shared portal UI components"
```

### Task 7: Rebuild `Dashboard` and align `Welcome` with the new portal language

**Files:**
- Modify: `app/Http/Controllers/DashboardController.php`
- Modify: `resources/js/Pages/Dashboard.jsx`
- Modify: `resources/js/Pages/Welcome.jsx`
- Reuse: `resources/js/Components/PortalHero.jsx`
- Reuse: `resources/js/Components/GlobalSearchBar.jsx`
- Reuse: `resources/js/Components/QuickLinksGrid.jsx`
- Reuse: `resources/js/Components/PeopleCard.jsx`
- Reuse: `resources/js/Components/EventsList.jsx`
- Reuse: `resources/js/Components/HrPortalCard.jsx`
- Test: `tests/Feature/Portal/HomePortalTest.php`

- [ ] **Step 1: Write the failing test**

```php
public function test_dashboard_includes_portal_modules(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertSee('Buscador')
        ->assertSee('RRHH')
        ->assertSee('Personas')
        ->assertSee('Calendario');
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/Portal/HomePortalTest.php --filter=dashboard_includes_portal_modules`
Expected: FAIL because the current dashboard does not expose the portal sections.

- [ ] **Step 3: Write minimal implementation**

```php
return Inertia::render('Dashboard', [
    'hero' => [...],
    'quickLinks' => $quickLinks,
    'featuredPosts' => $featuredPosts,
    'directoryUsers' => $directoryUsers,
    'faqs' => $faqs,
    'events' => $events,
    'hrPortal' => $hrPortal,
]);
```

```jsx
<GlobalSearchBar action={route('search.index')} />
<QuickLinksGrid links={quickLinks} />
<EventsList events={events} />
<HrPortalCard portal={hrPortal} />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/Portal/HomePortalTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Http/Controllers/DashboardController.php resources/js/Pages/Dashboard.jsx resources/js/Pages/Welcome.jsx tests/Feature/Portal/HomePortalTest.php
git commit -m "feat: turn dashboard into portal home"
```

### Task 8: Implement search, directory, FAQ, calendar, and HR portal pages

**Files:**
- Create: `resources/js/Pages/Search/Index.jsx`
- Create: `resources/js/Pages/Directory/Index.jsx`
- Create: `resources/js/Pages/Faq/Index.jsx`
- Create: `resources/js/Pages/Calendar/Index.jsx`
- Create: `resources/js/Pages/Hr/Index.jsx`
- Reuse: shared portal components
- Test: `tests/Feature/Portal/SearchTest.php`
- Test: `tests/Feature/Portal/DirectoryTest.php`
- Test: `tests/Feature/Portal/FaqPortalTest.php`
- Test: `tests/Feature/Portal/CorporateCalendarTest.php`
- Test: `tests/Feature/Portal/HrPortalTest.php`

- [ ] **Step 1: Write the failing tests**

```php
public function test_search_groups_results_by_type(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('search.index', ['q' => 'portal']))
        ->assertOk()
        ->assertSee('Posts')
        ->assertSee('Links')
        ->assertSee('Personas')
        ->assertSee('FAQs');
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test tests/Feature/Portal/SearchTest.php tests/Feature/Portal/DirectoryTest.php tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php tests/Feature/Portal/HrPortalTest.php`
Expected: FAIL until the Inertia pages render the expected grouped UI.

- [ ] **Step 3: Write minimal implementation**

```jsx
<section>
    <h2>Posts</h2>
    {results.posts.map((post) => (
        <PostHighlightCard key={post.id} post={post} />
    ))}
</section>
```

```jsx
<FaqAccordion items={faqs.data} />
<EventsList events={events.data} />
<a href={portal.redirect_url} className="...">Ir a Buk</a>
```

Page acceptance criteria to satisfy in this task:

- `/search` shows an empty guidance state with no query, grouped results with a query, and a no-results state when all groups are empty
- `/directory` preserves the requested filters in the UI and shows the paginated visible-user dataset from the controller
- `/faq` supports category filtering plus text search against published FAQs only
- `/calendar` renders only future published events in chronological order
- `/rrhh` renders the exact `portal` prop contract from Task 3: `title`, `description`, `url`, `redirect_url`, `help_links`

- [ ] **Step 4: Run tests to verify they pass**

Run: `php artisan test tests/Feature/Portal/SearchTest.php tests/Feature/Portal/DirectoryTest.php tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php tests/Feature/Portal/HrPortalTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add resources/js/Pages/Search/Index.jsx resources/js/Pages/Directory/Index.jsx resources/js/Pages/Faq/Index.jsx resources/js/Pages/Calendar/Index.jsx resources/js/Pages/Hr/Index.jsx tests/Feature/Portal/SearchTest.php tests/Feature/Portal/DirectoryTest.php tests/Feature/Portal/FaqPortalTest.php tests/Feature/Portal/CorporateCalendarTest.php tests/Feature/Portal/HrPortalTest.php
git commit -m "feat: add portal search directory faq calendar and hr pages"
```

### Task 9: Implement admin pages for users, FAQ categories, FAQs, and events

**Files:**
- Create: `resources/js/Pages/Users/Index.jsx`
- Create: `resources/js/Pages/Users/Edit.jsx`
- Create: `resources/js/Pages/FaqCategories/Index.jsx`
- Create: `resources/js/Pages/FaqCategories/Create.jsx`
- Create: `resources/js/Pages/FaqCategories/Edit.jsx`
- Create: `resources/js/Pages/Faqs/Index.jsx`
- Create: `resources/js/Pages/Faqs/Create.jsx`
- Create: `resources/js/Pages/Faqs/Edit.jsx`
- Create: `resources/js/Pages/CorporateEvents/Index.jsx`
- Create: `resources/js/Pages/CorporateEvents/Create.jsx`
- Create: `resources/js/Pages/CorporateEvents/Edit.jsx`
- Modify: `resources/js/Layouts/AuthenticatedLayout.jsx`
- Test: `tests/Feature/Admin/UserDirectoryAdminTest.php`
- Test: `tests/Feature/Admin/FaqCategoryManagementTest.php`
- Test: `tests/Feature/Admin/FaqManagementTest.php`
- Test: `tests/Feature/Admin/CorporateEventManagementTest.php`

- [ ] **Step 1: Write the failing test**

```php
public function test_admin_can_update_directory_visibility_for_user(): void
{
    $admin = User::factory()->create(['role' => 'admin']);
    $target = User::factory()->create(['is_directory_visible' => true]);

    $this->actingAs($admin)
        ->put(route('users.update', $target), [
            'name' => $target->name,
            'email' => $target->email,
            'department' => $target->department,
            'position' => $target->position,
            'is_directory_visible' => false,
            'is_directory_featured' => false,
        ])
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'id' => $target->id,
        'is_directory_visible' => false,
    ]);
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test tests/Feature/Admin/UserDirectoryAdminTest.php`
Expected: FAIL because page/controller workflow and forms are incomplete.

- [ ] **Step 3: Write minimal implementation**

```jsx
<input
    type="checkbox"
    checked={data.is_directory_visible}
    onChange={(e) => setData('is_directory_visible', e.target.checked)}
/>
```

```jsx
<NavLink href={route('users.index')} active={route().current('users.*')}>
    Users
</NavLink>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `php artisan test tests/Feature/Admin/UserDirectoryAdminTest.php tests/Feature/Admin/FaqCategoryManagementTest.php tests/Feature/Admin/FaqManagementTest.php tests/Feature/Admin/CorporateEventManagementTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add resources/js/Pages/Users/Index.jsx resources/js/Pages/Users/Edit.jsx resources/js/Pages/FaqCategories/Index.jsx resources/js/Pages/FaqCategories/Create.jsx resources/js/Pages/FaqCategories/Edit.jsx resources/js/Pages/Faqs/Index.jsx resources/js/Pages/Faqs/Create.jsx resources/js/Pages/Faqs/Edit.jsx resources/js/Pages/CorporateEvents/Index.jsx resources/js/Pages/CorporateEvents/Create.jsx resources/js/Pages/CorporateEvents/Edit.jsx resources/js/Layouts/AuthenticatedLayout.jsx tests/Feature/Admin/UserDirectoryAdminTest.php tests/Feature/Admin/FaqCategoryManagementTest.php tests/Feature/Admin/FaqManagementTest.php tests/Feature/Admin/CorporateEventManagementTest.php
git commit -m "feat: add admin portal management pages"
```

### Task 10: Final integration, settings wiring, and verification

**Files:**
- Modify: `database/seeders/SettingsSeeder.php`
- Modify: `resources/js/Pages/Dashboard.jsx`
- Modify: `resources/js/Pages/Hr/Index.jsx`
- Test: `tests/Feature/Portal/HrPortalTest.php`
- Test: `tests/Feature/Portal/HomePortalTest.php`

- [ ] **Step 1: Write the failing test**

```php
public function test_hr_redirect_uses_configured_setting(): void
{
    $user = User::factory()->create();
    Setting::set('hr_portal_url', 'https://greenex.buk.cl/users/sign_in');

    $this->actingAs($user)
        ->get(route('rrhh.redirect'))
        ->assertRedirect('https://greenex.buk.cl/users/sign_in');
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test tests/Feature/Portal/HrPortalTest.php --filter=configured_setting`
Expected: FAIL if `Setting` lookup helper and redirect behavior are not fully wired.

- [ ] **Step 3: Write minimal implementation**

```php
Setting::set('hr_portal_title', 'Buk RRHH');
Setting::set('hr_portal_description', 'Vacaciones, permisos, liquidaciones y trámites se gestionan en Buk.');
Setting::set('hr_portal_url', 'https://greenex.buk.cl/users/sign_in');
```

- [ ] **Step 4: Add grouped search acceptance criteria before full verification**

Confirm the implementation meets these conditions:

- queryless `/search` shows an empty guidance state instead of fake results
- unmatched queries show a no-results state
- matched queries keep result ordering defined in the spec
- only published FAQs and published events appear in user-facing results
- only `is_directory_visible = true` users appear in user-facing search and directory views

- [ ] **Step 5: Run full verification**

Run: `php artisan test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add database/seeders/SettingsSeeder.php resources/js/Pages/Dashboard.jsx resources/js/Pages/Hr/Index.jsx tests/Feature/Portal/HrPortalTest.php tests/Feature/Portal/HomePortalTest.php
git commit -m "feat: finalize portal integration and settings wiring"
```

## Manual QA Checklist

- [ ] Visit `/` logged out and confirm `Welcome` feels aligned with the internal portal but remains lighter than the authenticated home.
- [ ] Visit `/dashboard` logged in as a regular user and confirm search, quick links, news, events, FAQ preview, people preview, and HR CTA all render.
- [ ] Confirm quick links are ordered by `sort_order` and the featured home set is visually emphasized.
- [ ] Confirm `/search?q=...` groups results into Posts, Links, Personas, and FAQs.
- [ ] Confirm `/directory` hides users where `is_directory_visible` is false.
- [ ] Confirm `/faq` filters and expands answers cleanly.
- [ ] Confirm `/calendar` shows upcoming published events only.
- [ ] Confirm `/rrhh` explains Buk ownership clearly and `/rrhh/redirect` sends the user to Buk.
- [ ] Log in as admin and confirm user directory fields, FAQ categories, FAQs, and events are editable.
- [ ] Confirm profile editing updates user directory data without exposing admin-only flags.

## Suggested Execution Order

1. Task 1
2. Task 2
3. Task 3
4. Task 4
5. Task 5
6. Task 6
7. Task 7
8. Task 8
9. Task 9
10. Task 10
