<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SurveyController extends Controller
{
    public function index()
    {
        $surveys = Survey::withCount('responses')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Survey $survey) => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'is_anonymous' => $survey->is_anonymous,
                'is_published' => $survey->is_published,
                'ends_at' => $survey->endsAtLabel(),
                'responses_count' => $survey->responses_count,
                'status' => $survey->isClosed() ? 'cerrada' : 'activa',
            ]);

        return Inertia::render('Surveys/Index', [
            'surveys' => $surveys,
        ]);
    }

    public function create()
    {
        return Inertia::render('Surveys/Create');
    }

    public function store(Request $request)
    {
        $validated = $this->validateSurvey($request);

        DB::transaction(function () use ($validated, $request) {
            $survey = Survey::create([
                'created_by' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'is_anonymous' => $validated['is_anonymous'],
                'is_published' => $validated['is_published'],
                'ends_at' => $validated['ends_at'],
            ]);

            $this->syncQuestions($survey, $validated['questions']);
        });

        return redirect()->route('surveys.index')
            ->with('success', 'Encuesta creada exitosamente.');
    }

    public function show(Survey $survey)
    {
        $survey->load([
            'questions.options' => fn ($query) => $query->withCount('answers'),
            'responses.user',
            'responses.answers.question',
            'responses.answers.option',
        ]);

        $questionCount = max($survey->responses->count(), 1);

        return Inertia::render('Surveys/Show', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'is_anonymous' => $survey->is_anonymous,
                'is_published' => $survey->is_published,
                'ends_at' => $survey->endsAtLabel(),
                'responses_count' => $survey->responses->count(),
                'status' => $survey->isClosed() ? 'cerrada' : 'activa',
                'questions' => $survey->questions->map(fn ($question) => [
                    'id' => $question->id,
                    'prompt' => $question->prompt,
                    'options' => $question->options->map(fn ($option) => [
                        'id' => $option->id,
                        'label' => $option->label,
                        'answers_count' => $option->answers_count,
                        'percentage' => round(($option->answers_count / $questionCount) * 100, 1),
                    ])->values(),
                ])->values(),
                'responses' => $survey->responses
                    ->sortByDesc('created_at')
                    ->values()
                    ->map(fn ($response) => [
                        'id' => $response->id,
                        'respondent' => $survey->is_anonymous
                            ? 'Anónimo'
                            : ($response->user?->name ?? 'Usuario eliminado'),
                        'email' => $survey->is_anonymous ? null : $response->user?->email,
                        'submitted_at' => $response->created_at->format('d/m/Y H:i'),
                        'answers' => $response->answers
                            ->sortBy(fn ($answer) => $answer->question->sort_order ?? 0)
                            ->values()
                            ->map(fn ($answer) => [
                                'question' => $answer->question->prompt,
                                'option' => $answer->option->label,
                            ]),
                    ]),
            ],
        ]);
    }

    public function edit(Survey $survey)
    {
        $survey->load('questions.options');

        return Inertia::render('Surveys/Edit', [
            'survey' => [
                'id' => $survey->id,
                'title' => $survey->title,
                'description' => $survey->description,
                'is_anonymous' => $survey->is_anonymous,
                'is_published' => $survey->is_published,
                'ends_at' => $survey->ends_at->format('Y-m-d\TH:i'),
                'questions' => $survey->questions->map(fn ($question) => [
                    'prompt' => $question->prompt,
                    'options' => $question->options->map(fn ($option) => [
                        'label' => $option->label,
                    ])->values(),
                ])->values(),
            ],
        ]);
    }

    public function update(Request $request, Survey $survey)
    {
        $validated = $this->validateSurvey($request);

        DB::transaction(function () use ($validated, $survey) {
            $survey->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'is_anonymous' => $validated['is_anonymous'],
                'is_published' => $validated['is_published'],
                'ends_at' => $validated['ends_at'],
            ]);

            $survey->questions()->delete();
            $this->syncQuestions($survey, $validated['questions']);
        });

        return redirect()->route('surveys.index')
            ->with('success', 'Encuesta actualizada exitosamente.');
    }

    public function destroy(Survey $survey)
    {
        $survey->delete();

        return redirect()->route('surveys.index')
            ->with('success', 'Encuesta eliminada exitosamente.');
    }

    private function validateSurvey(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_anonymous' => ['required', 'boolean'],
            'is_published' => ['required', 'boolean'],
            'ends_at' => ['required', 'date', 'after:now'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.prompt' => ['required', 'string', 'max:255'],
            'questions.*.options' => ['required', 'array', 'min:2'],
            'questions.*.options.*.label' => ['required', 'string', 'max:255'],
        ]);
    }

    private function syncQuestions(Survey $survey, array $questions): void
    {
        foreach (array_values($questions) as $questionIndex => $questionData) {
            $question = $survey->questions()->create([
                'prompt' => $questionData['prompt'],
                'sort_order' => $questionIndex,
            ]);

            foreach (array_values($questionData['options']) as $optionIndex => $optionData) {
                $question->options()->create([
                    'label' => $optionData['label'],
                    'sort_order' => $optionIndex,
                ]);
            }
        }
    }
}
