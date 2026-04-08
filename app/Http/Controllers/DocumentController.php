<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->input('category', '');
        $status = $request->input('status', '');
        $trashed = $request->input('trashed', '');

        $documentsQuery = Document::with(['category', 'uploader'])
            ->orderBy('sort_order');

        if (!empty($categoryId)) {
            $documentsQuery->where('category_id', $categoryId);
        }

        if ($status === 'published') {
            $documentsQuery->where('is_published', true);
        } elseif ($status === 'unpublished') {
            $documentsQuery->where('is_published', false);
        }

        if ($trashed === 'with') {
            $documentsQuery->withTrashed();
        } elseif ($trashed === 'only') {
            $documentsQuery->onlyTrashed();
        }

        $documents = $documentsQuery->paginate(15);

        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'categories' => $categories,
            'filters' => [
                'category' => $categoryId,
                'status' => $status,
                'trashed' => $trashed,
            ],
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        return Inertia::render('Documents/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'max:10240'], // 10MB max
            'category_id' => ['nullable', 'exists:categories,id'],
            'version' => ['nullable', 'string', 'max:50'],
            'is_vigant' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $document = new Document();
        $document->title = $validated['title'];
        $document->description = $validated['description'] ?? null;
        $document->slug = Str::slug($validated['title']);
        $document->category_id = $validated['category_id'] ?? null;
        $document->version = $validated['version'] ?? '1.0';
        $document->is_vigant = $validated['is_vigant'] ?? true;
        $document->is_featured = $validated['is_featured'] ?? false;
        $document->is_published = $validated['is_published'] ?? true;
        $document->sort_order = $validated['sort_order'] ?? 0;
        $document->uploaded_by = auth()->id();

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('documents', 'public');
            $document->file_path = $path;
            $document->file_type = $file->getClientOriginalExtension();
            $document->file_size = $file->getSize();
        }

        $document->save();

        return redirect()->route('documents.index')
            ->with('success', 'Documento creado exitosamente.');
    }

    public function edit(Document $document)
    {
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        return Inertia::render('Documents/Edit', [
            'document' => $document,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'max:10240'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'version' => ['nullable', 'string', 'max:50'],
            'is_vigant' => ['boolean'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $document->title = $validated['title'];
        $document->description = $validated['description'] ?? null;
        if ($validated['title'] !== $document->getOriginal('title')) {
            $document->slug = Str::slug($validated['title']);
        }
        $document->category_id = $validated['category_id'] ?? null;
        $document->version = $validated['version'] ?? $document->version;
        $document->is_vigant = $validated['is_vigant'] ?? true;
        $document->is_featured = $validated['is_featured'] ?? false;
        $document->is_published = $validated['is_published'] ?? true;
        $document->sort_order = $validated['sort_order'] ?? $document->sort_order;

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }
            $file = $request->file('file');
            $path = $file->store('documents', 'public');
            $document->file_path = $path;
            $document->file_type = $file->getClientOriginalExtension();
            $document->file_size = $file->getSize();
        }

        $document->save();

        return redirect()->route('documents.index')
            ->with('success', 'Documento actualizado exitosamente.');
    }

    public function destroy(Document $document)
    {
        // Soft delete
        $document->delete();

        return redirect()->route('documents.index')
            ->with('success', 'Documento eliminado exitosamente.');
    }

    public function restore($id)
    {
        $document = Document::withTrashed()->findOrFail($id);
        $document->restore();

        return redirect()->route('documents.index')
            ->with('success', 'Documento restaurado exitosamente.');
    }
}
