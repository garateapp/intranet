@php
    $name = $name ?? '';
    $role = $role ?? '';
    $email = $email ?? '';
    $phone = $phone ?? '';
    $website = $website ?? null;
    $instagram = $instagram ?? null;
    $addressLine1 = $addressLine1 ?? null;
    $addressLine2 = $addressLine2 ?? null;
    $logo = $logo ?? secure_asset('img/logo_logo.png');
    $qrSvg = $qrSvg ?? null;
    $qrImg = $qrImg ?? null;
    $qrUrl = $qrUrl ?? null;

    if (!$qrImg && $qrUrl) {
        $qrImg = $qrUrl;
    }

    $addressLines = collect([$addressLine1, $addressLine2])
        ->filter()
        ->map(fn($line) => e($line));
    $addressHtml = $addressLines->implode('<br>');

    $whatsPhone = preg_replace('/\D+/', '', $phone);
    $whatsUrl = $whatsPhone ? 'https://wa.me/' . $whatsPhone : null;

    $iconMail = secure_asset('img/mail.jpg');
    $iconPhone = secure_asset('img/phone.jpg');
    $iconLocation = secure_asset('img/location.jpg');
    $iconInstagram = secure_asset('img/insta_icono1.png');
    $iconWeb = secure_asset('img/web_icono1.png');
@endphp

<table cellpadding="0" cellspacing="0" role="presentation"
    style="width:546px;height:182px;border-collapse:collapse;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.08);font-family:'Cabin', Arial, Helvetica, sans-serif;color:#333333;">
    <tr>
        <td style="padding:24px 28px 0 28px;">
            <table cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                <tr>
                    <td style="text-align:left;width:371px;height:182px;">
                        <img src="{{ $logo }}" alt="Garate" style="max-width:150px;height:auto;">
                        <div style="font-size:20px;font-weight:900;color:#393c3a;text-transform:uppercase;padding-top:10px;">
                            {{ $name }}
                        </div>
                        <div style="font-size:14px;font-weight:100;color:#555555;text-transform:capitalize;margin-top:-5px;">
                            {{ $role }}
                        </div>
                        <div>
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                style="border-collapse:collapse;">
                                <tr>
                                    <td style="width:30%;vertical-align:top;padding-right:12px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0"
                                            style="border-collapse:collapse;">
                                            <tr>
                                                <td style="padding:6px 0;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0"
                                                        style="border-collapse:collapse;" style="width:30%;">
                                                        <tr>
                                                            <td
                                                                style="padding-right:5px;width:18px;vertical-align:top;margin-left:5px;">
                                                                <img src="{{ $iconMail }}" alt="Correo"
                                                                    style="width:22px;height:16px;display:block;">
                                                            </td>
                                                            <td style="font-size:12px;">
                                                                <a href="mailto:{{ $email }}"
                                                                    style="color:#333333;text-decoration:none;">{{ $email }}</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                @if ($addressHtml)
                                                    <td style="">
                                                        <table role="presentation" cellpadding="0" cellspacing="0"
                                                            style="border-collapse:collapse;">
                                                            <tr style="padding-top:5px;">
                                                                <td
                                                                    style="padding-left:8px;padding-right:6px;width:18px;vertical-align:top;padding-top:15px;">
                                                                    <img src="{{ $iconLocation }}" alt="Ubicación"
                                                                        style="width:16px;height:22px;display:block;">
                                                                </td>
                                                                <td style="font-size:12px;color:#555555;padding-top:15px;">
                                                                    {!! $addressHtml !!}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                @endif
                                            </tr>

                                            @if ($phone)
                                                <tr>
                                                    <td style="padding-top:-10px;">
                                                        <table role="presentation" cellpadding="0" cellspacing="0"
                                                            style="border-collapse:collapse;">
                                                            <tr>
                                                                <td
                                                                    style="padding-right:10px;width:18px;vertical-align:top;">
                                                                    <img src="{{ $iconPhone }}" alt="Teléfono"
                                                                        style="width:16px;height:22px;display:block;">
                                                                </td>
                                                                <td style="font-size:12px;">
                                                                    <a href="{{ $whatsUrl ?: 'tel:' . $whatsPhone }}"
                                                                        style="color:#333333;text-decoration:none;">+{{ $phone }}</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                    <td style="width:173px;height:182px;">
                        @if ($qrSvg)
                            <div style="width:150px;height:150px;">
                                {!! $qrSvg !!}
                            </div>
                        @elseif($qrImg)
                            <div style="width:150px;height:150px;">
                                <img src="{{ $qrImg }}" alt="QR de contacto"
                                    style="width:150px;height:150px;display:block;">
                            </div>
                        @else
                            <div
                                style="width:150px;height:150px;margin:0 auto;padding:10px;border:#389542 solid 1px;border-radius:12px">
                                QR no disponible
                            </div>
                        @endif
                        <div>
                            <table style="border-collapse:collapse;float:right;width: 60px;margin-right:25px;">
                                <tr>
                                    @if ($instagram)
                                        <td style="padding:0 6px;">
                                            <a href="{{ $instagram }}" target="_blank"
                                                style="display:inline-block;">
                                                <img src="{{ $iconInstagram }}" alt="Instagram" width="20"
                                                    height="20" style="display:block;">
                                            </a>
                                        </td>
                                    @endif
                                    @if ($website)
                                        <td style="padding:0 6px;">
                                            <a href="{{ $website }}" target="_blank"
                                                style="display:inline-block;">
                                                <img src="{{ $iconWeb }}" alt="Sitio web" width="20"
                                                    height="20" style="display:block;">
                                            </a>
                                        </td>
                                    @endif
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
