<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('show_in_public')->default(true)->after('is_featured');
            $table->boolean('show_in_dashboard')->default(true)->after('show_in_public');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['show_in_public', 'show_in_dashboard']);
        });
    }
};
