<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Link;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InitialDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@intranet.test',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role' => 'admin',
            'department' => 'Tecnología',
            'position' => 'Administrador de Sistemas',
            'login_method' => 'email',
        ]);

        // Create regular users
        $user1 = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@intranet.test',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role' => 'user',
            'department' => 'Recursos Humanos',
            'position' => 'Analista RRHH',
            'login_method' => 'email',
        ]);

        $user2 = User::create([
            'name' => 'María García',
            'email' => 'maria@intranet.test',
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'role' => 'user',
            'department' => 'Marketing',
            'position' => 'Coordinadora de Marketing',
            'login_method' => 'email',
        ]);

        // Get categories
        $noticias = Category::where('slug', 'noticias')->first();
        $eventos = Category::where('slug', 'eventos')->first();
        $tecnologia = Category::where('slug', 'tecnologia')->first();
        $enlaces = Category::where('slug', 'enlaces-utiles')->first();

        // Create sample posts
        Post::create([
            'user_id' => $admin->id,
            'category_id' => $noticias?->id,
            'title' => 'Bienvenidos a la Nueva Intranet',
            'slug' => 'bienvenidos-nueva-intranet',
            'excerpt' => 'Nos complace presentar nuestra nueva plataforma interna',
            'content' => '<p>Nos complace presentar nuestra nueva plataforma interna de comunicación y colaboración. Esta intranet ha sido diseñada para facilitar el acceso a información importante, noticias, eventos y recursos útiles.</p><p>Entre las características principales se incluyen:</p><ul><li>Panel de noticias y actualizaciones</li><li>Directorio de enlaces útiles</li><li>Sistema de categorías organizado</li><li>Interfaz moderna y responsive</li></ul>',
            'status' => 'published',
            'is_pinned' => true,
            'is_featured' => true,
            'published_at' => now(),
            'tags' => ['bienvenida', 'intranet', 'lanzamiento'],
        ]);

        Post::create([
            'user_id' => $user1->id,
            'category_id' => $eventos?->id,
            'title' => 'Evento de Fin de Año',
            'slug' => 'evento-fin-de-ano',
            'excerpt' => 'Los invitamos a nuestro evento anual de celebración',
            'content' => '<p>Los invitamos a nuestro evento anual de celebración que se realizará el próximo mes. Habrá actividades especiales, premios y sorpresas.</p><p><strong>Fecha:</strong> Por confirmar<br><strong>Lugar:</strong> Por confirmar</p><p>Manténganse atentos para más detalles.</p>',
            'status' => 'published',
            'is_featured' => true,
            'is_pinned' => false,
            'published_at' => now()->subDays(2),
            'tags' => ['evento', 'celebración'],
        ]);

        Post::create([
            'user_id' => $user2->id,
            'category_id' => $tecnologia?->id,
            'title' => 'Actualización de Sistemas',
            'slug' => 'actualizacion-sistemas',
            'excerpt' => 'Se realizarán actualizaciones en los sistemas esta semana',
            'content' => '<p>Informamos que durante esta semana se realizarán actualizaciones programadas en nuestros sistemas. Esto puede causar interrupciones menores en el servicio.</p><p><strong>Ventana de mantenimiento:</strong> Miércoles 10 PM - 2 AM</p>',
            'status' => 'published',
            'is_pinned' => true,
            'is_featured' => false,
            'published_at' => now()->subDays(1),
            'tags' => ['tecnología', 'mantenimiento'],
        ]);

        // Create sample links
        Link::create([
            'user_id' => $admin->id,
            'category_id' => $enlaces?->id,
            'title' => 'Portal de Empleados',
            'url' => 'https://portal.greenex.test',
            'description' => 'Acceso al portal de gestión de empleados',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Link::create([
            'user_id' => $admin->id,
            'category_id' => $enlaces?->id,
            'title' => 'Sistema de Tickets',
            'url' => 'https://soporte.greenex.test',
            'description' => 'Sistema de soporte técnico',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Link::create([
            'user_id' => $admin->id,
            'category_id' => $enlaces?->id,
            'title' => 'Calendario Corporativo',
            'url' => 'https://calendar.greenex.test',
            'description' => 'Calendario de eventos y actividades',
            'is_active' => true,
            'sort_order' => 3,
        ]);
    }
}
