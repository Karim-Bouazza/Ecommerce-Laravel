<?php

namespace App\Models\Concerns;

use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

trait HasImages
{
    use InteractsWithMedia;

    public function mediaUrl(string $collection = 'image'): ?string
    {
        return $this->getFirstMediaUrl($collection) ?: null;
    }

    public function setImage(?UploadedFile $file, string $collection = 'image'): void
    {
        if ($file !== null) {
            $this->addMedia($file)->toMediaCollection($collection);
        }
    }

    public function removeImage(string $collection = 'image'): void
    {
        $this->clearMediaCollection($collection);
    }

    public function hasImage(string $collection = 'image'): bool
    {
        return $this->hasMedia($collection);
    }
}
