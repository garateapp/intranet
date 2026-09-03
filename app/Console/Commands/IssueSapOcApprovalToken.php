<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class IssueSapOcApprovalToken extends Command
{
    protected $signature = 'sap:issue-oc-approval-token {email} {--name=SAP OC Approval Sync}';

    protected $description = 'Emite un token Sanctum limitado a la sincronización SAP de facturas';

    public function handle(): int
    {
        $user = User::where('email', $this->argument('email'))->first();
        if (! $user) {
            $this->error('No existe un usuario con ese email.');

            return self::FAILURE;
        }

        $token = $user->createToken((string) $this->option('name'), ['sap:oc-approvals:sync']);
        $this->warn('Guarda este token ahora; no volverá a mostrarse:');
        $this->line($token->plainTextToken);

        return self::SUCCESS;
    }
}
