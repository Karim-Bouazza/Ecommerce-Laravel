<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('stop_desk_company_id')->nullable()->after('stop_desk_name')
                ->constrained('delivery_companies')->nullOnDelete();
        });

        DB::table('orders')
            ->whereNotNull('stop_desk_name')
            ->where('stop_desk_name', '!=', '')
            ->select('stop_desk_name')
            ->distinct()
            ->get()
            ->each(function ($row) {
                $companyId = DB::table('delivery_companies')->where('name', $row->stop_desk_name)->value('id');

                if (! $companyId) {
                    $companyId = DB::table('delivery_companies')->insertGetId([
                        'name' => $row->stop_desk_name,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                DB::table('orders')
                    ->where('stop_desk_name', $row->stop_desk_name)
                    ->update(['stop_desk_company_id' => $companyId]);
            });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('stop_desk_name');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('stop_desk_name')->nullable()->after('delivery_type');
        });

        DB::table('orders')
            ->join('delivery_companies', 'delivery_companies.id', '=', 'orders.stop_desk_company_id')
            ->update(['orders.stop_desk_name' => DB::raw('delivery_companies.name')]);

        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('stop_desk_company_id');
        });
    }
};
