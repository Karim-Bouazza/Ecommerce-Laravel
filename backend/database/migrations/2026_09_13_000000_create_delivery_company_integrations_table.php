<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_company_integrations', function (Blueprint $table) {
            $table->id();
            $table->string('company_key')->unique();
            $table->string('name');
            $table->string('base_url');
            $table->text('api_token');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_company_integrations');
    }
};
