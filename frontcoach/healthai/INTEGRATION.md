# Intégration Frontend - Backend

## Vue d'ensemble

Ce projet connecte le frontend Vue.js à l'API FastAPI. L'authentification se fait via JWT et les données sont gérées avec Pinia.

## Configuration

### Backend FastAPI

1. **Démarrer l'API FastAPI** :
   ```bash
   cd MSPR1.EPSI-FastAPI-master
   # Installer les dépendances si ce n'est pas fait
   pip install -r requirements.txt
   # ou
   poetry install

   # Démarrer le serveur
   uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
   ```

   L'API sera disponible sur `http://localhost:8000`

2. **Vérifier les endpoints** :
   - Swagger UI : `http://localhost:8000/docs`
   - API Base : `http://localhost:8000/api/v0`

### Frontend Vue.js

1. **Configuration de l'URL API** :
   - Créer un fichier `.env.local` dans `frontcoach/healthai/` :
   ```
   VITE_API_URL=http://localhost:8000/api/v0
   ```

2. **Installer et démarrer** :
   ```bash
   cd frontcoach/healthai
   npm install
   npm run dev
   ```

## Fonctionnalités intégrées

### Authentification
- **Store** : `src/stores/auth.ts`
- **Service** : `src/services/api.ts`
- **Login** : `/login` avec email/mot de passe
- **Token JWT** : Stocké automatiquement et ajouté aux requêtes
- **Guards** : Routes protégées automatiquement

### Dashboard
- **Store** : `src/stores/dashboard.ts`
- **Vue** : `src/views/Dashboard.vue`
- **Données réelles** de l'API :
  - Analytics utilisateur (`/analytics/me/summary`)
  - Liste des utilisateurs (`/users`)
  - Produits (`/products`)  
  - Sessions d'entraînement (`/workout_sessions`)

### Graphiques
Les graphiques sont maintenant alimentés par les vraies données :
- **UserChart** : Évolution des utilisateurs par mois
- **AgeChart** : Répartition par tranche d'âge
- **GoalChart** : Distribution des objectifs utilisateurs

## Structure des données

### Types principaux
```typescript
interface User {
  User_ID: number
  User_mail: string
  User_Subscription?: string
  User_age?: number
  User_weight?: number
  User_Goals?: string
  // ...
}

interface UserAnalyticsSummary {
  user_id: number
  meal_logs_count: number
  workout_sessions_count: number
  biometrics_logs_count: number
  total_logged_kcal: number
  // ...
}
```

## API Endpoints utilisés

### Authentification
- `POST /users/login` - Connexion avec email/password

### Analytics  
- `GET /analytics/me/summary` - Résumé analytics de l'utilisateur connecté

### Utilisateurs
- `GET /users` - Liste tous les utilisateurs
- `GET /users/{id}` - Utilisateur par ID
- `PUT /users/{id}` - Modifier utilisateur
- `DELETE /users/{id}` - Supprimer utilisateur

### Produits
- `GET /products` - Liste tous les produits
- `POST /products` - Créer un produit
- `PUT /products/{id}` - Modifier produit
- `DELETE /products/{id}` - Supprimer produit

### Sessions d'entraînement
- `GET /workout_sessions` - Toutes les sessions
- `GET /workout_sessions/user/{userId}` - Sessions par utilisateur

## Gestion d'erreur

- **Intercepteurs Axios** : Gèrent automatiquement les erreurs 401 (déconnexion auto)
- **Store error state** : Chaque store a un état d'erreur
- **UI feedback** : Messages d'erreur affichés dans l'interface

## Développement

### Ajout de nouveaux endpoints
1. Ajouter les types TypeScript dans `src/services/api.ts`
2. Ajouter les méthodes dans la classe `ApiService`
3. Créer ou mettre à jour les stores Pinia correspondants
4. Utiliser dans les composants Vue

### Structure recommandée
```
src/
├── services/
│   └── api.ts          # Client API centralisé
├── stores/
│   ├── auth.ts         # Gestion authentification
│   └── dashboard.ts    # Données dashboard
├── config/
│   └── index.ts        # Configuration environnement
└── views/
    └── *.vue           # Pages utilisant les stores
```

## Variables d'environnement

Créer `.env.local` :
```
VITE_API_URL=http://localhost:8000/api/v0
VITE_APP_NAME=HealthAI Coach
```

## Débogage

1. **Vérifier l'API** : `curl http://localhost:8000/api/v0/users`
2. **Console développeur** : Logs des requêtes et erreurs
3. **Network tab** : Vérifier les appels HTTP
4. **Vue DevTools** : État des stores Pinia

## Prochaines étapes

1. Compléter les vues Users, Nutrition, Exercises avec les vraies données
2. Ajouter la gestion des permissions (admin/user)
3. Implémenter la pagination pour les grandes listes
4. Ajouter des filtres et recherche
5. Tests unitaires pour les stores et services