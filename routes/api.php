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

Route::post('loginUser', 'App\Http\Controllers\AuthenticationController@login');
Route::post('registerUser', 'App\Http\Controllers\AuthenticationController@register');
Route::get('logoutUser', 'App\Http\Controllers\AuthenticationController@logout');

Route::group(['middleware' => ['auth:sanctum']], function () {
    //options
    Route::post('getTemplateResolutions', 'App\Http\Controllers\OptionsController@get_template_resolutions');
    Route::post('changeResolution', 'App\Http\Controllers\OptionsController@change_resolution');

    //templates
    Route::get('getTemplates', 'App\Http\Controllers\TemplatesController@get_templates');

    //backgrounds
    Route::get('getBackgrounds', 'App\Http\Controllers\BackgroundsController@get_backgrounds');

    //competitions
    Route::get('getCompetitions', 'App\Http\Controllers\CompetitionsController@get_competitions');
    Route::get('autocomplete_competitions/{competition_data}', 'App\Http\Controllers\CompetitionsController@autocomplete_competitions');

    //teams
    Route::get('getTeams', 'App\Http\Controllers\TeamsController@get_teams');
    Route::get('autocomplete_teams/{team_data}', 'App\Http\Controllers\TeamsController@autocomplete_teams');

    //matches
    Route::get('getMatchesResources', 'App\Http\Controllers\MatchesController@get_matches_resources');
    Route::post('addMatch', 'App\Http\Controllers\MatchesController@add_match');
    Route::post('deleteMatch', 'App\Http\Controllers\MatchesController@delete_match');

    Route::group(['middleware' => ['admin']], function () {

        //backgrounds
        Route::post('addBackground', 'App\Http\Controllers\BackgroundsController@add_background');
        Route::post('deleteBackground', 'App\Http\Controllers\BackgroundsController@delete_background');

        //competitions
        Route::post('addCompetition', 'App\Http\Controllers\CompetitionsController@add_competition');
        Route::post('deleteCompetition', 'App\Http\Controllers\CompetitionsController@delete_competition');

        //teams
        Route::post('addTeam', 'App\Http\Controllers\TeamsController@add_team');
        Route::post('deleteTeam', 'App\Http\Controllers\TeamsController@delete_team');

    });

    Route::group(['middleware' => ['superadmin']], function () {

        //templates
        Route::post('addTemplate', 'App\Http\Controllers\TemplatesController@add_template');
        Route::post('deleteTemplate', 'App\Http\Controllers\TemplatesController@delete_template');
        Route::post('editTemplate', 'App\Http\Controllers\TemplatesController@edit_template');

        //other
        Route::get('getSuperadminResources', 'App\Http\Controllers\SuperadminController@get_superadmin_resources');
        Route::post('addRole', 'App\Http\Controllers\SuperadminController@add_role');
        Route::post('addAspect', 'App\Http\Controllers\SuperadminController@add_aspect');
        Route::post('addResolution', 'App\Http\Controllers\SuperadminController@add_resolution');
    });
});
