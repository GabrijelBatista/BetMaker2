<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;
use File;

class TeamsController extends Controller
{
    public function get_teams(){
        $user=Auth::user();
        $my_teams = Team::where('user_id', $user->id)->orderBy('created_at', 'desc')->get()->all();
        if($user->role_id===3){
            $other_teams = Team::where('user_id', '!=', $user->id)->orderBy('created_at', 'desc')->get()->all();
        }
        else{
            $other_teams = Team::where('user_id', 1)->orderBy('created_at', 'desc')->get()->all();
        }

        return response()->json(['my_teams'=>$my_teams, 'other_teams'=>$other_teams], 200);

    }

    public function add_team(Request $request){
        $request->validate([
            'title'=>'required',
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
            $image->save(public_path().'/storage/teams/'.$nameStore);
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

        Team::create([
            'name'=>$request->name,
            'title'=>$request->title,
            'user_id'=>$user_id,
            'logo'=>$nameStore,
        ]);

        $user=Auth::user();
        $my_teams = Team::where('user_id', $user->id)->orderBy('name', 'asc')->get()->all();
        if($user->role_id===3){
            $other_teams = Team::where('user_id', '!=', $user->id)->orderBy('name', 'asc')->get()->all();
        }
        else{
            $other_teams = Team::where('user_id', 1)->orderBy('name', 'asc')->get()->all();
        }


        return response()->json(['my_teams'=>$my_teams, 'other_teams'=>$other_teams], 200);
    }

    public function delete_team(Request $request){
        $request->validate([
            'team_id'=>'required',
        ]);

        $team=Team::where('id', $request->team_id)->first();

        $path = public_path().'/storage/teams/'.$team->logo;
        if(File::exists($path)) {
            $file_path=$path;
            unlink($file_path);
        }

        Team::where('id', $request->team_id)->delete();

        $teams = Team::orderBy('created_at', 'desc')->get()->all();
        $my_teams = [];
        $other_teams = [];
        $user=Auth::user();
        foreach($teams as $team){
            if($team->user_id===$user->id){
                array_push($my_teams, $team);
            }
            else if($user->role_id===3){
                array_push($other_teams, $team);
            }
            else if($team->user_id===1){
                array_push($other_teams, $team);
            }
        }


        return response()->json(['my_teams'=>$my_teams, 'other_teams'=>$other_teams], 200);
    }

}
