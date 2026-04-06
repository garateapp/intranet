<?php

namespace App\Http\Controllers;

use App\Models\Link;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Link::with(['user', 'category'])
            ->ordered();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by title
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        $links = $query->paginate(15)->withQueryString();

        $categories = Category::active()->ordered()->get();

        return Inertia::render('Links/Index', [
            'links' => $links,
            'categories' => $categories,
            'filters' => $request->only(['category_id', 'is_active', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::active()->ordered()->get(['id', 'name', 'color', 'icon']);

        return Inertia::render('Links/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:2048',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:100',
            'category_id' => 'required|exists:categories,id',
            'is_external' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['is_external'] = $validated['is_external'] ?? true;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['clicks'] = 0;

        Link::create($validated);

        return redirect()->route('links.index')
            ->with('success', 'Link created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Link $link)
    {
        $link->load(['user', 'category', 'comments.user']);
        $link->incrementClicks();

        return Inertia::render('Links/Show', [
            'link' => $link,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Link $link)
    {
        $categories = Category::active()->ordered()->get(['id', 'name', 'color', 'icon']);

        return Inertia::render('Links/Edit', [
            'link' => $link->load('category'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Link $link)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:2048',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:100',
            'category_id' => 'required|exists:categories,id',
            'is_external' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['is_external'] = $validated['is_external'] ?? true;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $link->update($validated);

        return redirect()->route('links.index')
            ->with('success', 'Link updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Link $link)
    {
        $link->delete();

        return redirect()->route('links.index')
            ->with('success', 'Link deleted successfully.');
    }
}
