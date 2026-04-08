<?php

namespace App\Http\Controllers;

use App\Models\OnboardingStage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingStageController extends Controller
{
    public function index()
    {
        $stages = OnboardingStage::withCount('tasks')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('OnboardingStages/Index', [
            'stages' => $stages,
        ]);
    }

    public function create()
    {
        return Inertia::render('OnboardingStages/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'target_role' => ['nullable', 'string', 'max:255'],
        ]);

        OnboardingStage::create($validated);

        return redirect()->route('onboarding-stages.index')
            ->with('success', 'Etapa de onboarding creada exitosamente.');
    }

    public function edit(OnboardingStage $onboardingStage)
    {
        return Inertia::render('OnboardingStages/Edit', [
            'stage' => $onboardingStage,
        ]);
    }

    public function update(Request $request, OnboardingStage $onboardingStage)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'target_role' => ['nullable', 'string', 'max:255'],
        ]);

        $onboardingStage->update($validated);

        return redirect()->route('onboarding-stages.index')
            ->with('success', 'Etapa de onboarding actualizada exitosamente.');
    }

    public function destroy(OnboardingStage $onboardingStage)
    {
        $onboardingStage->delete();

        return redirect()->route('onboarding-stages.index')
            ->with('success', 'Etapa de onboarding eliminada exitosamente.');
    }
}
