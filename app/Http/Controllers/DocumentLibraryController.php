<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentLibraryController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $category = $request->input('category', '');

        $categories = Category::has('documents')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $documentsQuery = Document::with(['category', 'uploader'])
            ->published()
            ->orderBy('sort_order')
            ->orderByDesc('is_featured')
            ->latest();

        if (! empty($query)) {
            $documentsQuery->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            });
        }

        if (! empty($category)) {
            $documentsQuery->byCategory($category);
        }

        $documents = $documentsQuery->paginate(12);

        return Inertia::render('DocumentLibrary/Index', [
            'documents' => $documents,
            'categories' => $categories,
            'filters' => [
                'q' => $query,
                'category' => $category,
            ],
        ]);
    }

    public function show(Document $document)
    {
        if (! $document->is_published) {
            abort(404);
        }

        return Inertia::render('DocumentLibrary/Show', [
            'document' => $document->load(['category', 'uploader']),
        ]);
    }
}
