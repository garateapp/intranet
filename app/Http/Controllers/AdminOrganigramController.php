<?php

namespace App\Http\Controllers;

use App\Models\OrganigramImport;
use App\Services\OrganigramCsvImporter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class AdminOrganigramController extends Controller
{
    public function __construct(
        private readonly OrganigramCsvImporter $importer
    ) {
    }

    public function index(): Response
    {
        $currentImport = OrganigramImport::with('uploader')
            ->where('is_current', true)
            ->latest('id')
            ->first();

        return Inertia::render('AdminOrganigram/Index', [
            'currentImport' => $currentImport,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt'],
        ]);

        try {
            $snapshot = $this->importer->importFromFile($validated['file']->getRealPath());
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors([
                'file' => $exception->getMessage(),
            ]);
        }

        DB::transaction(function () use ($request, $validated, $snapshot): void {
            OrganigramImport::query()->where('is_current', true)->update(['is_current' => false]);

            $storedPath = $validated['file']->store('organigrams');

            OrganigramImport::create([
                'original_filename' => $validated['file']->getClientOriginalName(),
                'stored_filename' => $storedPath,
                'uploaded_by' => $request->user()->id,
                'row_count' => $snapshot['source']['row_count'],
                'snapshot_json' => $snapshot,
                'is_current' => true,
            ]);
        });

        return redirect()
            ->route('admin.organigram.index')
            ->with('success', 'Organigrama actualizado correctamente.');
    }
}
