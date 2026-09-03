<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseInvoiceApprovalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $invoice = $this->resource;
        $daysToDue = $invoice->factura_vencimiento
            ? $invoice->factura_vencimiento->startOfDay()->diffInDays(today(), false) * -1
            : null;

        return [
            'id' => $invoice->id,
            'folio' => trim(($invoice->factura_folio_pref ? $invoice->factura_folio_pref.'-' : '').$invoice->factura_folio_num),
            'factura_doc_num' => $invoice->factura_doc_num,
            'factura_doc_entry' => $invoice->factura_doc_entry,
            'factura_trans_id' => $invoice->factura_trans_id,
            'provider' => $invoice->card_name,
            'invoice_date' => $invoice->factura_fecha?->format('Y-m-d'),
            'due_date' => $invoice->factura_vencimiento?->format('Y-m-d'),
            'days_to_due' => $daysToDue,
            'currency' => $invoice->factura_moneda,
            'total' => (float) $invoice->factura_total,
            'status' => $invoice->estado_aprobacion->value,
            'association_status' => $invoice->estado_asociacion?->value,
            'responsible_source' => $invoice->responsible_source?->value,
            'manual_purchase_order' => $invoice->manual_oc_doc_num ? [
                'doc_entry' => $invoice->manual_oc_doc_entry,
                'doc_num' => $invoice->manual_oc_doc_num,
            ] : null,
            'manual_responsible' => $invoice->manualResponsibleUser ? [
                'id' => $invoice->manualResponsibleUser->id,
                'name' => $invoice->manualResponsibleUser->name,
                'email' => $invoice->manualResponsibleUser->email,
            ] : null,
            'assigned_by' => $invoice->assignedBy?->name,
            'assigned_at' => $invoice->assigned_at?->toIso8601String(),
            'assignment_comment' => $invoice->assignment_comment,
            'association_conflict' => $invoice->association_conflict,
            'preferred_oc_source' => $invoice->preferred_oc_source,
            'cancelled' => $invoice->factura_canceled === 'Y',
            'received_at' => $invoice->fecha_primera_sincronizacion?->toIso8601String(),
            'age_hours' => (int) $invoice->fecha_primera_sincronizacion?->diffInHours(now()),
            'purchase_orders' => $invoice->lines->pluck('oc_doc_num')->filter()->unique()->values(),
            'areas' => $invoice->lines->pluck('nombre_area')->filter()->unique()->values(),
            'species' => $invoice->lines->pluck('nombre_especie')->filter()->unique()->values(),
            'responsibles' => $invoice->activeResponsibles->map(fn ($responsible): array => [
                'owner_code' => $responsible->owner_code,
                'user_id' => $responsible->user_id,
                'name' => $responsible->user?->name,
                'source' => $responsible->source?->value,
                'status' => $responsible->estado->value,
            ])->values(),
            'objected_by' => $invoice->objectedBy?->name,
            'objection_reason' => $invoice->objectionReason?->name,
            'objection_comment' => $invoice->comentario_objecion,
            'substitute_user' => $invoice->substituteUser ? [
                'id' => $invoice->substituteUser->id,
                'name' => $invoice->substituteUser->name,
                'email' => $invoice->substituteUser->email,
            ] : null,
            'substitute_assigned_by' => $invoice->substituteAssignedBy?->name,
            'substitute_assigned_at' => $invoice->substitute_assigned_at?->toIso8601String(),
            'substitute_comment' => $invoice->substitute_comment,
            'attachments' => $invoice->attachments->map(fn ($attachment): array => [
                'id' => $attachment->id,
                'original_name' => $attachment->original_name,
                'mime_type' => $attachment->mime_type,
                'size' => $attachment->size,
                'uploaded_by' => $attachment->uploader?->name,
                'created_at' => $attachment->created_at?->toIso8601String(),
            ])->values(),
            'lines' => $invoice->lines->map(fn ($line): array => [
                'id' => $line->id,
                'source_key' => $line->clave_origen,
                'route' => $line->ruta_relacion,
                'owner_code' => $line->owner_code,
                'oc_doc_entry' => $line->oc_doc_entry,
                'oc_doc_num' => $line->oc_doc_num,
                'oc_line_num' => $line->oc_line_num,
                'oc_date' => $line->oc_fecha?->format('Y-m-d'),
                'oc_status' => $line->oc_status,
                'oc_cancelled' => $line->oc_canceled === 'Y',
                'oc_comments' => $line->oc_comments,
                'item_code' => $line->item_code,
                'description' => $line->description,
                'account_code' => $line->acct_code,
                'account_format_code' => $line->format_code,
                'account_name' => $line->acct_name,
                'oc_quantity' => $line->cantidad_oc === null ? null : (float) $line->cantidad_oc,
                'invoice_quantity' => $line->cantidad_factura === null ? null : (float) $line->cantidad_factura,
                'oc_total' => $line->total_linea_oc === null ? null : (float) $line->total_linea_oc,
                'invoice_total' => $line->total_linea_factura === null ? null : (float) $line->total_linea_factura,
                'area' => $line->nombre_area,
                'species' => $line->nombre_especie,
                'goods_receipt_number' => $line->entrada_doc_num,
            ])->values(),
            'history' => $invoice->history->map(fn ($history): array => [
                'id' => $history->id,
                'event' => $history->evento,
                'previous_status' => $history->estado_anterior,
                'new_status' => $history->estado_nuevo,
                'user' => $history->user?->name,
                'comment' => $history->comentario,
                'metadata' => $history->metadata,
                'created_at' => $history->created_at?->toIso8601String(),
            ])->values(),
        ];
    }
}
