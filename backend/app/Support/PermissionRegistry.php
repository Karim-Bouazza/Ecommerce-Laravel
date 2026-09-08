<?php

namespace App\Support;

class PermissionRegistry
{
    /**
     * @return array<string, array<string, string>>
     */
    public static function grouped(): array
    {
        return [
            'Tableau de bord' => [
                'dashboard.view' => 'Voir le Dashboard',
                'tableau_de_bord.view' => 'Voir le Tableau de Bord',
                'performance_kpi.view' => 'Voir la Performance (KPI)',
            ],
            'Clients' => [
                'clients.view' => 'Voir les clients',
                'clients.edit' => 'Modifier les clients',
                'clients.delete' => 'Supprimer les clients',
                'clients_blacklist.view' => 'Voir la liste noire',
            ],
            'Commandes' => [
                'orders.view' => 'Voir les commandes',
                'orders.create' => 'Créer des commandes',
                'orders.edit' => 'Modifier les commandes',
                'orders.delete' => 'Supprimer les commandes',
                'orders_nouvelles.view' => 'Voir les nouvelles commandes',
                'orders_en_cours.view' => 'Voir les commandes en cours',
                'orders_confirmees.view' => 'Voir les commandes confirmées',
                'orders_terminees.view' => 'Voir les commandes terminées',
                'orders_annulees.view' => 'Voir les commandes annulées',
            ],
            'Catalogue' => [
                'categories.view' => 'Voir les catégories',
                'categories.create' => 'Créer des catégories',
                'categories.edit' => 'Modifier les catégories',
                'categories.delete' => 'Supprimer les catégories',
                'products.view' => 'Voir les produits',
                'products.create' => 'Créer des produits',
                'products.edit' => 'Modifier les produits',
                'products.delete' => 'Supprimer les produits',
                'wilayas.view' => 'Voir les wilayas',
                'delivery_companies.view' => 'Voir les sociétés de livraison',
                'delivery_companies.create' => 'Créer des sociétés de livraison',
                'delivery_companies.edit' => 'Modifier les sociétés de livraison',
                'delivery_companies.delete' => 'Supprimer les sociétés de livraison',
                'ad_spends.view' => 'Voir les dépenses publicitaires',
                'ad_spends.create' => 'Créer des dépenses publicitaires',
                'ad_spends.edit' => 'Modifier les dépenses publicitaires',
                'ad_spends.delete' => 'Supprimer les dépenses publicitaires',
                'products_to_purchase.view' => 'Voir les produits à commander',
            ],
            'Inventaire' => [
                'entrepots.view' => 'Voir les entrepôts',
                'entrepots.create' => 'Créer des entrepôts',
                'entrepots.edit' => 'Modifier les entrepôts',
                'entrepots.delete' => 'Supprimer les entrepôts',
                'stock.view' => 'Voir le stock',
                'suivi_stock.view' => 'Voir le suivi de stock',
                'alerte_stock.view' => 'Voir les alertes de stock',
                'entrees_retour.view' => 'Voir les entrées de retour',
                'entrees_achat.view' => 'Voir les entrées d\'achat',
                'entrees_achat.create' => 'Créer des entrées d\'achat',
                'entrees_achat.edit' => 'Modifier les entrées d\'achat',
                'entrees_achat.delete' => 'Supprimer les entrées d\'achat',
                'fournisseurs.view' => 'Voir les fournisseurs',
                'fournisseurs.create' => 'Créer des fournisseurs',
                'fournisseurs.edit' => 'Modifier les fournisseurs',
                'fournisseurs.delete' => 'Supprimer les fournisseurs',
            ],
            'Finances' => [
                'portefeuilles.view' => 'Voir les portefeuilles',
                'portefeuilles.create' => 'Créer des portefeuilles',
                'portefeuilles.edit' => 'Modifier les portefeuilles',
                'portefeuilles.delete' => 'Supprimer les portefeuilles',
                'paiements.view' => 'Voir les paiements',
                'versements.view' => 'Voir les versements',
            ],
            'Utilisateurs' => [
                'administrateurs.view' => 'Voir les administrateurs',
                'administrateurs.create' => 'Créer des administrateurs',
                'administrateurs.edit' => 'Modifier les administrateurs',
                'administrateurs.delete' => 'Supprimer les administrateurs',
                'roles.view' => 'Voir les rôles',
                'roles.create' => 'Créer des rôles',
                'roles.edit' => 'Modifier les rôles',
                'roles.delete' => 'Supprimer les rôles',
            ],
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return collect(static::grouped())
            ->flatMap(fn (array $permissions) => array_keys($permissions))
            ->values()
            ->all();
    }
}
