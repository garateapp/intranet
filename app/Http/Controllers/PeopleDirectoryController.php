<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeopleDirectoryController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $department = $request->input('department', '');

        $peopleQuery = User::where('is_directory_visible', true);

        if (!empty($query)) {
            $peopleQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('position', 'like', "%{$query}%")
                  ->orWhere('department', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            });
        }

        if (!empty($department)) {
            $peopleQuery->where('department', $department);
        }

        $peopleQuery->orderBy('is_directory_featured', 'desc')
            ->orderBy('name');

        $people = $peopleQuery->paginate(12);

        // Get unique departments for filtering
        $departments = User::where('is_directory_visible', true)
            ->whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values();

        return Inertia::render('Directory/Index', [
            'people' => $people,
            'departments' => $departments,
            'filters' => [
                'q' => $query,
                'department' => $department,
            ],
        ]);
    }
}
