<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Competition;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;
use File;

class CompetitionsController extends Controller
{

    public function get_competitions(){
        $user=Auth::user();
        $my_competitions = Competition::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(24);
        if($user->role_id===1){
            $other_competitions = Competition::where('user_id', '!=', $user->id)->orderBy('created_at', 'desc')->paginate(24);
        }
        else{
            $other_competitions = Competition::where('user_id', 1)->orderBy('created_at', 'desc')->paginate(24);
        }

        return response()->json(['my_competitions'=>$my_competitions, 'other_competitions'=>$other_competitions], 200);

    }

    public function add_competition(Request $request){
        $request->validate([
            'name'=>'required',
            'logo'=>'required|file|image|max:2048'
        ]);

        $user = Auth::user();
        if($request->file('logo')!=null){
            $filenameWithExt = $request->file('logo')->getClientOriginalName();
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('logo')->getClientOriginalExtension();
            $nameStore = $user['id'].$user['email'].$filename.'_'.time().'.'.$extension;
            $image = Image::make($request->file('logo')->getRealPath());
            $image->resize(400, 400, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            $image->save(public_path().'/storage/competitions/'.$nameStore);
        }
        else{
            $nameStore=null;
        }

        $user_id=null;
        if($request->user===null){
            $user_id = $user->id;
        }
        else{
            $user2 = User::select('id')->where('email', $request->user)->get()->first();
            $user_id = $user2->id;
        }

        Competition::create([
            'name'=>$request->name,
            'title'=>$request->title,
            'user_id'=>$user_id,
            'logo'=>$nameStore,
        ]);

        return response()->json(200);
    }

    public function delete_competition(Request $request){
        $request->validate([
            'competition_id'=>'required',
        ]);

        $competition=Competition::where('id', $request->competition_id)->first();

        $path = public_path().'/storage/competitions/'.$competition->logo;
        if(File::exists($path)) {
            $file_path=$path;
            unlink($file_path);
        }

        Competition::where('id', $request->competition_id)->delete();


        return response()->json(200);
    }

    public function autocomplete_competitions($competition_data){
        $user=Auth::user();
        $data_start= Competition::where( [['name', 'LIKE', '%'.$competition_data.'%'], ['user_id', $user->id]])
            ->orWhere([['title', 'LIKE', '%'.$competition_data.'%'], ['user_id', $user->id]])
            ->orWhere([['title', 'LIKE', '%'.$competition_data.'%'], ['user_id', 1]])
            ->orWhere([['title', 'LIKE', '%'.$competition_data.'%'], ['user_id', 1]])
            ->take(3)->get();
        $data=$data_start->unique();
        return response()->json($data);
    }

}
