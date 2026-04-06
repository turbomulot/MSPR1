# Guide de Démarrage Rapide - HealthAI

## ❌ Problèmes rencontrés et solutions

### 1. Erreur npm "package.json not found"

**Problème :** Vous avez exécuté `npm install` depuis le mauvais dossier.

**Solution :**
```bash
# Depuis la racine du projet (D:\doc\Epsi\MSPR1\)
cd frontcoach\healthai
npm install
npm run dev
```

### 2. Erreur Backend "ModuleNotFoundError: No module named 'bcrypt'"

**Problème :** Dependencies Python manquantes.

**Solution :**
```bash
# Depuis MSPR1.EPSI-FastAPI-master\
pip install bcrypt passlib[bcrypt] fastapi uvicorn sqlalchemy pydantic alembic python-jose[cryptography] python-multipart
```

## ✅ Commandes corrigées pour démarrer

### Étape 1: Backend FastAPI

```powershell
# Depuis D:\doc\Epsi\MSPR1\
cd MSPR1.EPSI-FastAPI-master

# Installer les dépendances manquantes
pip install bcrypt passlib[bcrypt] fastapi uvicorn sqlalchemy pydantic alembic python-jose[cryptography] python-multipart

# Démarrer le serveur
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

### Étape 2: Frontend Vue.js (nouveau terminal)

```powershell
# Depuis D:\doc\Epsi\MSPR1\
cd frontcoach\healthai

# Installer les dépendances
npm install

# Copier la configuration (optionnel)
copy .env.example .env.local

# Démarrer le serveur de développement
npm run dev
```

## 🎯 Après démarrage

1. **Backend accessible** : http://localhost:8000/docs
2. **Frontend accessible** : http://localhost:5173  
3. **Test login** : Créer un utilisateur dans l'API ou utiliser Swagger UI

## 📁 Structure des dossiers importante

```
D:\doc\Epsi\MSPR1\
├── MSPR1.EPSI-FastAPI-master\    ← Dossier BACKEND
│   ├── src\
│   ├── requirements.txt
│   └── ...
└── frontcoach\healthai\          ← Dossier FRONTEND  
    ├── package.json              ← Le fichier que npm cherche !
    ├── src\
    └── ...
```

## 🔧 Si ça ne marche toujours pas

1. **Vérifier Python** : `python --version` (doit être 3.8+)
2. **Vérifier Node.js** : `node --version` (doit être 18+)  
3. **Ports occupés** : 
   - Backend : http://localhost:8000
   - Frontend : http://localhost:5173
4. **Logs d'erreur** : Consulter les messages dans chaque terminal