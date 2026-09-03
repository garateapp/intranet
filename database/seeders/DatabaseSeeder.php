<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            SettingsSeeder::class,
            InitialDataSeeder::class,
            UserDirectorySeeder::class,
            FaqSeeder::class,
            CorporateEventSeeder::class,
            OrganizationalUnitSeeder::class,
            Phase2ContentSeeder::class,
            // ATS Module
            RoleAndPermissionSeeder::class,
            PurchaseInvoiceApprovalSeeder::class,
            DefaultStageSeeder::class,
        ]);
    }
}
