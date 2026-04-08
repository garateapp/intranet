<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Link;
use App\Models\User;
use App\Models\Comment;
use App\Models\Category;
use App\Models\CorporateEvent;
use App\Models\Faq;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function welcome()
    {
        $featuredPosts = Post::with(['user', 'category'])
            ->published()
            ->featured()
            ->latest('published_at')
            ->take(3)
            ->get();

        $pinnedPosts = Post::with(['user', 'category'])
            ->published()
            ->pinned()
            ->latest('published_at')
            ->take(5)
            ->get();

        $recentPosts = Post::with(['user', 'category'])
            ->published()
            ->latest('published_at')
            ->take(6)
            ->get();

        $activeLinks = Link::with(['user', 'category'])
            ->active()
            ->ordered()
            ->get();

        $categories = Category::active()
            ->withCount('posts')
            ->ordered()
            ->get();

        return Inertia::render('Welcome', [
            'featuredPosts' => $featuredPosts,
            'pinnedPosts' => $pinnedPosts,
            'recentPosts' => $recentPosts,
            'activeLinks' => $activeLinks,
            'categories' => $categories,
        ]);
    }

    public function index()
    {
        $user = auth()->user();

        // Quick links (first 6 active links by sort_order)
        $quickLinks = Link::with(['user', 'category'])
            ->active()
            ->ordered()
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

        // Featured posts
        $featuredPosts = Post::with(['user', 'category'])
            ->published()
            ->where(function ($query) {
                $query->where('is_featured', true)
                      ->orWhere('is_pinned', true);
            })
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'category' => $post->category?->name,
                    'published_at' => $post->published_at?->format('Y-m-d H:i:s'),
                    'is_pinned' => $post->is_pinned,
                ];
            });

        // Upcoming events (next 4)
        $upcomingEvents = CorporateEvent::published()
            ->upcoming()
            ->take(4)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'event_date' => $event->event_date->format('Y-m-d H:i:s'),
                    'end_date' => $event->end_date?->format('Y-m-d H:i:s'),
                    'location' => $event->location,
                    'type' => $event->type,
                    'color' => $event->color,
                ];
            });

        // Featured directory users (up to 4)
        $directoryUsers = User::where('is_directory_visible', true)
            ->where('is_directory_featured', true)
            ->orderBy('name')
            ->take(4)
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

        // FAQ preview (first 3 published)
        $faqs = Faq::with('category')
            ->where('is_published', true)
            ->whereHas('category', function ($q) {
                $q->where('is_active', true);
            })
            ->join('faq_categories', 'faqs.faq_category_id', '=', 'faq_categories.id')
            ->orderBy('faq_categories.sort_order')
            ->orderBy('faqs.sort_order')
            ->select('faqs.*')
            ->take(3)
            ->get()
            ->map(function ($faq) {
                return [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                ];
            });

        // HR Portal info
        $hrPortal = [
            'title' => Setting::get('hr_portal_title', 'Buk RRHH'),
            'description' => Setting::get('hr_portal_description', 'Vacaciones, permisos, liquidaciones y trámites se gestionan en Buk.'),
            'url' => Setting::get('hr_portal_url', 'https://greenex.buk.cl/users/sign_in'),
            'redirect_url' => route('rrhh.redirect'),
            'help_links' => [
                ['label' => 'Ingresar a Buk', 'href' => route('rrhh.redirect')],
                ['label' => 'FAQ de RRHH', 'href' => route('faq.index', ['category' => 'rrhh'])],
            ],
        ];

        return Inertia::render('Dashboard', [
            'hero' => [
                'greeting' => "¡Hola, {$user->name}!",
                'subtitle' => 'Encuentra información, herramientas y personas de forma rápida.',
            ],
            'quickLinks' => $quickLinks,
            'featuredPosts' => $featuredPosts,
            'events' => $upcomingEvents,
            'directoryUsers' => $directoryUsers,
            'faqs' => $faqs,
            'hrPortal' => $hrPortal,
        ]);
    }
}
