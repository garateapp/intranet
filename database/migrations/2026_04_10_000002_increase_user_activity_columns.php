<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_activities', function (Blueprint $table) {
            $table->text('url')->change();
            $table->text('user_agent')->change();
            $table->text('metadata')->change();
        });
    }

    public function down(): void
    {
        Schema::table('user_activities', function (Blueprint $table) {
            $table->string('url', 255)->change();
            $table->text('user_agent')->nullable()->change(); // keep as text
            $table->json('metadata')->nullable()->change();
        });
    }
};
