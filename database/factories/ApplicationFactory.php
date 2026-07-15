<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\Candidate;
use App\Models\Stage;
use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'candidate_id' => fn () => Candidate::factory()->create()->id,
            'vacancy_id' => fn () => Vacancy::factory()->create()->id,
            'stage_id' => fn () => Stage::firstOrCreate(
                ['name' => 'Revisión'],
                ['color' => '#6366f1', 'sort_order' => 1, 'is_default' => true]
            )->id,
            'applied_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
