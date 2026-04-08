<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqPortalController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $category = $request->input('category', '');

        $categories = FaqCategory::where('is_active', true)
            ->withCount(['faqs' => function ($q) {
                $q->where('is_published', true);
            }])
            ->orderBy('sort_order')
            ->get();

        $faqsQuery = Faq::with('category')
            ->where('is_published', true)
            ->whereHas('category', function ($q) {
                $q->where('is_active', true);
            });

        if (!empty($category)) {
            $faqsQuery->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        if (!empty($query)) {
            $faqsQuery->where(function ($q) use ($query) {
                $q->where('question', 'like', "%{$query}%")
                  ->orWhere('answer', 'like', "%{$query}%");
            });
        }

        $faqsQuery->join('faq_categories', 'faqs.faq_category_id', '=', 'faq_categories.id')
            ->orderBy('faq_categories.sort_order')
            ->orderBy('faqs.sort_order')
            ->select('faqs.*');

        $faqs = $faqsQuery->paginate(20);

        return Inertia::render('Faq/Index', [
            'faqs' => $faqs,
            'categories' => $categories,
            'filters' => [
                'q' => $query,
                'category' => $category,
            ],
        ]);
    }
}
