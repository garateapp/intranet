<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Agrega el tipo de puesto "obra", la renta líquida y las semanas de
 * ingreso/salida a la tabla de vacantes.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE vacancies MODIFY job_type ENUM('full_time', 'part_time', 'contract', 'obra') NOT NULL DEFAULT 'full_time'");

        Schema::table('vacancies', function (Blueprint $table) {
            $table->decimal('renta_liquida', 12, 2)->nullable()->after('salary');
            $table->unsignedTinyInteger('entry_week')->nullable()->after('renta_liquida');
            $table->smallInteger('entry_week_year')->nullable()->after('entry_week');
            $table->unsignedTinyInteger('exit_week')->nullable()->after('entry_week_year');
            $table->smallInteger('exit_week_year')->nullable()->after('exit_week');
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn(['exit_week_year', 'exit_week', 'entry_week_year', 'entry_week', 'renta_liquida']);
        });

        DB::statement("ALTER TABLE vacancies MODIFY job_type ENUM('full_time', 'part_time', 'contract') NOT NULL DEFAULT 'full_time'");
    }
};