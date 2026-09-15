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
        Schema::create('return_entry_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_entry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('purchase_entry_item_id')->constrained()->restrictOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('purchase_price');
            $table->unsignedInteger('subtotal');
            $table->timestamps();

            $table->index(['return_entry_id']);
            $table->index(['purchase_entry_item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_entry_items');
    }
};
