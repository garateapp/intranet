<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::with('category')
            ->orderBy('sort_order')
            ->paginate(15);

        $categories = FaqCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Faqs/Index', [
            'faqs' => $faqs,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $categories = FaqCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Faqs/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'faq_category_id' => ['required', 'exists:faq_categories,id'],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ]);

        Faq::create($validated);

        return redirect()->route('faqs.index')
            ->with('success', 'FAQ creada exitosamente.');
    }

    public function edit(Faq $faq)
    {
        $categories = FaqCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Faqs/Edit', [
            'faq' => $faq,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'faq_category_id' => ['required', 'exists:faq_categories,id'],
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_published' => ['boolean'],
        ]);

        $faq->update($validated);

        return redirect()->route('faqs.index')
            ->with('success', 'FAQ actualizada exitosamente.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();

        return redirect()->route('faqs.index')
            ->with('success', 'FAQ eliminada exitosamente.');
    }
}
