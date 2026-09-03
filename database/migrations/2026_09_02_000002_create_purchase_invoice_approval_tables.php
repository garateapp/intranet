<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_invoice_objection_reasons', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('sap_owner_users', function (Blueprint $table): void {
            $table->id();
            $table->integer('owner_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained(indexName: 'sap_owner_user_fk')->nullOnDelete();
            $table->boolean('active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('purchase_invoice_approvals', function (Blueprint $table): void {
            $table->id();
            $table->integer('factura_doc_entry')->unique();
            $table->integer('factura_doc_num')->nullable()->index();
            $table->integer('factura_trans_id')->nullable();
            $table->string('factura_folio_pref', 30)->nullable();
            $table->bigInteger('factura_folio_num')->nullable()->index();
            $table->date('factura_fecha')->nullable()->index();
            $table->date('factura_vencimiento')->nullable()->index();
            $table->char('factura_canceled', 1)->default('N')->index();
            $table->string('factura_moneda', 10)->nullable();
            $table->decimal('factura_total', 19, 4)->nullable();
            $table->string('card_code', 50)->nullable()->index();
            $table->string('card_name')->nullable()->index();
            $table->integer('bpl_id')->nullable()->index();
            $table->integer('owner_code')->nullable()->index();
            $table->foreignId('responsible_user_id')->nullable()->constrained('users', indexName: 'pia_responsible_user_fk')->nullOnDelete();
            $table->string('estado_aprobacion', 30)->default('PENDIENTE')->index();
            $table->foreignId('aprobado_por')->nullable()->constrained('users', indexName: 'pia_approved_by_fk')->nullOnDelete();
            $table->timestamp('aprobado_at')->nullable();
            $table->foreignId('objetado_por')->nullable()->constrained('users', indexName: 'pia_objected_by_fk')->nullOnDelete();
            $table->timestamp('objetado_at')->nullable();
            $table->foreignId('motivo_objecion_id')->nullable()->constrained('purchase_invoice_objection_reasons', indexName: 'pia_reason_fk')->nullOnDelete();
            $table->text('comentario_objecion')->nullable();
            $table->foreignId('cerrado_por')->nullable()->constrained('users', indexName: 'pia_closed_by_fk')->nullOnDelete();
            $table->timestamp('cerrado_at')->nullable();
            $table->string('last_batch_id')->nullable()->index();
            $table->timestamp('fecha_primera_sincronizacion');
            $table->timestamp('fecha_ultima_sincronizacion');
            $table->timestamps();
        });

        Schema::create('purchase_invoice_approval_lines', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('purchase_invoice_approval_id')->constrained(indexName: 'pia_lines_approval_fk')->cascadeOnDelete();
            $table->string('clave_origen')->unique();
            $table->string('ruta_relacion', 50);
            $table->integer('owner_code')->nullable()->index();
            $table->integer('oc_doc_entry')->nullable()->index();
            $table->integer('oc_doc_num')->nullable()->index();
            $table->integer('oc_line_num')->nullable();
            $table->char('oc_canceled', 1)->nullable();
            $table->string('oc_status', 10)->nullable();
            $table->date('oc_fecha')->nullable();
            $table->text('oc_comments')->nullable();
            $table->string('item_code', 100)->nullable();
            $table->text('description')->nullable();
            $table->decimal('cantidad_oc', 19, 6)->nullable();
            $table->decimal('total_linea_oc', 19, 4)->nullable();
            $table->string('area', 50)->nullable()->index();
            $table->string('nombre_area')->nullable();
            $table->string('especie', 50)->nullable()->index();
            $table->string('nombre_especie')->nullable();
            $table->integer('entrada_doc_entry')->nullable();
            $table->integer('entrada_doc_num')->nullable();
            $table->integer('entrada_line_num')->nullable();
            $table->date('entrada_fecha')->nullable();
            $table->integer('factura_line_num');
            $table->decimal('cantidad_factura', 19, 6)->nullable();
            $table->decimal('total_linea_factura', 19, 4)->nullable();
            $table->timestamps();
            $table->index(['purchase_invoice_approval_id', 'oc_doc_entry']);
        });

        Schema::create('purchase_invoice_approval_responsibles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('purchase_invoice_approval_id')->constrained(indexName: 'pia_resp_approval_fk')->cascadeOnDelete();
            $table->integer('owner_code');
            $table->foreignId('user_id')->nullable()->constrained(indexName: 'pia_resp_user_fk')->nullOnDelete();
            $table->string('estado', 20)->default('PENDIENTE')->index();
            $table->boolean('active')->default(true)->index();
            $table->timestamp('aprobado_at')->nullable();
            $table->timestamp('objetado_at')->nullable();
            $table->foreignId('motivo_objecion_id')->nullable()->constrained('purchase_invoice_objection_reasons', indexName: 'pia_resp_reason_fk')->nullOnDelete();
            $table->text('comentario_objecion')->nullable();
            $table->timestamps();
            $table->unique(['purchase_invoice_approval_id', 'owner_code'], 'invoice_responsible_owner_unique');
        });

        Schema::create('purchase_invoice_approval_history', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('purchase_invoice_approval_id')->constrained(indexName: 'pia_history_approval_fk')->cascadeOnDelete();
            $table->string('evento', 60)->index();
            $table->string('estado_anterior', 30)->nullable();
            $table->string('estado_nuevo', 30)->nullable();
            $table->foreignId('user_id')->nullable()->constrained(indexName: 'pia_history_user_fk')->nullOnDelete();
            $table->text('comentario')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['purchase_invoice_approval_id', 'created_at'], 'invoice_history_created_index');
        });

        Schema::create('purchase_invoice_reminders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('purchase_invoice_approval_id')->constrained(indexName: 'pia_reminder_approval_fk')->cascadeOnDelete();
            $table->foreignId('purchase_invoice_approval_responsible_id')->constrained(indexName: 'pia_reminder_resp_fk')->cascadeOnDelete();
            $table->unsignedSmallInteger('threshold_hours');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            $table->unique(
                ['purchase_invoice_approval_responsible_id', 'threshold_hours'],
                'invoice_responsible_reminder_unique'
            );
        });

        Schema::create('purchase_invoice_sync_batches', function (Blueprint $table): void {
            $table->id();
            $table->string('batch_id')->index();
            $table->date('fecha_desde');
            $table->date('fecha_hasta');
            $table->unsignedInteger('received')->default(0);
            $table->unsignedInteger('inserted')->default(0);
            $table->unsignedInteger('updated')->default(0);
            $table->unsignedInteger('errors')->default(0);
            $table->json('error_details')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_invoice_sync_batches');
        Schema::dropIfExists('purchase_invoice_reminders');
        Schema::dropIfExists('purchase_invoice_approval_history');
        Schema::dropIfExists('purchase_invoice_approval_responsibles');
        Schema::dropIfExists('purchase_invoice_approval_lines');
        Schema::dropIfExists('purchase_invoice_approvals');
        Schema::dropIfExists('sap_owner_users');
        Schema::dropIfExists('purchase_invoice_objection_reasons');
    }
};
