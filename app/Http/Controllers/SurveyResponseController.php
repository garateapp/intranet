<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SurveyResponseController extends Controller
{
    public function store(Request $request, Survey $survey)
    {
        $survey->load('questions.options');

        if (! $survey->is_published) {
            throw ValidationException::withMessages([
                'survey' => 'La encuesta no está publicada.',
            ]);
        }

        if ($survey->isClosed()) {
            throw ValidationException::withMessages([
                'survey' => 'La encuesta ya finalizó y no admite más respuestas.',
            ]);
        }

        if (! $survey->is_anonymous && ! $request->user()) {
            return redirect()->route('login');
        }

        $validated = $request->validate([
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'integer'],
            'answers.*.option_id' => ['required', 'integer'],
        ]);

        $questions = $survey->questions->keyBy('id');
        $providedQuestionIds = collect($validated['answers'])->pluck('question_id');

        if (
            $providedQuestionIds->count() !== $questions->count()
            || $providedQuestionIds->unique()->count() !== $questions->count()
            || $questions->keys()->diff($providedQuestionIds)->isNotEmpty()
        ) {
            throw ValidationException::withMessages([
                'survey' => 'Debes responder todas las preguntas una sola vez.',
            ]);
        }

        foreach ($validated['answers'] as $answer) {
            $question = $questions->get($answer['question_id']);

            if (! $question || ! $question->options->contains('id', $answer['option_id'])) {
                throw ValidationException::withMessages([
                    'survey' => 'Una de las respuestas enviadas no es válida.',
                ]);
            }
        }

        $anonymousToken = $request->session()->get("survey_response_tokens.{$survey->id}");

        if ($survey->hasResponseFrom($request->user(), $anonymousToken)) {
            throw ValidationException::withMessages([
                'survey' => 'Ya registraste tu respuesta para esta encuesta.',
            ]);
        }

        if ($survey->is_anonymous) {
            $anonymousToken = $anonymousToken ?: (string) Str::uuid();
        }

        DB::transaction(function () use ($survey, $request, $validated, $anonymousToken) {
            $response = SurveyResponse::create([
                'survey_id' => $survey->id,
                'user_id' => $survey->is_anonymous ? null : $request->user()->id,
                'anonymous_token' => $survey->is_anonymous ? $anonymousToken : null,
            ]);

            foreach ($validated['answers'] as $answer) {
                $response->answers()->create([
                    'survey_question_id' => $answer['question_id'],
                    'survey_option_id' => $answer['option_id'],
                ]);
            }
        });

        if ($survey->is_anonymous) {
            $request->session()->put("survey_response_tokens.{$survey->id}", $anonymousToken);
        }

        return back();
    }
}
