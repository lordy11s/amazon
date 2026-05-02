<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
Route::post('/register', function (Request $request) {

    try {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if (User::where('email', $validated['email'])->exists()) {
            return response()->json([
                'message' => 'Email is already registered'
            ], 409);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'token' => Str::random(60),
            'user' => $user,
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
        ], 500);
    }
});

Route::post('/login', function (Request $request) {

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user->remember_token = Str::random(60);
    $user->save();

    return response()->json([
        'token' => $user->remember_token,
        'user' => $user,
    ]);
});


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/
Route::post('/logout', function (Request $request) {

    $token = Str::after($request->header('Authorization', ''), 'Bearer ');

    $user = User::where('remember_token', $token)->first();

    if (!$user) {
        return response()->json([
            'message' => 'Invalid token'
        ], 401);
    }

    $user->remember_token = null;
    $user->save();

    return response()->json([
        'message' => 'Logged out'
    ]);
});


/*
|--------------------------------------------------------------------------
| ME
|--------------------------------------------------------------------------
*/
Route::get('/me', function (Request $request) {

    $token = Str::after($request->header('Authorization', ''), 'Bearer ');

    $user = User::where('remember_token', $token)->first();

    if (!$user) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 401);
    }

    return response()->json($user);
});


/*
|--------------------------------------------------------------------------
| TEST
|--------------------------------------------------------------------------
*/
Route::get('/test', function () {
    return response()->json([
        'ok' => true
    ]);
});