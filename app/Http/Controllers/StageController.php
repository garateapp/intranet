<?php

namespace App\Http\Controllers;

use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

/**
 * Controller para gestionar las etapas globales del pipeline.
 * Permite crear, editar y eliminar etapas que se reutilizan en múltiples vacantes.
 */
class StageController extends Controller
{
    /**
     * Listar todas las etapas disponibles.
     */
    public function index()
    {
        $stages = Stage::withCount('vacancies')->ordered()->get();

        return Inertia::render('ATS/Stages/Index', [
            'stages' => $stages,
        ]);
    }

    /**
     * Almacenar una nueva etapa.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Stage::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:stages,name'],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'is_default' => ['boolean'],
        ]);

        $validated['is_default'] = $validated['is_default'] ?? false;
        $validated['sort_order'] = Stage::max('sort_order') + 1;

        Stage::create($validated);

        return redirect()->route('ats.stages.index')
            ->with('success', 'Etapa creada exitosamente.');
    }

    /**
     * Actualizar una etapa existente.
     */
    public function update(Request $request, Stage $stage)
    {
        $this->authorize('update', $stage);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:stages,name,' . $stage->id],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'is_default' => ['boolean'],
        ]);

        $stage->update($validated);

        return redirect()->route('ats.stages.index')
            ->with('success', 'Etapa actualizada exitosamente.');
    }

    /**
     * Eliminar una etapa.
     * No permite eliminar etapas que estén en uso por vacantes activas.
     */
    public function destroy(Stage $stage)
    {
        $this->authorize('delete', $stage);

        // Verificar que no haya vacantes activas usando esta etapa
        if ($stage->vacancies()->where('status', 'active')->exists()) {
            throw ValidationException::withMessages([
                'stage' => 'No se puede eliminar esta etapa porque está siendo utilizada por vacantes activas.',
            ]);
        }

        $stage->delete();

        return redirect()->route('ats.stages.index')
            ->with('success', 'Etapa eliminada exitosamente.');
    }

    /**
     * Reordenar etapas (drag & drop en la configuración).
     */
    public function reorder(Request $request)
    {
        $this->authorize('manage', Stage::class);

        $validated = $request->validate([
            'stages' => ['required', 'array'],
            'stages.*.id' => ['required', 'exists:stages,id'],
            'stages.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['stages'] as $item) {
            Stage::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['success' => true]);
    }
}
