<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('templates')->insert([
            'name' => 'Vote Story',
            'user_id' => 1,
            'max_matches' => 1,
            'url' => 'Vote_Story',
            'aspect_id' => 1,
            'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
            'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
        ]);
    }
}
