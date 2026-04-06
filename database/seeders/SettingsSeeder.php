<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General settings
            ['key' => 'site_name', 'value' => 'Intranet GreenEx', 'type' => 'text', 'group' => 'general', 'description' => 'Name of the intranet site'],
            ['key' => 'site_description', 'value' => 'Portal interno de GreenEx', 'type' => 'text', 'group' => 'general', 'description' => 'Description of the intranet'],
            ['key' => 'site_logo', 'value' => '', 'type' => 'text', 'group' => 'general', 'description' => 'Logo URL'],
            ['key' => 'items_per_page', 'value' => '10', 'type' => 'integer', 'group' => 'general', 'description' => 'Default items per page'],

            // Appearance
            ['key' => 'enable_dark_mode', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'description' => 'Enable dark mode toggle'],
            ['key' => 'default_theme', 'value' => 'light', 'type' => 'text', 'group' => 'appearance', 'description' => 'Default theme (light/dark)'],
            ['key' => 'show_welcome_banner', 'value' => 'true', 'type' => 'boolean', 'group' => 'appearance', 'description' => 'Show welcome banner on dashboard'],

            // Features
            ['key' => 'enable_comments', 'value' => 'true', 'type' => 'boolean', 'group' => 'features', 'description' => 'Enable comments on posts'],
            ['key' => 'enable_links', 'value' => 'true', 'type' => 'boolean', 'group' => 'features', 'description' => 'Enable links section'],
            ['key' => 'enable_categories', 'value' => 'true', 'type' => 'boolean', 'group' => 'features', 'description' => 'Enable categories'],

            // SEO
            ['key' => 'seo_title', 'value' => 'Intranet GreenEx - Portal Interno', 'type' => 'text', 'group' => 'seo', 'description' => 'Default SEO title'],
            ['key' => 'seo_description', 'value' => 'Portal interno de GreenEx con noticias, eventos y recursos', 'type' => 'text', 'group' => 'seo', 'description' => 'Default SEO description'],
            ['key' => 'seo_keywords', 'value' => 'intranet, greenex, portal, interno', 'type' => 'text', 'group' => 'seo', 'description' => 'SEO keywords'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
