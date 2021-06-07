<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>BetMaker - Web application for generating images</title>
        <meta name="keywords" content="BetMaker, betting, image, sport, soccer, football, basketball, tennis, template, canvas, event">
        <meta name="description" content="BetMaker is a web application for generating images with custom data based on numerous different templates.">
        <link rel="canonical" href="{{url()->current()}}"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    </head>

    <body class="antialiased">
        <div id="app">
            <main-component></main-component>
        </div>
        <script src="{{ mix('js/app.js') }}"></script>
    </body>

</html>


