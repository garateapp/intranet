<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .field-value { font-size: 14px; color: #111827; }
        .footer { text-align: center; padding: 16px; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Nueva Solicitud de Permiso de Salida</h2>
        </div>
        <div class="content">
            <p>Se ha registrado una nueva solicitud de permiso de salida.</p>

            <div class="field">
                <div class="field-label">Solicitante</div>
                <div class="field-value">{{ $exitPermit->user->name }}</div>
            </div>

            @if($exitPermit->manager)
            <div class="field">
                <div class="field-label">Jefe Directo</div>
                <div class="field-value">{{ $exitPermit->manager->name }}</div>
            </div>
            @endif

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

            @if($exitPermit->observaciones)
            <div class="field">
                <div class="field-label">Observaciones</div>
                <div class="field-value">{{ $exitPermit->observaciones }}</div>
            </div>
            @endif
        </div>
        <div class="footer">
            <p>Este mensaje fue generado automáticamente por la Intranet Garate.</p>
        </div>
    </div>
</body>
</html>
