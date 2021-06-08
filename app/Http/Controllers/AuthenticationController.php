<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

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
            'password'=>Hash::make($request->password),
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
            return response()->json(['user'=>$user], 200);
        }

        return back()->withErrors([
            'error' => 'Podaci nisu točni.',
        ]);
    }

    public function change_password(Request $request){

        $request->validate([
            'email'=>'required|email|unique:users',
            'password'=>'required|min:8|confirmed',
            'password_confirmation'=>'required'
        ]);

        $user=User::where('email', $request->email)->first();
        $user->password=Hash::make($request->password);
        $user->save();


        return response()->json(Auth::user(), 200);
    }


    public function logout(Request $request){

       Auth::logout();

    }
}
