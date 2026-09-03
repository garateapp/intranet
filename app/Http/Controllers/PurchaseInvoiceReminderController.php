<?php

namespace App\Http\Controllers;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceHistoryEvent;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Jobs\SendWeeklyInvoiceSummary;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PurchaseInvoiceReminderController extends Controller
{
    private const DUE_DAYS = 11;

    public function sendReminder(Request $request): RedirectResponse
    {
        $this->authorize('sendReminder', PurchaseInvoiceApproval::class);

        $threshold = today()->addDays(self::DUE_DAYS)->endOfDay();

        $approvals = PurchaseInvoiceApproval::query()
            ->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Pending->value)
            ->where('factura_canceled', '!=', 'Y')
            ->whereNotNull('factura_vencimiento')
            ->where('factura_vencimiento', '<=', $threshold)
            ->with('lines')
            ->get();

        if ($approvals->isEmpty()) {
            return back()->with('info', 'No hay facturas pendientes por aprobar que venzan en los próximos 11 días.');
        }

        // Agrupar por responsable efectivo
        $byUser = [];
        foreach ($approvals as $approval) {
            $effectiveUser = $approval->substitute_user_id
                ?? $approval->manual_responsible_user_id
                ?? $approval->activeResponsibles()->where('estado', PurchaseInvoiceResponsibleStatus::Pending->value)
                    ->whereNotNull('user_id')->first()?->user_id;

            if ($effectiveUser) {
                $byUser[$effectiveUser][] = $approval->id;
            }
        }

        $queued = 0;
        foreach ($byUser as $userId => $invoiceIds) {
            SendWeeklyInvoiceSummary::dispatch($userId, $invoiceIds, true);
            $queued++;
        }

        // Registrar historial en cada factura
        foreach ($approvals as $approval) {
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $approval->id,
                'evento' => PurchaseInvoiceHistoryEvent::ReminderSent->value,
                'user_id' => $request->user()->id,
                'metadata' => [
                    'tipo' => 'RECORDATORIO_MANUAL',
                    'dias_limite' => self::DUE_DAYS,
                    'remitido_por' => $request->user()->id,
                ],
            ]);
        }

        return back()->with('success', "Recordatorio enviado a {$queued} destinatario(s) con el resumen de facturas pendientes.");
    }
}
