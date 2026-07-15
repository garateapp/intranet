<?php

namespace Database\Factories;

use App\Models\Application;
use Illuminate\Database\Eloquent\Factories\Factory;

class InterviewFactory extends Factory
{
    public function definition(): array
    {
        return [
            'application_id' => fn () => Application::factory()->create()->id,
            'scheduled_at' => fake()->dateTimeBetween('+1 week', '+2 months'),
            'location_link' => fake()->optional(0.8)->url(),
            'notes' => fake()->optional(0.6)->sentence(),
        ];
    }
}
