<?php

namespace Database\Seeders;

use App\Models\OnboardingStage;
use App\Models\OnboardingTask;
use App\Models\Service;
use App\Models\RequestType;
use Illuminate\Database\Seeder;

class Phase2ContentSeeder extends Seeder
{
    public function run(): void
    {
        // === ONBOARDING ===
        $bienvenida = OnboardingStage::create([
            'title' => 'Bienvenida',
            'description' => 'Primeros pasos en la empresa',
            'sort_order' => 1,
            'is_active' => true,
            'target_role' => null,
        ]);

        OnboardingTask::create([
            'onboarding_stage_id' => $bienvenida->id,
            'title' => 'Revisa el manual de bienvenida',
            'description' => 'Lee el documento de bienvenida para conocer la cultura y valores de la empresa.',
            'task_type' => 'resource',
            'resource_url' => null,
            'sort_order' => 1,
            'is_required' => true,
            'is_active' => true,
        ]);

        OnboardingTask::create([
            'onboarding_stage_id' => $bienvenida->id,
            'title' => 'Conoce a tu equipo',
            'description' => 'Revisa el directorio de personas y conoce a tus compañeros de equipo.',
            'task_type' => 'link',
            'resource_url' => '/directory',
            'sort_order' => 2,
            'is_required' => true,
            'is_active' => true,
        ]);

        $herramientas = OnboardingStage::create([
            'title' => 'Herramientas',
            'description' => 'Acceso a las herramientas que necesitarás',
            'sort_order' => 2,
            'is_active' => true,
            'target_role' => null,
        ]);

        OnboardingTask::create([
            'onboarding_stage_id' => $herramientas->id,
            'title' => 'Configura tu acceso a Buk',
            'description' => 'Accede a Buk RRHH para gestionar tus vacaciones, permisos y liquidaciones.',
            'task_type' => 'link',
            'resource_url' => '/rrhh',
            'sort_order' => 1,
            'is_required' => true,
            'is_active' => true,
        ]);

        OnboardingTask::create([
            'onboarding_stage_id' => $herramientas->id,
            'title' => 'Explora la intranet',
            'description' => 'Conoce las secciones de la intranet: noticias, documentos, servicios y más.',
            'task_type' => 'checklist',
            'resource_url' => null,
            'sort_order' => 2,
            'is_required' => false,
            'is_active' => true,
        ]);

        OnboardingTask::create([
            'onboarding_stage_id' => $herramientas->id,
            'title' => '¿Cómo solicitar vacaciones?',
            'description' => 'Las vacaciones se solicitan directamente en Buk. Ingresa a RRHH desde la intranet.',
            'task_type' => 'faq',
            'resource_url' => null,
            'sort_order' => 3,
            'is_required' => false,
            'is_active' => true,
        ]);

        // === SERVICES ===
        $services = [
            ['name' => 'Correo Corporativo', 'slug' => 'correo', 'status' => 'operativo', 'description' => 'Servicio de correo electrónico empresarial', 'sort_order' => 1],
            ['name' => 'Intranet', 'slug' => 'intranet', 'status' => 'operativo', 'description' => 'Portal interno de la empresa', 'sort_order' => 2],
            ['name' => 'VPN', 'slug' => 'vpn', 'status' => 'operativo', 'description' => 'Acceso remoto seguro a la red corporativa', 'sort_order' => 3],
            ['name' => 'Buk RRHH', 'slug' => 'buk-rrhh', 'status' => 'operativo', 'description' => 'Plataforma de gestión de recursos humanos', 'sort_order' => 4],
            ['name' => 'ERP', 'slug' => 'erp', 'status' => 'operativo', 'description' => 'Sistema de planificación de recursos empresariales', 'sort_order' => 5],
            ['name' => 'Mesa de Ayuda', 'slug' => 'mesa-ayuda', 'status' => 'operativo', 'description' => 'Sistema de tickets y soporte técnico', 'sort_order' => 6],
            ['name' => 'CRM', 'slug' => 'crm', 'status' => 'operativo', 'description' => 'Gestión de relaciones con clientes', 'sort_order' => 7],
            ['name' => 'Servidor de Archivos', 'slug' => 'servidor-archivos', 'status' => 'operativo', 'description' => 'Almacenamiento compartido de documentos', 'sort_order' => 8],
        ];

        foreach ($services as $svc) {
            Service::create(array_merge($svc, [
                'status_message' => null,
                'last_checked_at' => now(),
                'is_active' => true,
                'is_public' => true,
            ]));
        }

        // === REQUEST TYPES ===
        $requestTypes = [
            ['name' => 'Solicitud de Acceso', 'slug' => 'acceso', 'description' => 'Solicitud de acceso a sistemas o herramientas', 'sort_order' => 1],
            ['name' => 'Compra de Equipos', 'slug' => 'compra-equipos', 'description' => 'Solicitud de compra de equipos tecnológicos', 'sort_order' => 2],
            ['name' => 'Permiso Especial', 'slug' => 'permiso-especial', 'description' => 'Solicitud de permisos no contemplados en Buk', 'sort_order' => 3],
            ['name' => 'Capacitación', 'slug' => 'capacitacion', 'description' => 'Solicitud de cursos o capacitaciones externas', 'sort_order' => 4],
            ['name' => 'Reembolso', 'slug' => 'reembolso', 'description' => 'Solicitud de reembolso de gastos', 'sort_order' => 5],
        ];

        foreach ($requestTypes as $type) {
            \App\Models\RequestType::create(array_merge($type, ['is_active' => true]));
        }
    }
}
