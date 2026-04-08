<?php

namespace Database\Seeders;

use App\Models\CorporateEvent;
use Illuminate\Database\Seeder;

class CorporateEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Past events (should not show in upcoming)
        CorporateEvent::create([
            'title' => 'Cumpleaños de la Empresa',
            'description' => 'Celebración del aniversario de GreenEx con actividades y almuerzo especial.',
            'event_date' => now()->subDays(10)->setTime(11, 0),
            'end_date' => now()->subDays(10)->setTime(15, 0),
            'location' => 'Oficina Central',
            'type' => 'celebracion',
            'color' => '#F59E0B',
            'is_featured' => true,
            'is_published' => true,
        ]);

        // Upcoming events
        CorporateEvent::create([
            'title' => 'Capacitación en Seguridad Laboral',
            'description' => 'Capacitación obligatoria sobre protocolos de seguridad y evacuación.',
            'event_date' => now()->addDays(5)->setTime(10, 0),
            'end_date' => now()->addDays(5)->setTime(12, 0),
            'location' => 'Sala de Conferencias A',
            'type' => 'capacitacion',
            'color' => '#EF4444',
            'is_featured' => true,
            'is_published' => true,
        ]);

        CorporateEvent::create([
            'title' => 'Reunión Trimestral de Resultados',
            'description' => 'Presentación de resultados del trimestre y planificación del siguiente período.',
            'event_date' => now()->addDays(10)->setTime(15, 0),
            'end_date' => now()->addDays(10)->setTime(17, 0),
            'location' => 'Sala de Conferencias Principal',
            'type' => 'reunion',
            'color' => '#2563EB',
            'is_featured' => true,
            'is_published' => true,
        ]);

        CorporateEvent::create([
            'title' => 'Taller de Bienestar Laboral',
            'description' => 'Taller práctico sobre manejo del estrés y hábitos saludables en el trabajo.',
            'event_date' => now()->addDays(15)->setTime(14, 0),
            'end_date' => now()->addDays(15)->setTime(16, 0),
            'location' => 'Sala Multiuso',
            'type' => 'taller',
            'color' => '#10B981',
            'is_featured' => false,
            'is_published' => true,
        ]);

        CorporateEvent::create([
            'title' => 'Cierre por Feriado Nacional',
            'description' => 'Oficinas cerradas por feriado nacional. Recuerden programar sus pendientes.',
            'event_date' => now()->addDays(20)->setTime(0, 0),
            'end_date' => null,
            'location' => 'Todas las oficinas',
            'type' => 'feriado',
            'color' => '#8B5CF6',
            'is_featured' => false,
            'is_published' => true,
        ]);

        CorporateEvent::create([
            'title' => 'Evento de Team Building',
            'description' => 'Actividades de integración y trabajo en equipo para todos los colaboradores.',
            'event_date' => now()->addDays(25)->setTime(9, 0),
            'end_date' => now()->addDays(25)->setTime(18, 0),
            'location' => 'Por confirmar',
            'type' => 'team-building',
            'color' => '#EC4899',
            'is_featured' => true,
            'is_published' => true,
        ]);

        // Unpublished event (should not show)
        CorporateEvent::create([
            'title' => 'Evento No Publicado',
            'description' => 'Este evento aún no está publicado.',
            'event_date' => now()->addDays(30)->setTime(10, 0),
            'end_date' => now()->addDays(30)->setTime(12, 0),
            'location' => 'Por confirmar',
            'type' => 'otro',
            'color' => '#6B7280',
            'is_featured' => false,
            'is_published' => false,
        ]);
    }
}
