<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::with(['user', 'category'])
            ->latest('published_at');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by title
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        $posts = $query->paginate(10)->withQueryString();

        $categories = Category::active()->ordered()->get();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => $request->only(['status', 'category_id', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::active()->ordered()->get(['id', 'name', 'color', 'icon']);

        return Inertia::render('Posts/Create', [
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
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'is_pinned' => 'boolean',
            'show_in_public' => 'boolean',
            'show_in_dashboard' => 'boolean',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['slug'] = Str::slug($validated['title']);
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['is_pinned'] = $validated['is_pinned'] ?? false;
        $validated['show_in_public'] = $validated['show_in_public'] ?? false;
        $validated['show_in_dashboard'] = $validated['show_in_dashboard'] ?? false;

        // Parse tags if provided
        if (!empty($validated['tags'])) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        }

        // Set published_at if status is published
        if ($validated['status'] === 'published') {
            $validated['published_at'] = $validated['published_at'] ?? now();
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        Post::create($validated);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $canAccessInternalPost = auth()->check() && $post->show_in_dashboard;

        abort_unless($post->show_in_public || $canAccessInternalPost, 404);

        $post->load(['user', 'category']);

        $post->incrementViews();

        // Get related posts
        $relatedPosts = Post::with(['user', 'category'])
            ->published()
            ->visibleInPublic()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->latest('published_at')
            ->take(3)
            ->get();

        if ($relatedPosts->count() < 3) {
            $morePosts = Post::with(['user', 'category'])
                ->published()
                ->visibleInPublic()
                ->where('id', '!=', $post->id)
                ->whereNotIn('id', $relatedPosts->pluck('id'))
                ->latest('published_at')
                ->take(3 - $relatedPosts->count())
                ->get();
            $relatedPosts = $relatedPosts->merge($morePosts);
        }

        return Inertia::render('Posts/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'isPublicView' => ! $canAccessInternalPost,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        $categories = Category::active()->ordered()->get(['id', 'name', 'color', 'icon']);

        return Inertia::render('Posts/Edit', [
            'post' => $post->load('category'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:draft,published,archived',
            'is_featured' => 'boolean',
            'is_pinned' => 'boolean',
            'show_in_public' => 'boolean',
            'show_in_dashboard' => 'boolean',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['is_pinned'] = $validated['is_pinned'] ?? false;
        $validated['show_in_public'] = $validated['show_in_public'] ?? false;
        $validated['show_in_dashboard'] = $validated['show_in_dashboard'] ?? false;

        // Parse tags if provided
        if (!empty($validated['tags'])) {
            $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
        }

        // Set published_at if status is published and it wasn't set
        if ($validated['status'] === 'published' && !$post->published_at) {
            $validated['published_at'] = $validated['published_at'] ?? now();
        }

        // Handle featured image upload - only update if a new file is uploaded
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        } else {
            // Don't update featured_image if no new file was uploaded
            unset($validated['featured_image']);
        }

        $post->update($validated);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        // Delete featured image if exists
        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post deleted successfully.');
    }
}
