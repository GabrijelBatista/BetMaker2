<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Models\User;
use App\Models\Template;
use App\Models\Background;
use App\Models\Role;
use App\Models\Aspect;
use App\Models\Resolution;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthenticationController extends Controller
{
    public function register(Request $request){


        $request->validate([
            'email'=>'required|email|unique:users',
            'password'=>'required|min:8|confirmed',
            'password_confirmation'=>'required'
        ]);

        User::create([
            'email'=>$request->email,
            'password'=>Hash::make($request->password)
        ]);

            return response()->json(Auth::user(), 200);



    }

    public function login(Request $request){

        $request->validate([
            'email'=>'required',
            'password'=>'required'
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            $user=Auth::user();

            $users_list=null;

            if($user->role_id===3){
                $users_list=User::get()->all();

                $resolutions = [];
                $resolutions2 = Resolution::orderBy('id', 'asc')->select('width', 'height')->get();
                foreach($resolutions2 as $resolution){
                    $res=$resolution->width."x".$resolution->height;
                    array_push($resolutions, $res);
                }

                $aspects = Aspect::orderBy('id', 'asc')->select('name')->get();
                $roles = Role::orderBy('id', 'asc')->select('name')->get();
            }

            $templates = Template::orderBy('aspect_id', 'asc')->get()->all();
            $my_templates = [];
            $other_templates = [];

            foreach($templates as $template){
                $template->url="/template".$template->id;
                if($template->user_id===$user->id){
                    array_push($my_templates, $template);
                }
                else{
                    if($user->role_id===3){
                        array_push($other_templates, $template);
                    }
                    else{
                        if($template->user_id===1){
                            array_push($other_templates, $template);
                        }
                    }
                }
            }

            if($my_templates!=null){
                $current_template=$my_templates[0];
            }
            elseif($other_templates!=null){
                $current_template=$other_templates[0];
            }
            else{
                $current_template=null;
            }

            $backgrounds = Background::orderBy('id', 'asc')->get()->all();
            $my_backgrounds = [];
            $other_backgrounds = [];

            foreach($backgrounds as $background){
                $background->path="storage/backgrounds/".$background->name;
                if($background->user_id===$user->id){
                    array_push($my_backgrounds, $background);
                }
                else{
                    array_push($other_backgrounds, $background);
                }
            }
            $current_background=null;
            if($my_backgrounds!=null){
                $current_background=$my_backgrounds[0];
            }
            elseif($other_backgrounds!=null){
                $current_background=$other_backgrounds[0];
            }
            else{
                $current_background=null;
            }
            if($user->role_id===3){
                return response()->json(['current_background'=>$current_background, 'current_template'=>$current_template, 'users_list'=>$users_list, 'roles'=>$roles, 'aspects'=>$aspects, 'resolutions'=>$resolutions, 'user'=>$user, 'my_templates'=>$my_templates, 'other_templates'=>$other_templates, 'my_backgrounds'=>$my_backgrounds, 'other_backgrounds'=>$other_backgrounds], 200);
            }
            else{
                return response()->json(['current_background'=>$current_background, 'current_template'=>$current_template, 'user'=>$user, 'my_templates'=>$my_templates, 'other_templates'=>$other_templates, 'my_backgrounds'=>$my_backgrounds, 'other_backgrounds'=>$other_backgrounds], 200);
            }
        }

        return back()->withErrors([
            'error' => 'Podaci nisu točni.',
        ]);
    }


    public function logout(Request $request){

        Auth::logout();
    }
}
