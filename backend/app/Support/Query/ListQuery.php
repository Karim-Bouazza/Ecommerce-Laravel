<?php

namespace App\Support\Query;

use Illuminate\Http\Request;

class ListQuery
{
    public static function request(Request $request, array $keys): Request
    {
        $filter = [];

        foreach ($keys as $key) {
            $value = $request->query($key);

            if ($value !== null && $value !== '') {
                $filter[$key] = $value;
            }
        }

        return $request->duplicate(query: array_merge($request->query(), ['filter' => $filter]));
    }

    public static function perPage(Request $request, int $default = 15): int
    {
        return max(1, (int) $request->query('per_page', $default));
    }
}
