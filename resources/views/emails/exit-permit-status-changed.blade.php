<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header.rejected { background: #dc2626; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .field-value { font-size: 14px; color: #111827; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .badge.approved { background: #dcfce7; color: #166534; }
        .badge.rejected { background: #fee2e2; color: #991b1b; }
        .footer { text-align: center; padding: 16px; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header {{ $exitPermit->status === 'rechazada' ? 'rejected' : '' }}">
            <h2>Permiso de Salida {{ $exitPermit->status === 'aprobada' ? 'Aprobado' : 'Rechazado' }}</h2>
        </div>
        <div class="content">
            <p>
                El permiso de salida de <strong>{{ $exitPermit->user->name }}</strong>
                ha sido <span class="badge {{ $exitPermit->status === 'aprobada' ? 'approved' : 'rejected' }}">
                    {{ $exitPermit->status === 'aprobada' ? 'APROBADO' : 'RECHAZADO' }}
                </span>
                por su jefe directo {{ $exitPermit->manager?->name ?? 'N/A' }}.
            </p>

            <div class="field">
                <div class="field-label">Solicitante</div>
                <div class="field-value">{{ $exitPermit->user->name }}</div>
            </div>

            <div class="field">
                <div class="field-label">Fecha de Salida</div>
                <div class="field-value">{{ $exitPermit->fecha_salida->format('d/m/Y') }} @if($exitPermit->hora_salida) {{ $exitPermit->hora_salida }} @endif</div>
            </div>

            @if($exitPermit->fecha_retorno)
            <div class="field">
                <div class="field-label">Fecha de Retorno</div>
                <div class="field-value">{{ $exitPermit->fecha_retorno->format('d/m/Y') }} @if($exitPermit->hora_retorno) {{ $exitPermit->hora_retorno }} @endif</div>
            </div>
            @endif

            <div class="field">
                <div class="field-label">Motivo</div>
                <div class="field-value">{{ $exitPermit->motivo }}</div>
            </div>

            @if($exitPermit->rejection_reason)
            <div class="field">
                <div class="field-label">Motivo de Rechazo</div>
                <div class="field-value" style="color: #dc2626;">{{ $exitPermit->rejection_reason }}</div>
            </div>
            @endif
        </div>
        <div class="footer">
            <p>Este mensaje fue generado automáticamente por la Intranet Garate.</p>
        </div>
    </div>
</body>
</html>
