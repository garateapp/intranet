<?php

namespace App\Http\Controllers;

use App\Models\OrganigramImport;
use Inertia\Inertia;
use Inertia\Response;

class OrganigramController extends Controller
{
    public function index(): Response
    {
        $currentImport = OrganigramImport::query()
            ->where('is_current', true)
            ->latest('id')
            ->first();

        $snapshot = $this->normalizeSnapshot($currentImport?->snapshot_json);


        return Inertia::render('Organigram/Index', [
            'snapshot' => $snapshot,
            'currentImport' => $currentImport ? [
                'original_filename' => $currentImport->original_filename,
                'row_count' => $currentImport->row_count,
                'created_at' => $currentImport->created_at?->toIso8601String(),
            ] : null,
            'legacySnapshot' => $this->isLegacySnapshot($currentImport?->snapshot_json),
        ]);
    }

    private function normalizeSnapshot(null|array $snapshot): ?array
    {
        if ($snapshot === null) {
            return null;
        }

        $snapshot['companies'] = collect($snapshot['companies'] ?? [])
            ->map(function (array $company) {
                if (! array_key_exists('roots', $company) || ! is_array($company['roots'])) {
                    $company['roots'] = [];
                }

                return $company;
            })
            ->values()
            ->all();

        return $snapshot;
    }

    private function isLegacySnapshot(null|array $snapshot): bool
    {
        if ($snapshot === null) {
            return false;
        }

        foreach ($snapshot['companies'] ?? [] as $company) {
            if (array_key_exists('cost_centers', $company) && ! array_key_exists('roots', $company)) {
                return true;
            }
        }

        return false;
    }
}
