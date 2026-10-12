<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('storefront_section_products', function (Blueprint $table) {
            $table->id();
            $table->string('section', 32);
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('label', 60)->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->unique(['section', 'product_id']);
            $table->index(['section', 'position']);
        });

        if (Schema::hasTable('storefront_best_offers')) {
            DB::table('storefront_section_products')->insertUsing(
                ['section', 'product_id', 'position', 'created_at', 'updated_at'],
                DB::table('storefront_best_offers')->selectRaw("'best_offers', product_id, position, created_at, updated_at")
            );

            Schema::drop('storefront_best_offers');
        }

        Schema::create('storefront_features', function (Blueprint $table) {
            $table->id();
            $table->string('title', 80);
            $table->string('description', 200)->nullable();
            $table->string('image_path');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('storefront_promo_banners', function (Blueprint $table) {
            $table->id();
            $table->string('eyebrow', 60)->nullable();
            $table->string('title', 100);
            $table->string('description', 200)->nullable();
            $table->string('button_label', 30)->default('Acheter');
            $table->string('link_url')->nullable();
            $table->boolean('highlight')->default(false);
            $table->string('image_path');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('storefront_promo_banners');
        Schema::dropIfExists('storefront_features');
        Schema::dropIfExists('storefront_section_products');
    }
};
