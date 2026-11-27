<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('charge_id');
        });

        Schema::dropIfExists('charge_pauses');
        Schema::dropIfExists('charge_product');
        Schema::dropIfExists('charges');
    }

    public function down(): void
    {
        // Irreversible: charges data is dropped. Restore from the original create_charges migrations if needed.
    }
};
