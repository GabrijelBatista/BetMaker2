<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Background;
use App\Models\Aspect;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;

class BackgroundsController extends Controller
{
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

            $backgrounds = Background::orderBy('id', 'asc')->get()->all();
            $my_backgrounds = [];
            $other_backgrounds = [];
            $user=Auth::user();
            foreach($backgrounds as $background){
                $background->path="storage/backgrounds/".$background->name;
                if($background->user_id===$user->id){
                    array_push($my_backgrounds, $background);
                }
                else if($background->user_id===1){
                    array_push($other_backgrounds, $background);
                }
            }


            return response()->json(['my_backgrounds'=>$my_backgrounds, 'other_backgrounds'=>$other_backgrounds], 200);
        }
    }
}
