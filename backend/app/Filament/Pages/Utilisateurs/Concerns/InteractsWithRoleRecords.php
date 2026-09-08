<?php

namespace App\Filament\Pages\Utilisateurs\Concerns;

use App\Models\Role;
use App\Services\Roles\CreateRoleService;
use App\Services\Roles\DeleteRoleService;
use App\Services\Roles\UpdateRoleService;
use App\Support\PermissionRegistry;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Section;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;
use RuntimeException;

trait InteractsWithRoleRecords
{
    /**
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    protected static function roleFormSchema(): array
    {
        $sections = [
            TextInput::make('name')
                ->label('Nom')
                ->required()
                ->maxLength(255),
        ];

        foreach (PermissionRegistry::grouped() as $group => $permissions) {
            $sections[] = Section::make($group)
                ->schema([
                    CheckboxList::make('permissions_by_group.'.static::groupKey($group))
                        ->hiddenLabel()
                        ->options($permissions)
                        ->columns(2),
                ])
                ->collapsible();
        }

        return $sections;
    }

    protected static function groupKey(string $group): string
    {
        return Str::slug($group, '_');
    }

    /**
     * @param  array<int, string>  $permissions
     * @return array<string, array<int, string>>
     */
    protected static function permissionsToGroupedState(array $permissions): array
    {
        $state = [];

        foreach (PermissionRegistry::grouped() as $group => $groupPermissions) {
            $state[static::groupKey($group)] = array_values(array_intersect($permissions, array_keys($groupPermissions)));
        }

        return $state;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<int, string>
     */
    protected static function flattenPermissions(array $data): array
    {
        return collect($data['permissions_by_group'] ?? [])
            ->flatten()
            ->unique()
            ->values()
            ->all();
    }

    protected static function createRoleAction(): Action
    {
        return Action::make('createRole')
            ->label('Nouveau Rôle')
            ->icon(Heroicon::Plus)
            ->color('purple')
            ->schema(self::roleFormSchema())
            ->modalHeading('Nouveau Rôle')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->modalWidth('3xl')
            ->action(function (array $data): void {
                app(CreateRoleService::class)->execute([
                    'name' => $data['name'],
                    'permissions' => self::flattenPermissions($data),
                ]);

                Notification::make()
                    ->title('Rôle créé')
                    ->success()
                    ->send();
            });
    }

    protected static function editRoleAction(): EditAction
    {
        return EditAction::make()
            ->schema(fn () => self::roleFormSchema())
            ->modalHeading('Modifier le rôle')
            ->modalSubmitActionLabel('Enregistrer')
            ->modalCancelActionLabel('Fermer')
            ->modalWidth('3xl')
            ->mutateRecordDataUsing(function (array $data, Role $record): array {
                $data['permissions_by_group'] = self::permissionsToGroupedState($record->permissions ?? []);

                return $data;
            })
            ->using(function (Role $record, array $data) {
                return app(UpdateRoleService::class)->execute($record, [
                    'name' => $data['name'],
                    'permissions' => self::flattenPermissions($data),
                ]);
            })
            ->hidden(fn (Role $record) => $record->is_system)
            ->iconButton()
            ->tooltip('Modifier');
    }

    protected static function deleteRoleAction(): Action
    {
        return Action::make('deleteRole')
            ->label('Supprimer')
            ->tooltip('Supprimer')
            ->icon(Heroicon::OutlinedTrash)
            ->color('danger')
            ->iconButton()
            ->hidden(fn (Role $record) => $record->is_system)
            ->requiresConfirmation()
            ->modalSubmitActionLabel('Supprimer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (Role $record): void {
                try {
                    app(DeleteRoleService::class)->execute($record);
                } catch (RuntimeException $exception) {
                    Notification::make()
                        ->title($exception->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Rôle supprimé')
                    ->success()
                    ->send();
            });
    }
}
