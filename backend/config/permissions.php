<?php

return [
    'system_roles' => ['admin'],

    'groups' => [
        'tableau_de_bord' => [
            'label' => 'Tableau de bord',
            'permissions' => [
                'tableau_de_bord.view' => 'Voir le Tableau de Bord',
                'performance_kpi.view' => 'Voir la Performance (KPI)',
                'analytics_orders.view' => "Voir l'analyse des commandes",
            ],
        ],
        'commandes' => [
            'label' => 'Commandes',
            'permissions' => [
                'orders.view' => 'Voir les commandes',
                'orders.create' => 'Créer des commandes',
                'orders.edit' => 'Modifier les commandes',
                'orders.delete' => 'Supprimer les commandes',
            ],
        ],
        'categories' => [
            'label' => 'Catégories',
            'permissions' => [
                'categories.view' => 'Voir les catégories',
                'categories.create' => 'Créer des catégories',
                'categories.edit' => 'Modifier les catégories',
                'categories.delete' => 'Supprimer les catégories',
            ],
        ],
        'produits' => [
            'label' => 'Produits',
            'permissions' => [
                'products.view' => 'Voir les produits',
                'products.create' => 'Créer des produits',
                'products.edit' => 'Modifier les produits',
                'products.delete' => 'Supprimer les produits',
            ],
        ],
        'wilayas' => [
            'label' => 'Wilayas',
            'permissions' => [
                'wilayas.view' => 'Voir les wilayas',
                'wilayas.edit' => 'Modifier les wilayas',
            ],
        ],
        'pixels' => [
            'label' => 'Pixels',
            'permissions' => [
                'pixels.view' => 'Voir les pixels',
                'pixels.create' => 'Créer des pixels',
                'pixels.edit' => 'Modifier les pixels',
                'pixels.delete' => 'Supprimer les pixels',
            ],
        ],
        'meta_ads' => [
            'label' => 'Publicité Meta',
            'permissions' => [
                'meta_ads.view' => 'Voir la publicité Meta',
                'meta_ads.edit' => 'Gérer la publicité Meta',
            ],
        ],
        'entrepots' => [
            'label' => 'Entrepôts',
            'permissions' => [
                'entrepots.view' => 'Voir les entrepôts',
                'entrepots.create' => 'Créer des entrepôts',
                'entrepots.edit' => 'Modifier les entrepôts',
                'entrepots.delete' => 'Supprimer les entrepôts',
            ],
        ],
        'stock' => [
            'label' => 'Stock',
            'permissions' => [
                'stock.view' => 'Voir le stock',
                'suivi_stock.view' => 'Voir le suivi de stock',
            ],
        ],
        'transferts' => [
            'label' => 'Transferts',
            'permissions' => [
                'transferts.view' => 'Voir les transferts',
                'transferts.create' => 'Créer des transferts',
                'transferts.edit' => 'Confirmer des transferts',
                'transferts.delete' => 'Supprimer des transferts',
            ],
        ],
        'entrees_retour' => [
            'label' => 'Entrées de retour',
            'permissions' => [
                'entrees_retour.view' => 'Voir les entrées de retour',
                'entrees_retour.create' => 'Créer des entrées de retour',
                'entrees_retour.edit' => 'Modifier les entrées de retour',
                'entrees_retour.delete' => 'Supprimer les entrées de retour',
            ],
        ],
        'entrees_achat' => [
            'label' => 'Entrées d\'achat',
            'permissions' => [
                'entrees_achat.view' => 'Voir les entrées d\'achat',
                'entrees_achat.create' => 'Créer des entrées d\'achat',
                'entrees_achat.edit' => 'Modifier les entrées d\'achat',
                'entrees_achat.delete' => 'Supprimer les entrées d\'achat',
            ],
        ],
        'fournisseurs' => [
            'label' => 'Fournisseurs',
            'permissions' => [
                'fournisseurs.view' => 'Voir les fournisseurs',
                'fournisseurs.create' => 'Créer des fournisseurs',
                'fournisseurs.edit' => 'Modifier les fournisseurs',
                'fournisseurs.delete' => 'Supprimer les fournisseurs',
            ],
        ],
        'portefeuilles' => [
            'label' => 'Portefeuilles',
            'permissions' => [
                'portefeuilles.view' => 'Voir les portefeuilles',
                'portefeuilles.create' => 'Créer des portefeuilles',
                'portefeuilles.edit' => 'Modifier les portefeuilles',
                'portefeuilles.delete' => 'Supprimer les portefeuilles',
                'portefeuilles.deposit' => 'Effectuer une entrée sur un portefeuille',
                'portefeuilles.withdraw' => 'Effectuer une sortie sur un portefeuille',
            ],
        ],
        'paiements' => [
            'label' => 'Paiements',
            'permissions' => [
                'paiements.view' => 'Voir les paiements',
                'paiements.create' => 'Créer des paiements',
                'paiements.edit' => 'Modifier des paiements',
                'paiements.delete' => 'Supprimer des paiements',
            ],
        ],
        'versements' => [
            'label' => 'Versements',
            'permissions' => [
                'versements.view' => 'Voir les versements',
                'versements.create' => 'Créer des versements',
                'versements.edit' => 'Modifier des versements',
                'versements.delete' => 'Supprimer des versements',
            ],
        ],
        'fraude' => [
            'label' => 'Détection de fraude',
            'permissions' => [
                'fraud.view' => 'Voir les évaluations de fraude',
                'fraud.review' => 'Marquer les commandes (légitime / fausse)',
                'fraud.view_sensitive' => 'Voir les téléphones et adresses IP complets',
            ],
        ],
        'administrateurs' => [
            'label' => 'Administrateurs',
            'permissions' => [
                'administrateurs.view' => 'Voir les administrateurs',
                'administrateurs.create' => 'Créer des administrateurs',
                'administrateurs.edit' => 'Modifier les administrateurs',
                'administrateurs.delete' => 'Supprimer les administrateurs',
            ],
        ],
        'roles' => [
            'label' => 'Rôles',
            'permissions' => [
                'roles.view' => 'Voir les rôles',
                'roles.create' => 'Créer des rôles',
                'roles.edit' => 'Modifier les rôles',
                'roles.delete' => 'Supprimer les rôles',
            ],
        ],
    ],
];
