<?php

namespace App\Http\Controllers;

use App\Models\OnboardingTask;
use App\Models\OnboardingStage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingTaskAdminController extends Controller
{
    public function index()
    {
        $tasks = OnboardingTask::with('stage')
            ->orderBy('sort_order')
            ->paginate(20);

        $stages = OnboardingStage::active()->orderBy('sort_order')->get();

        return Inertia::render('OnboardingTasks/Index', [
            'tasks' => $tasks,
            'stages' => $stages,
        ]);
    }

    public function create()
    {
        $stages = OnboardingStage::active()->orderBy('sort_order')->get();
        return Inertia::render('OnboardingTasks/Create', [
            'stages' => $stages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'onboarding_stage_id' => ['required', 'exists:onboarding_stages,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'task_type' => ['required', 'string', 'in:checklist,resource,link,faq'],
            'resource_url' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_required' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        OnboardingTask::create($validated);

        return redirect()->route('onboarding-tasks.index')
            ->with('success', 'Tarea de onboarding creada exitosamente.');
    }

    public function edit(OnboardingTask $onboardingTask)
    {
        $stages = OnboardingStage::active()->orderBy('sort_order')->get();
        return Inertia::render('OnboardingTasks/Edit', [
            'task' => $onboardingTask,
            'stages' => $stages,
        ]);
    }

    public function update(Request $request, OnboardingTask $onboardingTask)
    {
        $validated = $request->validate([
            'onboarding_stage_id' => ['required', 'exists:onboarding_stages,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'task_type' => ['required', 'string', 'in:checklist,resource,link,faq'],
            'resource_url' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_required' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $onboardingTask->update($validated);

        return redirect()->route('onboarding-tasks.index')
            ->with('success', 'Tarea de onboarding actualizada exitosamente.');
    }

    public function destroy(OnboardingTask $onboardingTask)
    {
        $onboardingTask->delete();

        return redirect()->route('onboarding-tasks.index')
            ->with('success', 'Tarea de onboarding eliminada exitosamente.');
    }
}
