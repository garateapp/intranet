<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('responsibilities')->nullable();
            $table->text('qualifications')->nullable();
            $table->enum('job_type', ['full_time', 'part_time', 'contract'])->default('full_time');
            $table->date('start_date')->nullable();
            $table->decimal('salary', 12, 2)->nullable();
            $table->string('salary_currency', 3)->default('CLP');
            $table->enum('status', ['draft', 'active', 'closed'])->default('draft');
            $table->foreignId('hiring_manager_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
