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
use App\Models\Service;
use App\Models\UserOnboardingProgress;
use App\Models\UserRequest;
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
                    'avatar_url' => $user->avatar_url,
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

        // Phase 2: Services status summary (only showing issues or all if < 5)
        $services = Service::active()->public()->orderBy('sort_order')->get();
        $servicesWithIssues = $services->where('status', '!=', 'operativo');
        $servicesSummary = $servicesWithIssues->count() > 0 || $services->count() <= 5
            ? $services->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'status' => $s->status,
                'status_label' => $s->status_label,
                'status_badge_color' => $s->status_badge_color,
                'status_message' => $s->status_message,
            ])
            : $servicesWithIssues->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'status' => $s->status,
                'status_label' => $s->status_label,
                'status_badge_color' => $s->status_badge_color,
                'status_message' => $s->status_message,
            ]);

        // Phase 2: Onboarding progress for current user
        $onboardingStats = [
            'total' => 0,
            'completed' => 0,
            'percentage' => 0,
            'has_pending' => false,
        ];

        $stages = \App\Models\OnboardingStage::with(['activeTasks.userProgress' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])->active()->forRole($user->role)->get();

        $totalTasks = $stages->sum(fn ($stage) => $stage->activeTasks->count());
        $completedTasks = $stages->sum(fn ($stage) => $stage->activeTasks->where('pivot.is_completed', true)->count());
        $onboardingStats = [
            'total' => $totalTasks,
            'completed' => $completedTasks,
            'percentage' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0,
            'has_pending' => $totalTasks > $completedTasks,
        ];

        // Phase 2: Recent user requests
        $recentRequests = UserRequest::with('requestType')
            ->forUser($user->id)
            ->latest()
            ->take(3)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'reference_code' => $r->reference_code,
                'title' => $r->title,
                'status' => $r->status,
                'status_label' => $r->status_label,
                'status_badge_color' => $r->status_badge_color,
                'created_at' => $r->created_at->format('d/m/Y'),
                'request_type' => $r->requestType?->name,
            ]);

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
            'services' => $servicesSummary,
            'onboarding' => $onboardingStats,
            'recentRequests' => $recentRequests,
        ]);
    }
}
