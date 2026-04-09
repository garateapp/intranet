<?php

namespace App\Http\Middleware;

use App\Models\UserActivity;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogUserActivity
{
    /**
     * Handle an incoming request and log user activity.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only log for authenticated users
        if (!auth()->check()) {
            return $response;
        }

        // Skip logging for certain routes/assets
        $skipPaths = [
            '/favicon.ico',
            '/build/',
            '/node_modules/',
            '/@',
            '/storage/',
        ];

        foreach ($skipPaths as $path) {
            if (str_starts_with($request->path(), ltrim($path, '/'))) {
                return $response;
            }
        }

        // Determine action from request
        $action = $this->determineAction($request);

        // Skip logging if action should not be tracked
        if (!$action) {
            return $response;
        }

        // Parse user agent
        $uaInfo = UserActivity::parseUserAgent($request->userAgent());

        // Log activity
        UserActivity::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'browser' => $uaInfo['browser'],
            'os' => $uaInfo['os'],
            'device' => $uaInfo['device'],
            'metadata' => $this->buildMetadata($request),
        ]);

        return $response;
    }

    /**
     * Determine the activity action from the request.
     */
    protected function determineAction(Request $request): ?string
    {
        $path = $request->path();
        $method = $request->method();

        // Detect login
        if ($path === 'login' || $path === 'auth/google') {
            return 'login';
        }

        // Detect logout
        if ($path === 'logout' && $method === 'POST') {
            return 'logout';
        }

        // Only track GET requests for page visits (not API, not POST/PUT/DELETE)
        if ($method !== 'GET') {
            return 'api_request';
        }

        // Detect password reset / profile changes
        if (str_contains($path, 'password') || str_contains($path, 'profile')) {
            return 'account_update';
        }

        // Track page visits for main routes
        return 'page_visit';
    }

    /**
     * Build additional metadata for the activity log.
     */
    protected function buildMetadata(Request $request): array
    {
        return [
            'query_params' => $request->query() ? array_keys($request->query()) : [],
            'referrer' => $request->headers->get('referer'),
            'route_name' => $request->route()?->getName(),
        ];
    }
}
