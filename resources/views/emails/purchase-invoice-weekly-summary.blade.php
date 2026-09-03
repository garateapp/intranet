<!DOCTYPE html>
<html lang="es">
<body style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
    <h2 style="color: #038c34;">
        @if ($isReminder)
            Recordatorio de facturas pendientes
        @else
            Resumen semanal de facturas pendientes por aprobar
        @endif
    </h2>

    <p>Hola {{ $recipient->name }},</p>

    @if (count($invoices) === 0)
        <p>No tienes facturas pendientes de aprobación por vencer en los próximos días.</p>
    @else
        <p>Tienes <strong>{{ count($invoices) }} factura(s)</strong> pendiente(s) que debe(n) aprobarse dentro de los próximos 11 días:</p>
        <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 720px; border: 1px solid #e5e7eb;">
            <thead>
                <tr style="background: #f3f4f6; text-align: left;">
                    <th style="border: 1px solid #e5e7eb;">Folio</th>
                    <th style="border: 1px solid #e5e7eb;">Proveedor</th>
                    <th style="border: 1px solid #e5e7eb;">Monto</th>
                    <th style="border: 1px solid #e5e7eb;">Vencimiento</th>
                    <th style="border: 1px solid #e5e7eb;">Días restantes</th>
                    <th style="border: 1px solid #e5e7eb;">OC</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($invoices as $invoice)
                    <tr>
                        <td style="border: 1px solid #e5e7eb;">
                            <a href="{{ route('purchase-invoice-approvals.show', $invoice['id']) }}">{{ $invoice['folio'] }}</a>
                        </td>
                        <td style="border: 1px solid #e5e7eb;">{{ $invoice['provider'] }}</td>
                        <td style="border: 1px solid #e5e7eb;">{{ $invoice['moneda'] }} {{ number_format($invoice['total'], 0, ',', '.') }}</td>
                        <td style="border: 1px solid #e5e7eb;">{{ $invoice['vencimiento'] ? \Carbon\Carbon::parse($invoice['vencimiento'])->format('d-m-Y') : 'Sin informar' }}</td>
                        <td style="border: 1px solid #e5e7eb;">
                            @if ($invoice['dias_restantes'] === null)
                                Sin informar
                            @elseif ($invoice['dias_restantes'] < 0)
                                <span style="color: #dc2626;">Vencida hace {{ abs($invoice['dias_restantes']) }} día(s)</span>
                            @else
                                {{ $invoice['dias_restantes'] }} día(s)
                            @endif
                        </td>
                        <td style="border: 1px solid #e5e7eb;">{{ $invoice['oc'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <p style="margin-top: 24px;">
        <a href="{{ route('purchase-invoice-approvals.index') }}" style="background: #038c34; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
            Ver facturas en la intranet
        </a>
    </p>
</body>
</html>
