<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CandidateFactory extends Factory
{
    public function definition(): array
    {
        $origins = ['Drive', 'LinkedIn', 'Referido', 'Indeed', 'Computrabajo'];

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'origin' => fake()->randomElement($origins),
            'cv_url' => fake()->optional(0.7)->url(),
            'notes' => fake()->optional(0.5)->sentence(),
        ];
    }
}
