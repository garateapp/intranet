<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HrPortalController extends Controller
{
    public function index()
    {
        return Inertia::render('Hr/Index', [
            'portal' => [
                'title' => Setting::get('hr_portal_title', 'Buk RRHH'),
                'description' => Setting::get('hr_portal_description', 'Vacaciones, permisos, liquidaciones y trámites se gestionan en Buk.'),
                'url' => Setting::get('hr_portal_url', 'https://greenex.buk.cl/users/sign_in'),
                'redirect_url' => route('rrhh.redirect'),
                'help_links' => [
                    ['label' => 'Ingresar a Buk', 'href' => route('rrhh.redirect')],
                    ['label' => 'FAQ de RRHH', 'href' => route('faq.index', ['category' => 'rrhh'])],
                ],
            ],
        ]);
    }

    public function redirect()
    {
        $url = Setting::get('hr_portal_url', 'https://greenex.buk.cl/users/sign_in');
        return redirect()->away($url);
    }
}
