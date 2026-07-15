<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class VacancyFactory extends Factory
{
    public function definition(): array
    {
        $statuses = ['draft', 'active', 'closed'];
        $jobTypes = ['full_time', 'part_time', 'contract'];

        return [
            'title' => fake()->unique()->jobTitle(),
            'description' => fake()->paragraphs(3, true),
            'responsibilities' => fake()->paragraphs(2, true),
            'qualifications' => fake()->paragraphs(2, true),
            'job_type' => fake()->randomElement($jobTypes),
            'start_date' => fake()->dateTimeBetween('+1 month', '+6 months'),
            'salary' => fake()->randomFloat(2, 800000, 3000000),
            'salary_currency' => 'CLP',
            'status' => fake()->randomElement($statuses),
            'hiring_manager_id' => fn () => User::factory()->create()->id,
            'created_by' => fn () => User::factory()->create()->id,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => 'draft']);
    }

    public function active(): static
    {
        return $this->state(fn () => ['status' => 'active']);
    }

    public function closed(): static
    {
        return $this->state(fn () => ['status' => 'closed']);
    }
}
