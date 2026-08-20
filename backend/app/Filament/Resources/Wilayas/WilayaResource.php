<?php

namespace App\Filament\Resources\Wilayas;

use App\Filament\Resources\Wilayas\Pages\ListWilayas;
use App\Filament\Resources\Wilayas\Pages\ViewWilaya;
use App\Filament\Resources\Wilayas\RelationManagers\CommunesRelationManager;
use App\Filament\Resources\Wilayas\Schemas\WilayaInfolist;
use App\Filament\Resources\Wilayas\Tables\WilayasTable;
use App\Models\Wilaya;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WilayaResource extends Resource
{
    protected static ?string $model = Wilaya::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMap;

    protected static ?string $recordTitleAttribute = 'name';

    public static function infolist(Schema $schema): Schema
    {
        return WilayaInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WilayasTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            CommunesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWilayas::route('/'),
            'view' => ViewWilaya::route('/{record}'),
        ];
    }
}
