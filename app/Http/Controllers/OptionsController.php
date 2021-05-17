<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Resolution;


class OptionsController extends Controller
{
    public function get_template_resolutions(Request $request){
        $request->validate([
            'aspect_id'=>'required',
        ]);

        $template_resolutions=Resolution::where('aspect_id', $request->get('aspect_id'))->select('width', 'height', 'aspect_id', 'id')->get();

        return response()->json(['template_resolutions'=>$template_resolutions], 200);
    }

    public function change_resolution(Request $request){
        $request->validate([
            'width'=>'required',
            'height'=>'required',
            'aspect_id'=>'required'
        ]);

        $current_resolution=Resolution::where('aspect_id', $request->get('aspect_id'))->where('width', $request->get('width'))->where('height', $request->get('height'))->select('width', 'height', 'aspect_id', 'id')->first();

        return response()->json(['current_resolution'=>$current_resolution], 200);
    }
}
