<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ResolutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('resolutions')->insert([
            'width' => 1080,
            'height' => 1920,
            'aspect_id' => 1,
            'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
            'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
        ]);
        \DB::table('resolutions')->insert([
            'width' => 1080,
            'height' => 1080,
            'aspect_id' => 3,
            'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
            'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
        ]);
        \DB::table('resolutions')->insert([
            'width' => 1920,
            'height' => 1080,
            'aspect_id' => 2,
            'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
            'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
        ]);
        \DB::table('resolutions')->insert([
            'width' => 1200,
            'height' => 1200,
            'aspect_id' => 3,
            'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
            'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
        ]);
    }
}
