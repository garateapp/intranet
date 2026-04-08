<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Link;
use App\Models\User;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');

        $results = [
            'posts' => [],
            'links' => [],
            'people' => [],
            'faqs' => [],
            'query' => $query,
        ];

        if (empty($query)) {
            return Inertia::render('Search/Index', $results);
        }

        // Search posts (up to 5, newest first)
        $results['posts'] = Post::with(['user', 'category'])
            ->published()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('excerpt', 'like', "%{$query}%")
                  ->orWhere('content', 'like', "%{$query}%");
            })
            ->latest('published_at')
            ->take(5)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'category' => $post->category?->name,
                    'published_at' => $post->published_at?->format('d/m/Y'),
                ];
            });

        // Search links (up to 6, by sort_order then title)
        $results['links'] = Link::with(['user', 'category'])
            ->active()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->orderBy('sort_order')
            ->orderBy('title')
            ->take(6)
            ->get()
            ->map(function ($link) {
                return [
                    'id' => $link->id,
                    'title' => $link->title,
                    'url' => $link->url,
                    'description' => $link->description,
                    'icon' => $link->icon,
                ];
            });

        // Search people (up to 6, featured first then by name)
        $results['people'] = User::where('is_directory_visible', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('position', 'like', "%{$query}%")
                  ->orWhere('department', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->orderBy('is_directory_featured', 'desc')
            ->orderBy('name')
            ->take(6)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'position' => $user->position,
                    'department' => $user->department,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                ];
            });

        // Search FAQs (up to 5, by category order then FAQ sort_order)
        $results['faqs'] = Faq::with('category')
            ->where('is_published', true)
            ->whereHas('category', function ($q) {
                $q->where('is_active', true);
            })
            ->where(function ($q) use ($query) {
                $q->where('question', 'like', "%{$query}%")
                  ->orWhere('answer', 'like', "%{$query}%");
            })
            ->join('faq_categories', 'faqs.faq_category_id', '=', 'faq_categories.id')
            ->orderBy('faq_categories.sort_order')
            ->orderBy('faqs.sort_order')
            ->select('faqs.*')
            ->take(5)
            ->get()
            ->map(function ($faq) {
                return [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                    'category' => $faq->category?->name,
                    'category_color' => $faq->category?->color,
                ];
            });

        return Inertia::render('Search/Index', $results);
    }
}
