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
        Schema::create('meta_settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_id')->nullable();
            $table->text('app_secret')->nullable();
            $table->text('access_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->string('ad_account_id')->nullable();
            $table->string('ad_account_name')->nullable();
            $table->string('currency', 10)->nullable();
            $table->timestamps();
        });

        Schema::create('meta_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('meta_campaign_id')->unique();
            $table->string('name');
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meta_campaigns');
        Schema::dropIfExists('meta_settings');
    }
};
