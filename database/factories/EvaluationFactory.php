<?php

namespace Database\Factories;

use App\Models\Evaluation;
use App\Models\Interview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvaluationFactory extends Factory
{
    protected $model = Evaluation::class;

    public function definition(): array
    {
        return [
            'interview_id' => fn () => Interview::factory()->create()->id,
            'evaluator_id' => fn () => User::factory()->create()->id,
            'score' => fake()->numberBetween(1, 10),
            'comments' => fake()->optional(0.8)->paragraph(),
        ];
    }
}
