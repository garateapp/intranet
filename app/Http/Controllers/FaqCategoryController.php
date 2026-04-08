<?php

namespace App\Http\Controllers;

use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FaqCategoryController extends Controller
{
    public function index()
    {
        $categories = FaqCategory::withCount('faqs')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('FaqCategories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('FaqCategories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        FaqCategory::create($validated);

        return redirect()->route('faq-categories.index')
            ->with('success', 'Categoría de FAQ creada exitosamente.');
    }

    public function edit(FaqCategory $faqCategory)
    {
        return Inertia::render('FaqCategories/Edit', [
            'category' => $faqCategory,
        ]);
    }

    public function update(Request $request, FaqCategory $faqCategory)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ]);

        if ($validated['name'] !== $faqCategory->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $faqCategory->update($validated);

        return redirect()->route('faq-categories.index')
            ->with('success', 'Categoría de FAQ actualizada exitosamente.');
    }

    public function destroy(FaqCategory $faqCategory)
    {
        $faqCategory->delete();

        return redirect()->route('faq-categories.index')
            ->with('success', 'Categoría de FAQ eliminada exitosamente.');
    }
}
