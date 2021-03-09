<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('registerUser', 'App\Http\Controllers\AuthenticationController@register');
Route::post('loginUser', 'App\Http\Controllers\AuthenticationController@login');
Route::get('logoutUser', 'App\Http\Controllers\AuthenticationController@logout');
Route::post('addTemplate', 'App\Http\Controllers\TemplatesController@add_template');
Route::post('addRole', 'App\Http\Controllers\SuperadminController@add_role');
Route::post('addAspect', 'App\Http\Controllers\SuperadminController@add_aspect');
Route::post('addResolution', 'App\Http\Controllers\SuperadminController@add_resolution');
Route::post('addBackground', 'App\Http\Controllers\BackgroundsController@add_background');
Route::post('deleteTemplate', 'App\Http\Controllers\TemplatesController@delete_template');
Route::post('editTemplate', 'App\Http\Controllers\TemplatesController@edit_template');
