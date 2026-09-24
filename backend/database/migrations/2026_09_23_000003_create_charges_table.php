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
        Schema::create('charges', function (Blueprint $table) {
            $table->id();
            $table->enum('category', array_column(\App\Enums\ChargeCategory::cases(), 'value'));
            $table->enum('type', array_column(\App\Enums\ChargeType::cases(), 'value'))
                ->default(\App\Enums\ChargeType::Normal->value);
            $table->enum('order_trigger', array_column(\App\Enums\ChargeOrderTrigger::cases(), 'value'))->nullable();
            $table->enum('recurrence_frequency', array_column(\App\Enums\ChargeRecurrenceFrequency::cases(), 'value'))->nullable();
            $table->string('name');
            $table->unsignedInteger('amount');
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('charges');
    }
};
