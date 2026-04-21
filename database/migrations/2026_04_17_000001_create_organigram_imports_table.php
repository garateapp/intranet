<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('organigram_imports')) {
            return;
        }

        Schema::create('organigram_imports', function (Blueprint $table) {
            $table->id();
            $table->string('original_filename');
            $table->string('stored_filename')->nullable();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('row_count');
            $table->json('snapshot_json');
            $table->boolean('is_current')->default(false)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organigram_imports');
    }
};
