<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BackgroundSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('backgrounds')->insert([
            'name' => 'Vote Story',
            'user_id' => 1,
            'url' => '1admin@admin.comBG_1621015134.png',
            'created_at' => \Carbon\Carbon::now()->toDateTimeString(),
            'updated_at' => \Carbon\Carbon::now()->toDateTimeString(),
        ]);
    }
}
