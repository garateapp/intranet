<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserDirectorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update existing users with directory fields
        $users = [
            [
                'email' => 'admin@intranet.test',
                'phone' => '+56 9 1234 5678',
                'location' => 'Santiago, Chile',
                'bio' => 'Administrador de sistemas con más de 5 años de experiencia en la empresa.',
                'is_directory_visible' => true,
                'is_directory_featured' => true,
            ],
            [
                'email' => 'juan@intranet.test',
                'phone' => '+56 9 2345 6789',
                'location' => 'Santiago, Chile',
                'bio' => 'Analista de Recursos Humanos especializado en bienestar laboral.',
                'is_directory_visible' => true,
                'is_directory_featured' => true,
            ],
            [
                'email' => 'maria@intranet.test',
                'phone' => '+56 9 3456 7890',
                'location' => 'Santiago, Chile',
                'bio' => 'Coordinadora de Marketing con enfoque en marketing digital.',
                'is_directory_visible' => true,
                'is_directory_featured' => true,
            ],
        ];

        foreach ($users as $userData) {
            $user = User::where('email', $userData['email'])->first();
            if ($user) {
                $user->update($userData);
            }
        }

        // Create additional directory users
        $additionalUsers = [
            [
                'name' => 'Carlos Rodríguez',
                'email' => 'carlos@intranet.test',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'user',
                'department' => 'Operaciones',
                'position' => 'Jefe de Operaciones',
                'phone' => '+56 9 4567 8901',
                'location' => 'Valparaíso, Chile',
                'bio' => 'Ingeniero industrial a cargo de optimización de procesos.',
                'is_directory_visible' => true,
                'is_directory_featured' => true,
                'login_method' => 'email',
            ],
            [
                'name' => 'Ana Martínez',
                'email' => 'ana@intranet.test',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'user',
                'department' => 'Finanzas',
                'position' => 'Contadora Senior',
                'phone' => '+56 9 5678 9012',
                'location' => 'Santiago, Chile',
                'bio' => 'Contadora con especialización en análisis financiero.',
                'is_directory_visible' => true,
                'is_directory_featured' => false,
                'login_method' => 'email',
            ],
            [
                'name' => 'Pedro Sánchez',
                'email' => 'pedro@intranet.test',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'user',
                'department' => 'Tecnología',
                'position' => 'Desarrollador Full Stack',
                'phone' => '+56 9 6789 0123',
                'location' => 'Santiago, Chile',
                'bio' => 'Desarrollador apasionado por Laravel y React.',
                'is_directory_visible' => true,
                'is_directory_featured' => false,
                'login_method' => 'email',
            ],
            [
                'name' => 'Laura Díaz',
                'email' => 'laura@intranet.test',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'user',
                'department' => 'Recursos Humanos',
                'position' => 'Coordinadora de Capacitación',
                'phone' => '+56 9 7890 1234',
                'location' => 'Concepción, Chile',
                'bio' => 'Especialista en desarrollo organizacional y capacitación.',
                'is_directory_visible' => true,
                'is_directory_featured' => false,
                'login_method' => 'email',
            ],
            [
                'name' => 'Test Oculto',
                'email' => 'hidden@intranet.test',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'role' => 'user',
                'department' => 'Pruebas',
                'position' => 'Usuario de prueba',
                'phone' => null,
                'location' => null,
                'bio' => 'Este usuario no debe aparecer en el directorio.',
                'is_directory_visible' => false,
                'is_directory_featured' => false,
                'login_method' => 'email',
            ],
        ];

        foreach ($additionalUsers as $newUser) {
            User::firstOrCreate(['email' => $newUser['email']], $newUser);
        }
    }
}
