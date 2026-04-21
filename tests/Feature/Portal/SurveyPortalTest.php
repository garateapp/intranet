<?php

namespace Tests\Feature\Portal;

use App\Models\Survey;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SurveyPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_and_dashboard_include_published_surveys(): void
    {
        $survey = $this->createSurvey(true);
        $user = User::factory()->create();

        $this->get(route('welcome'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('surveys', 1)
                ->where('surveys.0.title', $survey->title));

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('surveys', 1)
                ->where('surveys.0.title', $survey->title));
    }

    public function test_non_anonymous_survey_requires_login(): void
    {
        $survey = $this->createSurvey(false);
        $optionMap = $survey->questions->mapWithKeys(fn ($question) => [
            $question->id => $question->options->first()->id,
        ]);

        $this->post(route('surveys.respond', $survey), [
            'answers' => $optionMap->map(fn ($optionId, $questionId) => [
                'question_id' => $questionId,
                'option_id' => $optionId,
            ])->values()->all(),
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_response_is_saved_with_user(): void
    {
        $survey = $this->createSurvey(false);
        $user = User::factory()->create();
        $optionMap = $survey->questions->mapWithKeys(fn ($question) => [
            $question->id => $question->options->first()->id,
        ]);

        $this->actingAs($user)
            ->post(route('surveys.respond', $survey), [
                'answers' => $optionMap->map(fn ($optionId, $questionId) => [
                    'question_id' => $questionId,
                    'option_id' => $optionId,
                ])->values()->all(),
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('survey_responses', [
            'survey_id' => $survey->id,
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseCount('survey_answers', 1);
    }

    public function test_anonymous_survey_can_be_answered_without_login_and_blocks_duplicate_vote(): void
    {
        $survey = $this->createSurvey(true);
        $payload = [
            'answers' => $survey->questions->map(fn ($question) => [
                'question_id' => $question->id,
                'option_id' => $question->options->first()->id,
            ])->values()->all(),
        ];

        $this->post(route('surveys.respond', $survey), $payload)
            ->assertRedirect();

        $this->assertDatabaseHas('survey_responses', [
            'survey_id' => $survey->id,
            'user_id' => null,
        ]);

        $this->post(route('surveys.respond', $survey), $payload)
            ->assertSessionHasErrors('survey');
    }

    public function test_closed_survey_cannot_receive_votes(): void
    {
        $survey = $this->createSurvey(true, now()->subMinute());
        $payload = [
            'answers' => $survey->questions->map(fn ($question) => [
                'question_id' => $question->id,
                'option_id' => $question->options->first()->id,
            ])->values()->all(),
        ];

        $this->post(route('surveys.respond', $survey), $payload)
            ->assertSessionHasErrors('survey');
    }

    private function createSurvey(bool $isAnonymous, $endsAt = null): Survey
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $survey = Survey::create([
            'created_by' => $admin->id,
            'title' => $isAnonymous ? 'Encuesta Anónima' : 'Encuesta Identificada',
            'description' => 'Encuesta de prueba',
            'is_anonymous' => $isAnonymous,
            'is_published' => true,
            'ends_at' => $endsAt ?? now()->addDay(),
        ]);

        $question = $survey->questions()->create([
            'prompt' => '¿Cómo evalúas el portal?',
            'sort_order' => 0,
        ]);

        $question->options()->createMany([
            ['label' => 'Muy bien', 'sort_order' => 0],
            ['label' => 'Bien', 'sort_order' => 1],
        ]);

        return $survey->load('questions.options');
    }
}
