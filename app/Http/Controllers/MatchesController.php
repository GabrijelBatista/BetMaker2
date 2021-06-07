<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Competition;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class MatchesController extends Controller
{

    public function add_match(Request $request){

        $request->validate([
            'home_team'=>'required',
            'away_team'=>'required',
        ]);

        $new_match = new \stdClass();

        $count=1;
        if(count($request->get('all_matches'))<100){
            if($request->get('all_matches')!=null){
                $matches_list=$request->get('all_matches');
                foreach($matches_list as $match){
                    $match['id']=$count;
                    $count++;
                }
            }
            else{
                $matches_list=[];
            }
            $new_match->id=$count;
            $new_match->home_team=$request->get('home_team');
            $new_match->away_team=$request->get('away_team');
            if($request->get('competition')!=null){
                $new_match->competition=$request->get('competition');
            }
            else{
                $new_match->competition['name']="-";
            }
            if($request->get('date')!=null){
                $new_match->date=$request->get('date');
            }
            else{
                $new_match->date="-";
            }
            if($request->get('time')!=null){
                $new_match->time=$request->get('time');
            }
            else{
                $new_match->time="-";
            }
            array_push($matches_list, $new_match);
        }
        else{
            return response()->json(['matches_list'=>$request->get('matches_list')], 200);
        }
        return response()->json(['matches_list'=>$matches_list], 200);



    }

    public function delete_match(Request $request){
        $request->validate([
            'match_id'=>'required',
            'matches'=>'required',
        ]);

        $matches=$request->get('matches');
        $id=$request->get('match_id');

        $new_matches=[];
        foreach($matches as $match){
            if($match['id']!=$id){
                array_push($new_matches, $match);
            }
        }


        return response()->json(['matches'=>$new_matches], 200);
    }

}
