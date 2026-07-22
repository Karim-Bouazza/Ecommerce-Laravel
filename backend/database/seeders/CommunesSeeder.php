<?php

namespace Database\Seeders;

use App\Models\Communes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

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

        foreach ($communes as $commune) {
            Communes::create([
                'wilaya_id' => $commune['wilaya_id'],
                'name' => $commune['name'],
            ]);
        }
    }
}
