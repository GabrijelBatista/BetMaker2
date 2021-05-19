<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Team;
use App\Models\Tag;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;
use File;

class TeamsController extends Controller
{
    public function get_teams(){
        $user=Auth::user();
        $my_teams = Team::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(24);
        if($user->role_id===1){
            $other_teams = Team::where('user_id', '!=', $user->id)->orderBy('created_at', 'desc')->paginate(24);
        }
        else{
            $other_teams = Team::where('user_id', 1)->orderBy('created_at', 'desc')->paginate(24);
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

        if($request->tags!=null){
            $team = Team::where('name', $request->name)->select('id')->get()->first();
            $tags=explode(",", $request->tags);
            foreach($tags as $tag){
                Tag::create([
                    'name'=>$tag,
                    'team_id'=>$team->id
                ]);
            }
        }

        return response()->json(200);
    }

    public function delete_team(Request $request){
        $request->validate([
            'team_id'=>'required',
        ]);

        Tag::where('team_id', $request->team_id)->delete();

        $team=Team::where('id', $request->team_id)->first();

        $path = public_path().'/storage/teams/'.$team->logo;
        if(File::exists($path)) {
            $file_path=$path;
            unlink($file_path);
        }

        Team::where('id', $request->team_id)->delete();

        return response()->json(200);
    }
    public function autocomplete_teams($team_data){
        $data_start= Team::where('name', 'LIKE', '%'.$team_data.'%' )->get();
        $tags = Tag::where( 'name', 'LIKE', '%'.$team_data.'%' )->select('team_id')->get();
        foreach($tags as $tag) {
            $team = Team::where('id', $tag->team_id)->first();

            $data_start->push($team);
        }
        $data=[];
        if(is_object($data_start)){
            $data[]=$data_start;
        }
        else{
            $data=$data_start;
        }

        return response()->json($data);
    }
}
