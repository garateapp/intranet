<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create FAQ categories
        $generalCategory = FaqCategory::create([
            'name' => 'General',
            'slug' => 'general',
            'description' => 'Preguntas generales sobre la empresa y la intranet',
            'icon' => 'info',
            'color' => '#038C34',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $rrhhCategory = FaqCategory::create([
            'name' => 'Recursos Humanos',
            'slug' => 'rrhh',
            'description' => 'Preguntas sobre RRHH, vacaciones, permisos y beneficios',
            'icon' => 'users',
            'color' => '#2563EB',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $tecnologiaCategory = FaqCategory::create([
            'name' => 'Tecnología',
            'slug' => 'tecnologia',
            'description' => 'Preguntas sobre sistemas, accesos y herramientas tecnológicas',
            'icon' => 'cpu',
            'color' => '#7C3AED',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        // Create FAQs for General category
        Faq::create([
            'faq_category_id' => $generalCategory->id,
            'question' => '¿Qué es la intranet y para qué sirve?',
            'answer' => 'La intranet es nuestra plataforma interna de comunicación y colaboración. Sirve para acceder a noticias, eventos, directorio de empleados, enlaces útiles y otros recursos importantes para el día a día en la empresa.',
            'sort_order' => 1,
            'is_published' => true,
        ]);

        Faq::create([
            'faq_category_id' => $generalCategory->id,
            'question' => '¿Cómo puedo actualizar mi perfil?',
            'answer' => 'Puedes actualizar tu perfil haciendo clic en tu nombre en la esquina superior derecha y seleccionando "Perfil". Desde ahí podrás modificar tu información de contacto, foto y otros datos.',
            'sort_order' => 2,
            'is_published' => true,
        ]);

        Faq::create([
            'faq_category_id' => $generalCategory->id,
            'question' => '¿Quién puede ver mi información en el directorio?',
            'answer' => 'Por defecto, tu información es visible para todos los usuarios autenticados en la intranet. Si prefieres que tu información no aparezca en el directorio, puedes solicitarlo al administrador del sistema.',
            'sort_order' => 3,
            'is_published' => true,
        ]);

        // Create FAQs for RRHH category
        Faq::create([
            'faq_category_id' => $rrhhCategory->id,
            'question' => '¿Cómo solicito vacaciones?',
            'answer' => 'Las vacaciones se solicitan directamente en la plataforma Buk. Ingresa a Buk desde el enlace "RRHH" en la intranet, luego navega a "Mis Vacaciones" y crea una nueva solicitud con las fechas deseadas.',
            'sort_order' => 1,
            'is_published' => true,
        ]);

        Faq::create([
            'faq_category_id' => $rrhhCategory->id,
            'question' => '¿Cómo descargo mis liquidaciones de sueldo?',
            'answer' => 'Tus liquidaciones de sueldo están disponibles en Buk. Ingresa a Buk y ve a "Mis Documentos" > "Liquidaciones" donde podrás descargar tus comprobantes mensuales en formato PDF.',
            'sort_order' => 2,
            'is_published' => true,
        ]);

        Faq::create([
            'faq_category_id' => $rrhhCategory->id,
            'question' => '¿Cómo solicito un permiso administrativo?',
            'answer' => 'Los permisos administrativos se solicitan a través de Buk. Ve a "Mis Permisos" y selecciona el tipo de permiso que necesitas. Tu jefe directo recibirá la solicitud para aprobación.',
            'sort_order' => 3,
            'is_published' => true,
        ]);

        Faq::create([
            'faq_category_id' => $rrhhCategory->id,
            'question' => '¿Qué beneficios tengo como empleado?',
            'answer' => 'Los beneficios varían según tu contrato y antigüedad. Puedes consultar tus beneficios específicos en Buk bajo la sección "Mis Beneficios". Para dudas adicionales, contacta a Recursos Humanos.',
            'sort_order' => 4,
            'is_published' => true,
        ]);

        // Create FAQs for Tecnología category
        Faq::create([
            'faq_category_id' => $tecnologiaCategory->id,
            'question' => '¿Olvidé mi contraseña, cómo la restablezco?',
            'answer' => 'Si olvidaste tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Recibirás un correo electrónico con un enlace para restablecerla. Si tienes problemas, contacta al equipo de Tecnología.',
            'sort_order' => 1,
            'is_published' => true,
        ]);

        Faq::create([
            'faq_category_id' => $tecnologiaCategory->id,
            'question' => '¿Cómo accedo al sistema de tickets de soporte?',
            'answer' => 'El sistema de tickets de soporte está disponible desde la sección "Enlaces Útiles" de la intranet o directamente en https://soporte.greenex.test. Allí puedes reportar problemas o solicitar servicios tecnológicos.',
            'sort_order' => 2,
            'is_published' => true,
        ]);

        Faq::create([
            'faq_category_id' => $tecnologiaCategory->id,
            'question' => '¿Puedo instalar software en mi computador de trabajo?',
            'answer' => "La instalación de software debe ser aprobada por el equipo de Tecnología. Si necesitas un programa específico, crea un ticket de soporte indicando el software y la justificación de uso.",
            'sort_order' => 3,
            'is_published' => true,
        ]);
    }
}
