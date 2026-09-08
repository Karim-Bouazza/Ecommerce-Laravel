<?php

namespace App\Filament\Resources\AdSpends;

use App\Filament\Resources\AdSpends\Pages\CreateAdSpend;
use App\Filament\Resources\AdSpends\Pages\EditAdSpend;
use App\Filament\Resources\AdSpends\Pages\ListAdSpends;
use App\Filament\Resources\AdSpends\Schemas\AdSpendForm;
use App\Filament\Resources\AdSpends\Tables\AdSpendsTable;
use App\Models\ProductAdSpend;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class AdSpendResource extends Resource
{
    protected static ?string $model = ProductAdSpend::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMegaphone;

    protected static ?string $navigationLabel = 'Dépenses publicitaires';

    protected static ?string $modelLabel = 'Dépense publicitaire';

    public static function canViewAny(): bool
    {
        return auth()->user()?->hasPermission('ad_spends.view') ?? false;
    }

    public static function canCreate(): bool
    {
        return auth()->user()?->hasPermission('ad_spends.create') ?? false;
    }

    public static function canEdit(Model $record): bool
    {
        return auth()->user()?->hasPermission('ad_spends.edit') ?? false;
    }

    public static function canDelete(Model $record): bool
    {
        return auth()->user()?->hasPermission('ad_spends.delete') ?? false;
    }

    public static function form(Schema $schema): Schema
    {
        return AdSpendForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AdSpendsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAdSpends::route('/'),
            'create' => CreateAdSpend::route('/create'),
            'edit' => EditAdSpend::route('/{record}/edit'),
        ];
    }
}
