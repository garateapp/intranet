<?php

namespace Database\Seeders;

use App\Models\User;
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
        ]);
    }
}
