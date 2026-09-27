<?php

namespace Database\Seeders;

use App\Models\Wilaya;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class WilayaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wilayas = json_decode(File::get(database_path('data/wilayas.json')), true);

        Schema::disableForeignKeyConstraints();
        Wilaya::truncate();

        foreach ($wilayas as $wilaya) {
            Wilaya::create([
                'code' => $wilaya['code'],
                'name' => $wilaya['name'],
                'ar_name' => $wilaya['ar_name'] ?? null,
                'provider_id' => (int) $wilaya['id'],
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
