<?php

namespace App\Filament\Resources\Wilayas\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CommunesRelationManager extends RelationManager
{
    protected static string $relationship = 'communes';

    protected static ?string $title = 'Cities';

    protected static ?string $recordTitleAttribute = 'name';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
            ])
            ->defaultSort('name');
    }
}
