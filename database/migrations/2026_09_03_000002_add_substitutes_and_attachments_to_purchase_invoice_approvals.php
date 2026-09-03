<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_invoice_approvals', function (Blueprint $table): void {
            $table->foreignId('substitute_user_id')->nullable()->after('manual_responsible_user_id')
                ->constrained('users', indexName: 'pia_substitute_user_fk')->nullOnDelete();
            $table->foreignId('substitute_assigned_by')->nullable()->after('substitute_user_id')
                ->constrained('users', indexName: 'pia_substitute_by_fk')->nullOnDelete();
            $table->timestamp('substitute_assigned_at')->nullable()->after('substitute_assigned_by');
            $table->text('substitute_comment')->nullable()->after('substitute_assigned_at');
        });

        Schema::create('purchase_invoice_approval_attachments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('purchase_invoice_approval_id')->constrained(indexName: 'pia_file_approval_fk')->cascadeOnDelete();
            $table->foreignId('purchase_invoice_approval_responsible_id')->nullable()
                ->constrained(indexName: 'pia_file_responsible_fk')->nullOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users', indexName: 'pia_file_user_fk')->nullOnDelete();
            $table->string('disk', 40)->default('local');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 150)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->timestamps();
            $table->index(['purchase_invoice_approval_id', 'created_at'], 'pia_file_approval_created_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_invoice_approval_attachments');

        Schema::table('purchase_invoice_approvals', function (Blueprint $table): void {
            $table->dropForeign('pia_substitute_user_fk');
            $table->dropForeign('pia_substitute_by_fk');
            $table->dropColumn([
                'substitute_user_id', 'substitute_assigned_by',
                'substitute_assigned_at', 'substitute_comment',
            ]);
        });
    }
};
