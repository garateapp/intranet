<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use chillerlan\QRCode\Common\EccLevel;

class FirmaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $defaults = [
            'name'  => $user->name ?? '',
            'email' => $user->email ?? '',
            'phone' => old('phone', $user->phone ?? ''),
            'role'  => old('role', $user->position ?? ''),
        ];

        return inertia('Firma/Index', [
            'defaults'  => $defaults,
            'signature' => null,
        ]);
    }

    public function generate(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:50'],
            'role'  => ['required', 'string', 'max:120'],
        ]);

        $name  = $user->name ?? '';
        $email = $user->email ?? '';
        $phone = $validated['phone'];
        $role  = $validated['role'];

        $signature = [
            'name'         => $name,
            'email'        => $email,
            'phone'        => $phone,
            'role'         => $role,
            'website'      => 'https://www.garatehermanos.cl',
            'instagram'    => 'https://www.instagram.com/garatehermanos/',
            'addressLine1' => "Av. O'Higgins 798,",
            'addressLine2' => 'Codegua, Región del Libertador Bernardo O\'higgins',
        ];

        $vcard = $this->buildVcard(
            $signature['name'],
            $signature['email'],
            $signature['phone'],
            $signature['role'],
            $signature['addressLine1'],
            $signature['addressLine2'],
            $signature['website']
        );

        $qrPngOptions = new QROptions([
            'outputInterface' => \chillerlan\QRCode\Output\QRGdImagePNG::class,
            'eccLevel'        => EccLevel::H,
            'scale'           => 16,
            'addQuietzone'    => true,
            'imageTransparent' => false,
            'outputBase64'    => false,
            'bgColor'         => [255, 255, 255],
            'fgColor'         => [0, 0, 0],
            'addLogoSpace'    => true,
            'logoSpaceWidth'  => 9,
            'logoSpaceHeight' => 9,
        ]);

        $qrImage = (new QRCode($qrPngOptions))->render($vcard);

        $qrWithLogo = $this->overlayLogo($qrImage, public_path('img/logo-garate.png'));

        $filename = sprintf('firmas/firma-qr-%s-%s.png', $user->id, str_replace(' ', '-', $name));
        Storage::disk('public')->put($filename, $qrWithLogo);

        $publicDirectory = public_path('firmas');
        if (!File::isDirectory($publicDirectory)) {
            File::makeDirectory($publicDirectory, 0755, true);
        }

        $publicPath = $publicDirectory . DIRECTORY_SEPARATOR . basename($filename);
        File::put($publicPath, $qrWithLogo);

        $publicUrl = asset('firmas/' . basename($filename));

        $signature['qrSvg'] = null;
        $signature['qrImg']  = $publicUrl;
        $signature['qrUrl']  = $publicUrl;

        $renderedHtml = view('firma.business-card', $signature)->render();

        $defaults = [
            'name'  => $signature['name'],
            'email' => $signature['email'],
            'phone' => $phone,
            'role'  => $role,
        ];

        return inertia('Firma/Index', [
            'defaults'  => $defaults,
            'signature' => $signature,
            'html'      => $renderedHtml,
        ]);
    }

    private function overlayLogo(string $qrPngData, string $logoPath): string
    {
        $qrImage = imagecreatefromstring($qrPngData);
        if (!$qrImage) {
            return $qrPngData;
        }

        $logoImage = @imagecreatefrompng($logoPath);
        if (!$logoImage) {
            imagedestroy($qrImage);
            return $qrPngData;
        }

        $qrWidth  = imagesx($qrImage);
        $qrHeight = imagesy($qrImage);

        $logoSize = (int) ($qrWidth * 0.22);
        $logoX    = (int) (($qrWidth - $logoSize) / 2);
        $logoY    = (int) (($qrHeight - $logoSize) / 2);

        $resized = imagecreatetruecolor($logoSize, $logoSize);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled(
            $resized, $logoImage,
            0, 0, 0, 0,
            $logoSize, $logoSize,
            imagesx($logoImage), imagesy($logoImage)
        );

        $bg = imagecolorallocate($qrImage, 255, 255, 255);
        imagefilledrectangle(
            $qrImage,
            $logoX - 4, $logoY - 4,
            $logoX + $logoSize + 4, $logoY + $logoSize + 4,
            $bg
        );

        imagecopy($qrImage, $resized, $logoX, $logoY, 0, 0, $logoSize, $logoSize);

        ob_start();
        imagepng($qrImage);
        $pngData = ob_get_clean();

        imagedestroy($qrImage);
        imagedestroy($logoImage);
        imagedestroy($resized);

        return $pngData;
    }

    private function buildVcard(
        string $name,
        string $email,
        string $phone,
        string $role,
        ?string $addressLine1,
        ?string $addressLine2,
        ?string $website
    ): string {
        $fullAddress = trim(collect([$addressLine1, $addressLine2])->filter()->implode(' '));

        [$lastName, $firstName] = $this->splitName($name);

        $vcardLines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'N:' . $this->escapeVcardValue($lastName) . ';' . $this->escapeVcardValue($firstName) . ';;;',
            'FN:' . $this->escapeVcardValue($name),
        ];

        if ($email !== '') {
            $vcardLines[] = 'EMAIL;TYPE=INTERNET:' . $this->escapeVcardValue($email);
        }

        if ($role !== '') {
            $vcardLines[] = 'TITLE:' . $this->escapeVcardValue($role);
        }

        if ($formattedPhone = $this->formatPhone($phone)) {
            $vcardLines[] = 'TEL;TYPE=CELL,VOICE:' . $this->escapeVcardValue($formattedPhone);
        }

        if ($fullAddress !== '') {
            $vcardLines[] = 'ADR;TYPE=WORK:;;' . $this->escapeVcardValue($fullAddress) . ';;;;';
        }

        if ($website) {
            $vcardLines[] = 'URL:' . $this->escapeVcardValue($website);
        }

        $vcardLines[] = 'END:VCARD';

        return implode("\r\n", $vcardLines) . "\r\n";
    }

    private function splitName(string $name): array
    {
        $parts = preg_split('/\s+/', trim($name));

        if (!$parts || count($parts) === 1) {
            return ['', $parts[0] ?? ''];
        }

        $firstName = array_shift($parts);
        $lastName  = implode(' ', $parts);

        return [$lastName, $firstName];
    }

    private function escapeVcardValue(string $value): string
    {
        return str_replace(
            ["\\", ";", ",", "\n", "\r"],
            ["\\\\", '\\;', '\\,', '\\n', ''],
            $value
        );
    }

    private function formatPhone(string $phone): ?string
    {
        $trimmed = trim($phone);

        if ($trimmed === '') {
            return null;
        }

        $hasPlus = Str::startsWith($trimmed, '+');
        $digits  = preg_replace('/\D+/', '', $trimmed);

        if ($digits === '') {
            return null;
        }

        if ($hasPlus) {
            return '+' . $digits;
        }

        return '+' . ltrim($digits, '0');
    }
}
