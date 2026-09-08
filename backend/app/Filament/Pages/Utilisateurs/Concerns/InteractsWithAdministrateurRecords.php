<?php

namespace App\Filament\Pages\Utilisateurs\Concerns;

use App\Models\User;
use App\Services\Administrateurs\CreateAdministrateurService;
use App\Services\Administrateurs\DeleteAdministrateurService;
use App\Services\Administrateurs\UpdateAdministrateurService;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;

trait InteractsWithAdministrateurRecords
{
    /**
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    protected static function administrateurFormSchema(bool $requirePassword, ?User $record): array
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
            TextInput::make('email')
                ->label('Email')
                ->email()
                ->required()
                ->unique(table: 'users', column: 'email', ignoreRecord: true)
                ->maxLength(255),
            TextInput::make('password')
                ->label('Mot de passe')
                ->password()
                ->revealable()
                ->required($requirePassword)
                ->confirmed()
                ->minLength(8)
                ->dehydrated(fn ($state) => filled($state)),
            TextInput::make('password_confirmation')
                ->label('Confirmation du mot de passe')
                ->password()
                ->revealable()
                ->required($requirePassword)
                ->dehydrated(false),
            Toggle::make('is_active')
                ->label('Actif')
                ->default(true)
                ->disabled(fn () => $record !== null && $record->is(auth()->user())),
        ];
    }

    protected static function createAdministrateurAction(): Action
    {
        return Action::make('createAdministrateur')
            ->label('Nouvel Admin')
            ->icon(Heroicon::Plus)
            ->color('purple')
            ->schema(self::administrateurFormSchema(true, null))
            ->modalHeading('Nouvel Administrateur')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (array $data): void {
                app(CreateAdministrateurService::class)->execute($data);

                Notification::make()
                    ->title('Administrateur créé')
                    ->success()
                    ->send();
            });
    }

    protected static function editAdministrateurAction(): EditAction
    {
        return EditAction::make()
            ->schema(fn (User $record) => self::administrateurFormSchema(false, $record))
            ->modalHeading('Modifier l\'administrateur')
            ->modalSubmitActionLabel('Enregistrer')
            ->modalCancelActionLabel('Fermer')
            ->using(fn (User $record, array $data) => app(UpdateAdministrateurService::class)->execute($record, $data))
            ->iconButton()
            ->tooltip('Modifier');
    }

    protected static function deleteAdministrateurAction(): Action
    {
        return Action::make('deleteAdministrateur')
            ->label('Supprimer')
            ->tooltip('Supprimer')
            ->icon(Heroicon::OutlinedTrash)
            ->color('danger')
            ->iconButton()
            ->hidden(fn (User $record) => $record->is(auth()->user()))
            ->requiresConfirmation()
            ->modalSubmitActionLabel('Supprimer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (User $record): void {
                app(DeleteAdministrateurService::class)->execute($record);

                Notification::make()
                    ->title('Administrateur supprimé')
                    ->success()
                    ->send();
            });
    }
}
