<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('purchase_invoice_approvals', 'estado_asociacion')) {
            Schema::table('purchase_invoice_approvals', function (Blueprint $table): void {
                $table->string('estado_asociacion', 40)->nullable()->after('responsible_user_id')->index();
                $table->integer('manual_oc_doc_entry')->nullable()->after('estado_asociacion');
                $table->integer('manual_oc_doc_num')->nullable()->after('manual_oc_doc_entry')->index();
                $table->foreignId('manual_responsible_user_id')->nullable()->after('manual_oc_doc_num')
                    ->constrained('users', indexName: 'pia_manual_responsible_fk')->nullOnDelete();
                $table->string('responsible_source', 20)->nullable()->after('manual_responsible_user_id')->index();
                $table->foreignId('assigned_by')->nullable()->after('responsible_source')
                    ->constrained('users', indexName: 'pia_assigned_by_fk')->nullOnDelete();
                $table->timestamp('assigned_at')->nullable()->after('assigned_by');
                $table->text('assignment_comment')->nullable()->after('assigned_at');
                $table->boolean('association_conflict')->default(false)->after('assignment_comment')->index();
                $table->string('preferred_oc_source', 20)->nullable()->after('association_conflict');
            });
        }

        if (! Schema::hasColumn('purchase_invoice_approval_lines', 'acct_code')) {
            Schema::table('purchase_invoice_approval_lines', function (Blueprint $table): void {
                $table->string('acct_code', 100)->nullable()->after('item_code')->index();
                $table->string('format_code', 100)->nullable()->after('acct_code')->index();
                $table->string('acct_name')->nullable()->after('format_code');
            });
        }

        if (! Schema::hasColumn('purchase_invoice_approval_responsibles', 'source')) {
            Schema::table('purchase_invoice_approval_responsibles', function (Blueprint $table): void {
                // MySQL may use the old unique index to support this foreign key.
                $table->index('purchase_invoice_approval_id', 'pia_resp_approval_index');
                $table->dropUnique('invoice_responsible_owner_unique');
                $table->integer('owner_code')->nullable()->change();
                $table->string('source', 20)->default('SAP_OWNER')->after('owner_code')->index();
                $table->unique(
                    ['purchase_invoice_approval_id', 'owner_code', 'source'],
                    'pia_responsible_source_unique'
                );
            });
        }

        DB::table('purchase_invoice_approvals')->orderBy('id')->chunkById(100, function ($approvals): void {
            foreach ($approvals as $approval) {
                $hasSapPurchaseOrder = DB::table('purchase_invoice_approval_lines')
                    ->where('purchase_invoice_approval_id', $approval->id)
                    ->whereNotNull('oc_doc_entry')
                    ->exists();

                DB::table('purchase_invoice_approvals')->where('id', $approval->id)->update([
                    'estado_asociacion' => $hasSapPurchaseOrder ? 'CON_OC_SAP' : 'SIN_OC',
                    'responsible_source' => $approval->responsible_user_id ? 'SAP_OWNER' : null,
                    'estado_aprobacion' => ! $hasSapPurchaseOrder && $approval->estado_aprobacion === 'SIN_RESPONSABLE'
                        ? 'PENDIENTE_ASIGNACION'
                        : $approval->estado_aprobacion,
                ]);
            }
        });
    }

    public function down(): void
    {
        DB::table('purchase_invoice_approval_responsibles')->where('source', 'MANUAL')->delete();

        Schema::table('purchase_invoice_approval_responsibles', function (Blueprint $table): void {
            $table->dropUnique('pia_responsible_source_unique');
            $table->dropIndex(['source']);
            $table->dropColumn('source');
            $table->integer('owner_code')->nullable(false)->change();
            $table->unique(
                ['purchase_invoice_approval_id', 'owner_code'],
                'invoice_responsible_owner_unique'
            );
            $table->dropIndex('pia_resp_approval_index');
        });

        Schema::table('purchase_invoice_approval_lines', function (Blueprint $table): void {
            $table->dropColumn(['acct_code', 'format_code', 'acct_name']);
        });

        Schema::table('purchase_invoice_approvals', function (Blueprint $table): void {
            $table->dropForeign('pia_manual_responsible_fk');
            $table->dropForeign('pia_assigned_by_fk');
            $table->dropColumn([
                'estado_asociacion', 'manual_oc_doc_entry', 'manual_oc_doc_num',
                'manual_responsible_user_id', 'responsible_source', 'assigned_by',
                'assigned_at', 'assignment_comment', 'association_conflict', 'preferred_oc_source',
            ]);
        });
    }
};
