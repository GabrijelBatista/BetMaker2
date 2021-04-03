<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Background;
use App\Models\Aspect;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;
use File;

class BackgroundsController extends Controller
{
    public function get_backgrounds(){
        $user=Auth::user();
        $my_backgrounds = Background::where('user_id', $user->id)->orderBy('created_at', 'desc')->get()->all();
        if($user->role_id===3){
            $other_backgrounds = Background::where('user_id', '!=', $user->id)->orderBy('created_at', 'desc')->get()->all();
        }
        else{
            $other_backgrounds = Background::where('user_id', 1)->orderBy('created_at', 'desc')->get()->all();
        }
        $current_background=null;
        if($my_backgrounds!=null){
                $current_background=$my_backgrounds[0];
        }
        elseif($other_backgrounds!=null){
            $current_background=$other_backgrounds[0];
        }


        return response()->json(['current_background'=>$current_background, 'my_backgrounds'=>$my_backgrounds, 'other_backgrounds'=>$other_backgrounds], 200);

    }

    public function add_background(Request $request){
        $request->validate([
            'name'=>'required',
            'image'=>'required|file|image|max:2048'
        ]);

        $user = Auth::user();

        $count=0;
        if($user->id!=1){
            $users_backgrounds=Background::where('user_id', $user->id)->get();
            foreach($users_backgrounds as $users_background){
                $count=$count+1;
            }
        }
        if($count>9){
            return back()->withErrors([
                'error' => 'Možete imati maksimalno 10 pozadina.',
            ]);
        }
        else{
            $filenameWithExt = $request->file('image')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('image')->getClientOriginalExtension();
            $nameStore = $user['id'].$user['email'].$filename.'_'.time().'.'.$extension;
            $image = Image::make($request->file('image')->getRealPath());
            $image->save(public_path().'/storage/backgrounds/'.$nameStore);




            $user_id=null;
            if($request->user===null){
                $user_id = $user->id;
            }
            else{
                $user2 = User::select('id')->where('email', $request->user)->get()->first();
                $user_id = $user2->id;
            }

            Background::create([
                'name'=>$nameStore,
                'user_id'=>$user_id,
            ]);

            $user=Auth::user();
            $my_backgrounds = Background::where('user_id', $user->id)->orderBy('created_at', 'desc')->get()->all();
            if($user->role_id===3){
                $other_backgrounds = Background::where('user_id', '!=', $user->id)->orderBy('created_at', 'desc')->get()->all();
            }
            else{
                $other_backgrounds = Background::where('user_id', 1)->orderBy('created_at', 'desc')->get()->all();
            }

            if($my_backgrounds!=null){
                $current_background=$my_backgrounds[0];
            }
            else{
                $current_background=$other_backgrounds[0];
            }


            return response()->json(['current_background'=>$current_background, 'my_backgrounds'=>$my_backgrounds, 'other_backgrounds'=>$other_backgrounds], 200);
        }
    }

    public function delete_background(Request $request){
        $request->validate([
            'background_id'=>'required',
        ]);

        $background=Background::where('id', $request->background_id)->first();

        $path = public_path().'/storage/backgrounds/'.$background->name;
        if(File::exists($path)) {
            $file_path=$path;
            unlink($file_path);
        }

        Background::where('id', $request->background_id)->delete();

        $backgrounds = Background::orderBy('created_at', 'desc')->get()->all();
        $my_backgrounds = [];
        $other_backgrounds = [];
        $user=Auth::user();
        foreach($backgrounds as $background){
            if($background->user_id===$user->id){
                array_push($my_backgrounds, $background);
            }
            else if($user->role_id===3){
                array_push($other_backgrounds, $background);
            }
            else if($background->user_id===1){
                array_push($other_backgrounds, $background);
            }
        }


        return response()->json(['my_backgrounds'=>$my_backgrounds, 'other_backgrounds'=>$other_backgrounds], 200);
    }
}
