<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Template;
use App\Models\Aspect;
use App\Models\Background;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Image;
use File;

class TemplatesController extends Controller
{
    public function get_templates(){

        $user=Auth::user();
            $my_templates = Template::where('user_id', $user->id)->orderBy('aspect_id', 'asc')->paginate(21);
            if($user->role_id===1){
                $other_templates = Template::where('user_id', '!=', $user->id)->orderBy('aspect_id', 'asc')->paginate(21);
            }
            else{
                $other_templates = Template::where('user_id', 1)->orderBy('aspect_id', 'asc')->paginate(21);
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

            if($user->role_id==1){
                $backgrounds_list=Background::get()->all();
                $aspects_list=Aspect::get()->all();
                $users_list=User::get()->all();
                return response()->json(['aspects_list'=>$aspects_list, 'users_list'=>$users_list, 'backgrounds_list'=>$backgrounds_list, 'current_template'=>$current_template, 'my_templates'=>$my_templates, 'other_templates'=>$other_templates], 200);
            }
            else{
                return response()->json(['current_template'=>$current_template, 'my_templates'=>$my_templates, 'other_templates'=>$other_templates], 200);
            }
    }

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
        $name_trimed = str_replace(" ", "_", $request->name);
        Template::create([
            'name'=>$request->name,
            'user_id'=>$user_id,
            'max_matches'=>$request->max_matches,
            'aspect_id'=>$aspect_id,
            'url'=>url($name_trimed),
        ]);

        return response()->json(200);

    }

    public function edit_template(Request $request){


        $template=Template::where('id', $request->id)->first();

        if($request->name!="null"){
            $template->name=$request->name;
        }

        if($request->max_matches!="null"){
            $template->max_matches=$request->max_matches;
        }

        if($request->aspect!="null"){
            $aspect = Aspect::select('id')->where('name', $request->aspect)->first();
            $template->aspect_id=$aspect['id'];
        }

        if($request->user!="null"){
            $user = User::select('id')->where('email', $request->user)->first();
            $template->user_id=$user['id'];
        }

        if($request->default_background!="null"){
            $background = Background::select('id')->where('name', $request->default_background)->first();
            $template->background_id=$background['id'];
        }

        if($request->file('example_image')!=null){
            $filenameWithExt = $request->file('example_image')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('example_image')->getClientOriginalExtension();
            $nameStore = $template['id'].$filename.'_'.time().'.'.$extension;
            $image = Image::make($request->file('example_image')->getRealPath());
            $image->save(public_path().'/storage/example_images/'.$nameStore);
            $template->example_image=$nameStore;
        }

        $template->save();

        return response()->json(200);

    }

    public function delete_template(Request $request){
        $request->validate([
            'template_id'=>'required',
        ]);

        $template=Template::where('id', $request->template_id)->first();

        if($template->example_image) {
            $path = public_path() . '/storage/example_images/' . $template->example_image;
            if (File::exists($path)) {
                $file_path = $path;
                unlink($file_path);
            }
        }
        Template::where('id', $request->template_id)->delete();

        return response()->json(200);
    }
}
