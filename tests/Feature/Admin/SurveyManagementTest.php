<?php

namespace Tests\Feature\Admin;

use App\Models\Survey;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class SurveyManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_survey_with_questions_and_options(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->post(route('surveys.store'), [
                'title' => 'Clima Laboral',
                'description' => 'Encuesta trimestral',
                'is_anonymous' => false,
                'is_published' => true,
                'ends_at' => Carbon::now()->addDays(5)->format('Y-m-d H:i:s'),
                'questions' => [
                    [
                        'prompt' => '¿Cómo evalúas la comunicación interna?',
                        'options' => [
                            ['label' => 'Excelente'],
                            ['label' => 'Buena'],
                        ],
                    ],
                ],
            ])
            ->assertRedirect(route('surveys.index'));

        $survey = Survey::first();

        $this->assertNotNull($survey);
        $this->assertSame('Clima Laboral', $survey->title);
        $this->assertFalse($survey->is_anonymous);
        $this->assertDatabaseCount('survey_questions', 1);
        $this->assertDatabaseCount('survey_options', 2);
    }

    public function test_admin_can_view_survey_results_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $survey = $this->createSurvey();

        $this->actingAs($admin)
            ->get(route('surveys.show', $survey))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('survey.title', 'Encuesta General')
                ->has('survey.questions', 1));
    }

    private function createSurvey(): Survey
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $survey = Survey::create([
            'created_by' => $admin->id,
            'title' => 'Encuesta General',
            'description' => 'Descripción',
            'is_anonymous' => true,
            'is_published' => true,
            'ends_at' => now()->addDay(),
        ]);

        $question = $survey->questions()->create([
            'prompt' => '¿Te gusta la intranet?',
            'sort_order' => 0,
        ]);

        $question->options()->createMany([
            ['label' => 'Sí', 'sort_order' => 0],
            ['label' => 'No', 'sort_order' => 1],
        ]);

        return $survey;
    }
}
