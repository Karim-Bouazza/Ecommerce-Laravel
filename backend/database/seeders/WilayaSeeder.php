<?php

namespace Database\Seeders;

use App\Models\Wilaya;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class WilayaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wilayas = json_decode(File::get(database_path('data/wilayas.json')), true);

        foreach ($wilayas as $wilaya) {
            Wilaya::create([
                'code' => $wilaya['code'],
                'name' => $wilaya['name'],
            ]);
        }
    }
}
