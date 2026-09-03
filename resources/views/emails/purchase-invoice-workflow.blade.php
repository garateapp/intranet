<!DOCTYPE html>
<html lang="es">
<body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
    <h2 style="color: #038c34;">
        @if ($type === \App\Jobs\SendPurchaseInvoiceWorkflowEmail::TYPE_OBJECTED)
            Factura objetada
        @elseif ($type === \App\Jobs\SendPurchaseInvoiceWorkflowEmail::TYPE_REMINDER)
            Recordatorio de aprobación pendiente
        @else
            Nueva factura pendiente de aprobación
        @endif
    </h2>

    <p>Hola {{ $recipient->name }},</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 680px;">
        <tr><td><strong>Proveedor</strong></td><td>{{ $approval->card_name }} ({{ $approval->card_code }})</td></tr>
        <tr><td><strong>Folio</strong></td><td>{{ $approval->factura_folio_pref }}-{{ $approval->factura_folio_num }}</td></tr>
        <tr><td><strong>Fecha factura</strong></td><td>{{ $approval->factura_fecha?->format('d-m-Y') }}</td></tr>
        <tr><td><strong>Vencimiento</strong></td><td>{{ $approval->factura_vencimiento?->format('d-m-Y') ?: 'Sin informar' }}</td></tr>
        <tr><td><strong>Monto</strong></td><td>{{ $approval->factura_moneda }} {{ number_format((float) $approval->factura_total, 0, ',', '.') }}</td></tr>
        <tr><td><strong>OC asociadas</strong></td><td>{{ $approval->lines->pluck('oc_doc_num')->filter()->unique()->implode(', ') ?: ($approval->manual_oc_doc_num ? $approval->manual_oc_doc_num.' (manual)' : 'SIN OC ASOCIADA') }}</td></tr>
        <tr><td><strong>Responsables</strong></td><td>{{ $approval->activeResponsibles->pluck('user.name')->filter()->implode(', ') ?: 'Sin homologar' }}</td></tr>
        <tr><td><strong>Descripción</strong></td><td>{{ $approval->lines->pluck('description')->filter()->unique()->implode(' · ') ?: 'Sin informar' }}</td></tr>
        <tr><td><strong>Cuenta contable</strong></td><td>{{ $approval->lines->map(fn ($line) => trim(($line->format_code ?: $line->acct_code).' '.$line->acct_name))->filter()->unique()->implode(' · ') ?: 'Sin informar' }}</td></tr>
        <tr><td><strong>Área</strong></td><td>{{ $approval->lines->pluck('nombre_area')->filter()->unique()->implode(', ') }}</td></tr>
        <tr><td><strong>Especie</strong></td><td>{{ $approval->lines->pluck('nombre_especie')->filter()->unique()->implode(', ') }}</td></tr>
        @if ($type === \App\Jobs\SendPurchaseInvoiceWorkflowEmail::TYPE_OBJECTED)
            <tr><td><strong>Motivo</strong></td><td>{{ $approval->objectionReason?->name }}</td></tr>
            <tr><td><strong>Comentario</strong></td><td>{{ $approval->comentario_objecion }}</td></tr>
            <tr><td><strong>Objetó</strong></td><td>{{ $approval->objectedBy?->name }} · {{ $approval->objetado_at?->format('d-m-Y H:i') }}</td></tr>
        @endif
    </table>

    <p style="margin-top: 24px;">
        <a href="{{ route('purchase-invoice-approvals.show', $approval) }}" style="background: #038c34; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
            Ver factura en la intranet
        </a>
    </p>
</body>
</html>
