const mix = require('laravel-mix');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js').vue({ version: 2 });

mix.styles(['public/css/login.css',
    'public/css/register.css',
    'public/css/main.css',
    'public/css/sidebar.css',
    'public/css/navbar.css',
    'public/css/templates.css',
    'public/css/backgrounds.css',
    'public/css/competitions.css',
    'public/css/teams.css',
    'public/css/matches.css',
    'public/css/BetLive/votestory.css',
], 'public/css/app.css');
