<?php

namespace App\Models\Marketing;

use Illuminate\Database\Eloquent\Model;

class MetaSetting extends Model
{
    protected $fillable = [
        'app_id',
        'app_secret',
        'access_token',
        'token_expires_at',
        'ad_account_id',
        'ad_account_name',
        'currency',
    ];

    protected $hidden = ['app_secret', 'access_token'];

    protected $casts = [
        'app_secret' => 'encrypted',
        'access_token' => 'encrypted',
        'token_expires_at' => 'datetime',
    ];

    /** Single-row settings table. */
    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }

    public function hasApp(): bool
    {
        return filled($this->app_id) && filled($this->app_secret);
    }

    public function isConnected(): bool
    {
        return filled($this->access_token)
            && ($this->token_expires_at === null || $this->token_expires_at->isFuture());
    }
}
