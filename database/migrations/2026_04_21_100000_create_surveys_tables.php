<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_anonymous')->default(true);
            $table->boolean('is_published')->default(true);
            $table->timestamp('ends_at');
            $table->timestamps();
        });

        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained()->cascadeOnDelete();
            $table->string('prompt');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('survey_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_question_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->uuid('anonymous_token')->nullable();
            $table->timestamps();

            $table->unique(['survey_id', 'user_id']);
            $table->unique(['survey_id', 'anonymous_token']);
        });

        Schema::create('survey_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_response_id')->constrained()->cascadeOnDelete();
            $table->foreignId('survey_question_id')->constrained()->cascadeOnDelete();
            $table->foreignId('survey_option_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_answers');
        Schema::dropIfExists('survey_responses');
        Schema::dropIfExists('survey_options');
        Schema::dropIfExists('survey_questions');
        Schema::dropIfExists('surveys');
    }
};
