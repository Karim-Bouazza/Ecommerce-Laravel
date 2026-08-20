<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['wilaya_id']);
            $table->dropForeign(['commune_id']);

            $table->dropColumn([
                'first_name',
                'last_name',
                'phone_number',
                'wilaya_id',
                'commune_id',
            ]);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('client_id')
                ->after('id')
                ->constrained()
                ->restrictOnDelete();

            $table->string('reference')
                ->unique()
                ->after('client_id');

            $table->integer('subtotal')
                ->default(0)
                ->after('reference');

            $table->integer('delivery_price')
                ->default(0)
                ->after('subtotal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropColumn(['client_id', 'reference', 'subtotal', 'delivery_price']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number');

            $table->foreignId('wilaya_id')
                ->constrained()
                ->restrictOnDelete();
            $table->foreignId('commune_id')
                ->constrained()
                ->restrictOnDelete();
        });
    }
};
