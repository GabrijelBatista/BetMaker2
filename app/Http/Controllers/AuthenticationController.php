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


    public function logout(Request $request){

       Auth::logout();

    }
}
