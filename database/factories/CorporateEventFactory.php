<?php

namespace Database\Factories;

use App\Models\CorporateEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

class CorporateEventFactory extends Factory
{
    protected $model = CorporateEvent::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'event_date' => fake()->dateTimeBetween('+1 day', '+30 days'),
            'end_date' => null,
            'location' => fake()->city(),
            'type' => fake()->randomElement(['reunion', 'capacitacion', 'celebracion', 'taller']),
            'color' => fake()->hexColor(),
            'is_featured' => fake()->boolean(20),
            'is_published' => true,
        ];
    }
}
