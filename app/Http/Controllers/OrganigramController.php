<?php

namespace App\Http\Controllers;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganigramController extends Controller
{
    public function index()
    {
        $units = OrganizationalUnit::with(['children', 'users'])
            ->active()
            ->root()
            ->orderBy('sort_order')
            ->get();

        $users = User::with(['organizationalUnit', 'manager'])
            ->where('is_directory_visible', true)
            ->get()
            ->groupBy('organizational_unit_id');

        return Inertia::render('Organigram/Index', [
            'units' => $units,
            'users' => $users,
        ]);
    }
}
