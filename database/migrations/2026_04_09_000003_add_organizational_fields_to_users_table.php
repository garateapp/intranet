<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('organizational_unit_id')->nullable()->after('is_directory_featured')->constrained('organizational_units')->nullOnDelete();
            $table->foreignId('manager_id')->nullable()->after('organizational_unit_id')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['organizational_unit_id']);
            $table->dropForeign(['manager_id']);
            $table->dropColumn(['organizational_unit_id', 'manager_id']);
        });
    }
};
