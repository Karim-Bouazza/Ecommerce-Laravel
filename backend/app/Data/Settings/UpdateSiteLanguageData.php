<?php

namespace App\Data\Settings;

use App\Enums\Storefront\SiteLanguage;
use Spatie\LaravelData\Data;

class UpdateSiteLanguageData extends Data
{
    public function __construct(
        public SiteLanguage $language,
    ) {}

    public static function rules(): array
    {
        return [
            'language' => ['required', 'string', 'in:' . implode(',', SiteLanguage::values())],
        ];
    }
}
