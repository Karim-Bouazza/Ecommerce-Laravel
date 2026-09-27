<?php

namespace Database\Seeders;

use App\Models\Communes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class CommunesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $content = File::get(database_path('data/communes.json'));

        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content);

        $communes = json_decode($content, true, 512, JSON_THROW_ON_ERROR);

        Schema::disableForeignKeyConstraints();
        Communes::truncate();

        foreach ($communes as $commune) {
            $arName = $commune['ar_name'] ?? null;
            if (!is_string($arName) || trim($arName) === '') {
                $arName = null;
            }

            Communes::create([
                'id' => $commune['id'],
                'wilaya_id' => $commune['wilaya_id'],
                'name' => $commune['name'],
                'ar_name' => $arName,
                'provider_id' => $commune['id'],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
