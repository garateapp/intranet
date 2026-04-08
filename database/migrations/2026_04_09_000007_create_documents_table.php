<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_type')->nullable(); // pdf, docx, xlsx, etc.
            $table->unsignedBigInteger('file_size')->nullable(); // bytes
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('version')->default('1.0');
            $table->boolean('is_vigant')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['is_published', 'is_vigant']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
