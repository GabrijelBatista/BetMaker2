<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Template;
use App\Models\Aspect;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Image;

class TemplatesController extends Controller
{
    public function add_template(Request $request){
        $request->validate([
            'name'=>'required|unique:templates',
            'user'=>'required',
            'max_matches'=>'required|numeric',
            'aspect'=>'required',
        ]);

        $aspect = Aspect::select('id')->where('name', $request->aspect)->get()->first();
        $aspect_id = $aspect->id;

        $user = User::select('id')->where('email', $request->user)->get()->first();
        $user_id = $user->id;

        Template::create([
            'name'=>$request->name,
            'user_id'=>$user_id,
            'max_matches'=>$request->max_matches,
            'aspect_id'=>$aspect_id,
        ]);


        $user=Auth::user();
        $templates = Template::orderBy('aspect_id', 'asc')->get()->all();
        $my_templates = [];
        $other_templates = [];

        foreach($templates as $template){
            $template->url="/template".$template->id;
            if($template->user_id===$user->id){
                array_push($my_templates, $template);
            }
            else{
                array_push($other_templates, $template);
            }
        }


        return response()->json(['my_templates'=>$my_templates, 'other_templates'=>$other_templates], 200);

    }

    public function edit_template(Request $request){


        $template=Template::where('id', $request->id)->get()->first();

        if($request->name!=null){
            $template->name=$request->name;
        }

        if($request->max_matches!=null){
            $template->max_matches=$request->max_matches;
        }

        if($request->aspect!=null){
            $aspect = Aspect::select('id')->where('name', $request->aspect)->get()->first();
            $aspect_id = $aspect->id;
            $template->aspect_id=$aspect_id;
        }
        else{
            $aspect_id=$template->aspect_id;
        }

        if($request->user!=null){
            $user = User::select('id')->where('email', $request->user)->get()->first();
            $user_id = $user->id;
            $template->user_id=$user_id;
        }
        else{
            $user_id=$template->user_id;
        }

        if($request->example_image!=null){
            $filenameWithExt = $request->file('example_image')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('example_image')->getClientOriginalExtension();
            $nameStore = $user['id'].$user['email'].$filename.'_'.time().'.'.$extension;
            $image = Image::make($request->file('example_image')->getRealPath());
            $image->save(public_path().'/storage/example_images/'.$nameStore);
            $template->example_image=$request->$nameStore;
        }

        if($request->default_background!=null){
            $filenameWithExt2 = $request->file('default_background')->getClientOriginalName();
            $filename2 = pathinfo($filenameWithExt2, PATHINFO_FILENAME);
            $extension2 = $request->file('default_background')->getClientOriginalExtension();
            $nameStore2 = 'default'.$user['id'].$user['email'].$filename2.'_'.time().'.'.$extension2;
            $image2 = Image::make($request->file('default_background')->getRealPath());
            $image2->save(public_path().'/storage/backgrounds/'.$nameStore2);
            $template->default_background=$request->$nameStore2;
        }


        $template->save();


        $user=Auth::user();
        $templates = Template::orderBy('aspect_id', 'asc')->get()->all();
        $my_templates = [];
        $other_templates = [];

        foreach($templates as $template){
            $template->url="/template".$template->id;
            if($template->user_id===$user->id){
                array_push($my_templates, $template);
            }
            else{
                array_push($other_templates, $template);
            }
        }


        return response()->json(['template'=>$template, 'my_templates'=>$my_templates, 'other_templates'=>$other_templates], 200);

    }

    public function delete_template(Request $request){
        $request->validate([
            'template_id'=>'required',
        ]);

        Template::where('id', $request->template_id)->delete();

        $templates = Template::orderBy('aspect_id', 'asc')->get()->all();
        $my_templates = [];
        $other_templates = [];
        $user=Auth::user();
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


        return response()->json(['my_templates'=>$my_templates, 'other_templates'=>$other_templates], 200);
    }
}
