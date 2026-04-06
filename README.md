# HealthAI - Application de Coaching Santé

## Vue d'ensemble

Application complète de coaching santé composée de :
- **Backend** : API FastAPI avec base de données SQLite
- **Frontend** : Application Vue.js avec TypeScript et Bootstrap
- **Intégration** : Communication REST avec authentification JWT

## Structure du projet

```
MSPR1/
├── MSPR1.EPSI-FastAPI-master/     # Backend FastAPI
│   ├── src/
│   │   ├── app.py                 # Application principale
│   │   ├── auth.py                # Authentification JWT
│   │   ├── models/                # Modèles de données
│   │   ├── router/                # Endpoints API
│   │   └── ...
│   ├── alembic/                   # Migrations de base de données
│   └── ...
├── frontcoach/healthai/           # Frontend Vue.js
│   ├── src/
│   │   ├── views/                 # Pages de l'application
│   │   ├── components/            # Composants réutilisables
│   │   ├── stores/                # État global (Pinia)
│   │   ├── services/              # Services API
│   │   └── ...
│   ├── INTEGRATION.md             # Guide d'intégration détaillé
│   └── ...
├── test-integration.sh            # Script de test (Linux/Mac)
├── test-integration.ps1           # Script de test (Windows)
└── README.md                      # Ce fichier
```

## Démarrage rapide

### 1. Backend FastAPI

```bash
cd MSPR1.EPSI-FastAPI-master

# Installation des dépendances Python
pip install fastapi uvicorn sqlalchemy pydantic alembic python-jose[cryptography] passlib[bcrypt] python-multipart bcrypt
# ou si vous avez un requirements.txt
pip install -r requirements.txt
# ou avec Poetry
poetry install

# Démarrage du serveur
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

**API disponible sur** : http://localhost:8000
**Documentation Swagger** : http://localhost:8000/docs

### 2. Frontend Vue.js

```bash
# ⚠️ IMPORTANT : Aller dans le bon dossier !
cd frontcoach/healthai

# Installation des dépendances Node.js
npm install

# Configuration (optionnel)
cp .env.example .env.local
# Éditer .env.local si nécessaire

# Démarrage du serveur de développement
npm run dev
```

**Application disponible sur** : http://localhost:5173

### 3. Test de l'intégration

**Linux/Mac** :
```bash
./test-integration.sh
```

**Windows PowerShell** :
```powershell
.\test-integration.ps1
```

## Fonctionnalités

### Authentification
- Connexion par email/mot de passe
- Tokens JWT sécurisés
- Gestion des sessions
- Déconnexion automatique

### Dashboard
- Métriques utilisateurs
- Graphiques interactifs
- Données temps réel
- Analytics avancées

### Gestion des données
- **Utilisateurs** : Profils, préférences, objectifs
- **Nutrition** : Base de données d'aliments, journaux repas
- **Exercices** : Sessions d'entraînement, suivi métrique
- **Analytics** : Résumés, tendances, rapports

## Technologies

### Backend
- **FastAPI** : Framework web moderne Python
- **SQLAlchemy** : ORM pour la base de données
- **Alembic** : Gestion des migrations
- **Pydantic** : Validation et sérialisation
- **JWT** : Authentification stateless
- **SQLite** : Base de données locale

### Frontend
- **Vue 3** : Framework JavaScript reactif
- **TypeScript** : Typage statique
- **Pinia** : Gestion d'état globale
- **Axios** : Client HTTP
- **Chart.js** : Graphiques interactifs
- **Bootstrap 5** : Framework CSS
- **Vite** : Build tool moderne

## API Endpoints

### Authentification
- `POST /api/v0/users/login` - Connexion
- `GET /api/v0/users/me` - Profil utilisateur

### Analytics
- `GET /api/v0/analytics/me/summary` - Résumé personnel

### Utilisateurs
- `GET /api/v0/users` - Liste (admin)
- `GET /api/v0/users/{id}` - Détails
- `PUT /api/v0/users/{id}` - Modification
- `DELETE /api/v0/users/{id}` - Suppression

### Produits
- `GET /api/v0/products` - Liste des aliments
- `POST /api/v0/products` - Création (admin)
- `PUT /api/v0/products/{id}` - Modification (admin)

### Sessions d'entraînement  
- `GET /api/v0/workout_sessions` - Toutes les sessions
- `GET /api/v0/workout_sessions/user/{user_id}` - Par utilisateur

## Configuration

### Variables d'environnement Backend
Configurées dans `src/config.py` :
- `DATABASE_URL` - URL de la base de données
- `SECRET_KEY` - Clé secrète JWT
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Durée token

### Variables d'environnement Frontend
Fichier `.env.local` :
```
VITE_API_URL=http://localhost:8000/api/v0
VITE_APP_NAME=HealthAI Coach
```

## Développement

### Architecture
- **Séparation claire** : Frontend et Backend indépendants
- **API REST** : Communication standardisée
- **Type Safety** : TypeScript côté client, Pydantic côté serveur
- **Stores centralisés** : Pinia pour l'état global
- **Composants modulaires** : Réutilisation maximale

### Ajout de fonctionnalités
1. **Backend** : Créer endpoints dans `src/router/`
2. **Frontend** : Ajouter services dans `src/services/api.ts`
3. **État** : Créer stores Pinia dans `src/stores/`
4. **UI** : Développer composants Vue dans `src/components/`

### Tests
```bash
# Backend
cd MSPR1.EPSI-FastAPI-master
pytest

# Frontend
cd frontcoach/healthai
npm run test

# Intégration
./test-integration.sh
```

## Déploiement

### Production Backend
```bash
# Avec Gunicorn
gunicorn src.app:app -w 4 -k uvicorn.workers.UvicornWorker

# Avec Docker
docker build -t healthai-backend .
docker run -p 8000:8000 healthai-backend
```

### Production Frontend
```bash
# Build de production
npm run build

# Servir les fichiers statiques
npx serve dist
```

## Support

### Documentation
- **Intégration** : `frontcoach/healthai/INTEGRATION.md`
- **API Backend** : http://localhost:8000/docs
- **Tests** : Scripts `test-integration.*`

### Debugging
1. **Logs Backend** : Console uvicorn
2. **Logs Frontend** : Console développeur navigateur
3. **Network** : Onglet Network des DevTools
4. **État** : Vue DevTools pour Pinia

### Problèmes courants

#### Backend
- **`ModuleNotFoundError: No module named 'bcrypt'`** : 
  ```bash
  pip install bcrypt passlib[bcrypt]
  ```
- **`ModuleNotFoundError: No module named 'fastapi'`** :
  ```bash
  pip install fastapi uvicorn sqlalchemy pydantic alembic python-jose[cryptography] passlib[bcrypt] python-multipart
  ```

#### Frontend
- **`npm error: no such file package.json`** : Vous êtes dans le mauvais dossier !
  ```bash
  # Depuis la racine du projet :
  cd frontcoach/healthai
  npm install
  ```
- **CORS** : Vérifier configuration FastAPI
- **404 API** : Vérifier URL dans `.env.local`
- **401 Auth** : Token expiré ou invalide
- **Ports** : 8000 et 5173 doivent être libres

## Roadmap

### Prochaines fonctionnalités
- [ ] Gestion avancée des permissions
- [ ] Notifications en temps réel
- [ ] Mode hors-ligne
- [ ] Export de données
- [ ] Intégrations wearables
- [ ] IA pour recommandations

### Améliorations techniques
- [ ] Tests automatisés complets
- [ ] CI/CD Pipeline
- [ ] Monitoring et alertes
- [ ] Performance optimizations
- [ ] Accessibilité (WCAG)
- [ ] Internationalisation i18n

---

**Version** : 1.0.0  
**Dernière mise à jour** : Avril 2026