<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Icons\Heroicon;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\HtmlString;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Amber,
                'purple' => Color::Purple,
                'indigo' => Color::Indigo,
            ])
            ->brandName('ProSecurity DZ')
            ->sidebarWidth('14rem')
            ->sidebarCollapsibleOnDesktop()
            ->databaseNotifications()
            ->databaseNotificationsPolling('30s')
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->navigationGroups([
                NavigationGroup::make('Clients')
                    ->icon(Heroicon::OutlinedUsers),
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->renderHook(
                PanelsRenderHook::HEAD_END,
                fn (): HtmlString => new HtmlString(<<<'HTML'
                    <style>
                        .fi-description-editor {
                            max-width: 48rem;
                        }

                        .fi-description-editor .fi-fo-rich-editor-content {
                            max-height: 24rem;
                            overflow-y: auto;
                        }

                        .fi-sidebar {
                            border-inline-end: 1px solid rgba(0, 0, 0, 0.08);
                        }

                        .dark .fi-sidebar {
                            border-inline-end-color: rgba(255, 255, 255, 0.08);
                        }

                        .fi-sidebar-item-label {
                            font-size: 0.8125rem;
                        }

                        .fi-sidebar-item-icon {
                            width: 1.125rem;
                            height: 1.125rem;
                        }

                        .fi-sidebar-group-label {
                            font-size: 0.8125rem;
                            font-weight: 500;
                            color: rgb(55 65 81);
                        }

                        .dark .fi-sidebar-group-label {
                            color: rgb(229 231 235);
                        }

                        .fi-sidebar-group-btn .fi-icon {
                            width: 1.125rem;
                            height: 1.125rem;
                        }

                        .fi-sidebar-nav-groups {
                            gap: 0.5rem;
                        }

                        .fi-sidebar-nav {
                            padding-inline-end: 0.75rem;
                        }

                        .fi-resource-orders.fi-resource-view-record-page .fi-header-actions-ctn {
                            padding: 0.5rem;
                            border: 1px solid rgba(0, 0, 0, 0.08);
                            border-radius: 0.75rem;
                            background-color: rgba(0, 0, 0, 0.02);
                        }

                        .dark .fi-resource-orders.fi-resource-view-record-page .fi-header-actions-ctn {
                            border-color: rgba(255, 255, 255, 0.08);
                            background-color: rgba(255, 255, 255, 0.03);
                        }
                    </style>
                    HTML),
            );
    }
}
