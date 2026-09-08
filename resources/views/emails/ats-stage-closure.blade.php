<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .field-value { font-size: 14px; color: #111827; }
        .btn { display: inline-block; padding: 12px 24px; margin: 4px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; }
        .btn-primary { background: #4f46e5; color: white; }
        .footer { text-align: center; padding: 16px; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Postulante en etapa de cierre</h2>
        </div>
        <div class="content">
            <p>Un postulante ha llegado a una <strong>etapa de cierre</strong> del proceso de selección.</p>

            <p style="text-align: center; margin: 24px 0;">
                <a href="{{ route('ats.applications.kanban', $application->vacancy_id) }}" class="btn btn-primary">
                    Revisar en el Kanban
                </a>
            </p>

            <div class="field">
                <div class="field-label">Vacante</div>
                <div class="field-value">{{ $application->vacancy?->title ?? '-' }}</div>
            </div>

            <div class="field">
                <div class="field-label">Candidato</div>
                <div class="field-value">{{ $application->candidate?->name ?? '-' }}@if($application->candidate?->email) ({{ $application->candidate->email }})@endif</div>
            </div>

            <div class="field">
                <div class="field-label">Etapa</div>
                <div class="field-value">{{ $application->stage?->name ?? '-' }}</div>
            </div>

            <div class="field">
                <div class="field-label">Fecha</div>
                <div class="field-value">{{ $application->updated_at->format('d/m/Y H:i') }}</div>
            </div>
        </div>
        <div class="footer">
            <p>Este mensaje fue generado automáticamente por la Intranet Garate.</p>
        </div>
    </div>
</body>
</html>