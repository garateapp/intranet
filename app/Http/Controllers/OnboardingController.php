<?php

namespace App\Http\Controllers;

use App\Models\OnboardingStage;
use App\Models\UserOnboardingProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $stages = OnboardingStage::with(['activeTasks.userProgress' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }, 'activeTasks.document:id,title,slug,file_path,file_type'])
            ->active()
            ->forRole($user->role)
            ->get();

        $totalTasks = $stages->sum(fn ($stage) => $stage->activeTasks->count());
        $completedTasks = $stages->sum(fn ($stage) => $stage->activeTasks->where('pivot.is_completed', true)->count());
        $progressPercentage = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        return Inertia::render('Onboarding/Index', [
            'stages' => $stages,
            'progress' => [
                'total' => $totalTasks,
                'completed' => $completedTasks,
                'percentage' => $progressPercentage,
            ],
        ]);
    }

    public function completeTask($taskId)
    {
        $user = Auth::user();
        $progress = UserOnboardingProgress::firstOrCreate(
            ['user_id' => $user->id, 'onboarding_task_id' => $taskId],
            ['is_completed' => true, 'completed_at' => now()]
        );

        if (! $progress->wasRecentlyCreated) {
            $progress->update([
                'is_completed' => ! $progress->is_completed,
                'completed_at' => $progress->is_completed ? now() : null,
            ]);
        }

        return redirect()->back();
    }
}
