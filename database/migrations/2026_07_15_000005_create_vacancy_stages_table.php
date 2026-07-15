<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacancy_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stage_id')->constrained()->cascadeOnDelete();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Cada vacante solo puede tener una vez cada etapa
            $table->unique(['vacancy_id', 'stage_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancy_stages');
    }
};
