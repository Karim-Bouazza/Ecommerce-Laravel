<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    private const SOURCES = [
        ['table' => 'products', 'model' => 'App\Models\Catalog\Product', 'column' => 'image_1', 'collection' => 'image_1'],
        ['table' => 'products', 'model' => 'App\Models\Catalog\Product', 'column' => 'image_2', 'collection' => 'image_2'],
        ['table' => 'products', 'model' => 'App\Models\Catalog\Product', 'column' => 'image_3', 'collection' => 'image_3'],
        ['table' => 'products', 'model' => 'App\Models\Catalog\Product', 'column' => 'image_4', 'collection' => 'image_4'],
        ['table' => 'users', 'model' => 'App\Models\Users\User', 'column' => 'avatar', 'collection' => 'avatar'],
        ['table' => 'storefront_features', 'model' => 'App\Models\Storefront\StorefrontFeature', 'column' => 'image_path', 'collection' => 'image'],
        ['table' => 'storefront_promo_banners', 'model' => 'App\Models\Storefront\StorefrontPromoBanner', 'column' => 'image_path', 'collection' => 'image'],
        ['table' => 'storefront_hero_categories', 'model' => 'App\Models\Storefront\StorefrontHeroCategory', 'column' => 'image_path', 'collection' => 'image'],
    ];

    public function up(): void
    {
        $disk = Storage::disk('public');

        foreach (self::SOURCES as $source) {
            $rows = DB::table($source['table'])->whereNotNull($source['column'])->get(['id', $source['column']]);

            foreach ($rows as $row) {
                $path = $row->{$source['column']};

                if (! $path || ! $disk->exists($path)) {
                    continue;
                }

                $model = $source['model']::query()->find($row->id);

                $model?->addMedia($disk->path($path))
                    ->preservingOriginal()
                    ->toMediaCollection($source['collection']);
            }
        }

        foreach (self::SOURCES as $source) {
            if (Schema::hasColumn($source['table'], $source['column'])) {
                Schema::table($source['table'], fn (Blueprint $table) => $table->dropColumn($source['column']));
            }
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('image_1')->nullable();
            $table->string('image_2')->nullable();
            $table->string('image_3')->nullable();
            $table->string('image_4')->nullable();
        });

        Schema::table('users', fn (Blueprint $table) => $table->string('avatar')->nullable());
        Schema::table('storefront_features', fn (Blueprint $table) => $table->string('image_path')->nullable());
        Schema::table('storefront_promo_banners', fn (Blueprint $table) => $table->string('image_path')->nullable());
        Schema::table('storefront_hero_categories', fn (Blueprint $table) => $table->string('image_path')->nullable());
    }
};
