<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\Aspect;
use App\Models\Resolution;
use App\Models\User;

class SuperadminController extends Controller
{
    public function get_superadmin_resources(){

        $users_list=User::get()->all();

        $resolutions = [];
        $resolutions2 = Resolution::orderBy('id', 'asc')->select('width', 'height')->get();
        foreach($resolutions2 as $resolution){
            $res=$resolution->width."x".$resolution->height;
            array_push($resolutions, $res);
        }

        $aspects = Aspect::orderBy('id', 'asc')->select('name')->get();
        $roles = Role::orderBy('id', 'asc')->select('name')->get();

        return response()->json(['users_list'=>$users_list, 'roles'=>$roles, 'aspects'=>$aspects, 'resolutions'=>$resolutions], 200);

    }

    public function add_role(Request $request){
        $request->validate([
            'name'=>'required|unique:roles',
        ]);

        Role::create([
            'name'=>$request->name,
        ]);

        $roles = Role::orderBy('id', 'asc')->get()->only('name');;
        return response()->json($roles, 200);

    }

    public function add_aspect(Request $request){
        $request->validate([
            'name'=>'required|unique:roles',
        ]);

        Aspect::create([
            'name'=>$request->name,
        ]);

        $aspects = Aspect::orderBy('id', 'asc')->get()->only('name');;
        return response()->json($aspects, 200);

    }

    public function add_resolution(Request $request){
        $request->validate([
            'width'=>'required',
            'height'=>'required',
            'aspect'=>'required',
        ]);

        $aspect = Aspect::select('id')->where('name', $request->aspect)->get()->first();
        $aspect_id = $aspect->id;

        Resolution::create([
            'width'=>$request->width,
            'height'=>$request->height,
            'aspect_id'=>$aspect_id,
        ]);

        $resolutions = [];
        $resolutions2 = Resolution::orderBy('id', 'asc')->select('width', 'height')->get();
        foreach($resolutions2 as $resolution){
            $res=$resolution->width."x".$resolution->height;
            array_push($resolutions, $res);
        }
        return response()->json($resolutions, 200);

    }
}
