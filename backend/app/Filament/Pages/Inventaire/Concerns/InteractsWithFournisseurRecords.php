<?php

namespace App\Filament\Pages\Inventaire\Concerns;

use App\Models\Fournisseur;
use App\Services\Fournisseurs\CreateFournisseurService;
use App\Services\Fournisseurs\DeleteFournisseurService;
use App\Services\Fournisseurs\UpdateFournisseurService;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;

trait InteractsWithFournisseurRecords
{
    /**
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    protected static function fournisseurFormSchema(): array
    {
        return [
            TextInput::make('name')
                ->label('Nom')
                ->required()
                ->maxLength(255),
            TextInput::make('phone')
                ->label('Numéro de téléphone')
                ->tel()
                ->maxLength(30),
            TextInput::make('remark')
                ->label('Remarque')
                ->maxLength(255),
            Textarea::make('address')
                ->label('Adresse')
                ->rows(3),
        ];
    }

    protected static function createFournisseurAction(): Action
    {
        return Action::make('createFournisseur')
            ->label('Nouveau Fournisseur')
            ->icon(Heroicon::Plus)
            ->color('purple')
            ->schema(self::fournisseurFormSchema())
            ->modalHeading('Nouveau Fournisseur')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (array $data): void {
                app(CreateFournisseurService::class)->execute($data);

                Notification::make()
                    ->title('Fournisseur créé')
                    ->success()
                    ->send();
            });
    }

    protected static function editFournisseurAction(): EditAction
    {
        return EditAction::make()
            ->schema(fn () => self::fournisseurFormSchema())
            ->modalHeading('Modifier le fournisseur')
            ->modalSubmitActionLabel('Enregistrer')
            ->modalCancelActionLabel('Fermer')
            ->using(fn (Fournisseur $record, array $data) => app(UpdateFournisseurService::class)->execute($record, $data))
            ->iconButton()
            ->tooltip('Modifier');
    }

    protected static function deleteFournisseurAction(): Action
    {
        return Action::make('deleteFournisseur')
            ->label('Supprimer')
            ->tooltip('Supprimer')
            ->icon(Heroicon::OutlinedTrash)
            ->color('danger')
            ->iconButton()
            ->requiresConfirmation()
            ->modalSubmitActionLabel('Supprimer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (Fournisseur $record): void {
                app(DeleteFournisseurService::class)->execute($record);

                Notification::make()
                    ->title('Fournisseur supprimé')
                    ->success()
                    ->send();
            });
    }
}
