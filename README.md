<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:4F46E5,100:06B6D4&height=180&section=header&text=TaskGuard%20API&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Backend%20REST%20s%C3%A9curis%C3%A9%20de%20gestion%20de%20t%C3%A2ches&descAlignY=60&descSize=18" alt="TaskGuard API" />

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

**API REST orientée sécurité : authentification par cookies, rotation des refresh tokens, isolation stricte des données par utilisateur et administration centralisée.**

[Fonctionnalités](#-fonctionnalités) • [Sécurité](#-sécurité) • [Installation](#-installation) • [API](#-endpoints-de-lapi) • [Tests](#-tests) • [Contact](#-auteur)

</div>

---

## 📖 À propos

**taskmanager API** est le backend d'une application de gestion de tâches. Il expose une API REST complète pour gérer des comptes utilisateurs et leurs tâches, avec un accent particulier sur la **sécurité** et la **propreté de l'architecture** (middlewares, validation, tests).

> 🎯 Ce dépôt contient **uniquement le backend**. Il peut être consommé par n'importe quel client (web, mobile).

---

## ✨ Fonctionnalités

### 👤 Gestion des comptes
- Création de compte, connexion, modification et suppression de son propre compte (CRUD complet)
- Mots de passe hachés avec **bcrypt**
- Validation stricte des données avec **Joi**

### ✅ Gestion des tâches
- CRUD complet sur les tâches
- **Isolation totale** : chaque utilisateur accède uniquement à ses propres tâches
- Validation des entrées avec **Joi**

### 🛡️ Administration
- Un **administrateur suprême unique**
- CRUD complet sur tous les utilisateurs, y compris sur son propre compte

### 🗑️ Intégrité des données
- **Suppression en cascade** : supprimer un utilisateur supprime automatiquement toutes ses tâches (même s'il en possède des milliers)

---

## 🔐 Sécurité

| Mécanisme | Détail |
|---|---|
| **Access token** | JWT à courte durée de vie, transmis par **cookie** |
| **Refresh token** | Jeton aléatoire généré avec **crypto**, transmis par **cookie** |
| **Rotation des refresh tokens** | À chaque renouvellement de l'access token, l'ancien refresh token est invalidé et un nouveau est émis |
| **Déconnexion propre** | Le logout invalide la session côté serveur et supprime les cookies |
| **Mots de passe** | Hachage **bcrypt** |
| **Validation** | Schémas **Joi** sur les utilisateurs et les tâches |
| **Autorisation** | Middlewares de contrôle d'accès (propriétaire de la ressource / administrateur) |
| **En-têtes HTTP** | Sécurisés avec **Helmet** |
| **Limitation de débit** | Globale : **100 requêtes / 15 min**. Routes sensibles (connexion, création de compte, refresh token) : **5 requêtes / min** |

### 🔄 Flux d'authentification

```text
 Login ──► Access token (JWT) + Refresh token (crypto) en cookies
              │
              ▼
 Requête protégée ──► Middleware vérifie l'access token
              │
        expiré ? ──► Route de refresh ──► Rotation : nouvel access + nouveau refresh
              │
              ▼
 Logout ──► Refresh token invalidé + cookies supprimés
```

---

## 🧱 Stack technique

| Couche | Technologie |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Base de données | MySQL |
| ORM | Sequelize |
| Authentification | JWT + crypto |
| Hachage | bcrypt |
| Validation | Joi |
| Sécurité HTTP | Helmet, CORS, rate limiting |
| Logs | Morgan |
| Tests | Jest |

---

## 📂 Structure du projet

```text
taskmanager/
├── configs/             # Configuration (base de données, variables d'environnement)
├── controllers/         # Logique métier des routes
├── middelwares/         # Authentification, autorisation, validation, sécurité
├── models/              # Modèles Sequelize
├── routes/              # Définition des routes
├── validators/          # Schémas Joi (utilisateurs, tâches)
├── tests/               # Tests unitaires Jest
├── .env.example         # Modèle des variables d'environnement
├── .gitignore
├── package.json
├── server.js            # Point d'entrée
└── README.md
```

---

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version LTS recommandée)
- [MySQL](https://www.mysql.com/)
- npm

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Dorovane/backend-taskmanager.git
cd backend-taskmanager

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# puis renseigner les valeurs dans .env

# 4. Démarrer le serveur
npm run start

# Ou en mode développement (rechargement automatique)
npm run dev
```

### ⚙️ Variables d'environnement

```env

# Base de données MySQL
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=

```

> ⚠️ Ne publie **jamais** ton fichier `.env`. Il doit rester dans le `.gitignore`.

---

## 📡 Endpoints de l'API

> Toutes les routes protégées nécessitent d'être connecté (cookies d'authentification).

### 🔑 Authentification

| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/users` | Créer un compte | Public |
| `POST` | `/api/login` | Se connecter | Public |
| `POST` | `/api/refresh-token` | Renouveler l'access token (rotation du refresh) | Public (cookie refresh) |
| `POST` | `/api/logout` | Se déconnecter | Connecté |

### 👤 Utilisateur

| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/users/me` | Voir son profil | Connecté |
| `PUT` | `/api/users/me` | Modifier son compte | Connecté |
| `PATCH` | `/api/users/me` | Modifier son compte | Connecté |
| `DELETE` | `/api/users/me` | Supprimer son compte (et ses tâches) | Connecté |

### ✅ Tâches

| Méthode | Route | Description | Accès |
|---|---|---|---|
| `POST` | `/api/tasks` | Créer une tâche | Connecté |
| `GET` | `/api/tasks/me` | Lister ses tâches | Connecté |
| `GET` | `/api/tasks/me/:id` | Voir une de ses tâches | Propriétaire |
| `PUT` | `/api/tasks/me/:id` | Modifier une de ses tâches | Propriétaire |
| `PATCH` | `/api/tasks/me/:id` | Modifier une de ses tâches | Propriétaire |
| `DELETE` | `/api/tasks/me/:id` | Supprimer une de ses tâches | Propriétaire |

### 🛡️ Administration

| Méthode | Route | Description | Accès |
|---|---|---|---|
| `GET` | `/api/tasks` | Lister tous les taches | Admin |
| `GET` | `/api/users` | Lister tous les utilisateurs | Admin |
| `GET` | `/api/users/:id` | Voir un utilisateur | Admin |
| `PUT` | `/api/users/:id` | Modifier un utilisateur | Admin |
| `PATCH` | `/api/users/:id` | Modifier un utilisateur | Admin |
| `DELETE` | `/api/users/:id` | Supprimer un utilisateur (cascade sur ses tâches) | Admin |

### 📌 Exemple de requête

```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "MotDePasse123!"
}
```

```http
HTTP/1.1 200 OK
Set-Cookie: accessToken=...
Set-Cookie: refreshToken=...
```

---

## 🧪 Tests

Les tests unitaires sont écrits avec **Jest**.

```bash
npm test
```

Ils couvrent notamment la logique metier, la validation des données et les middlewares.

---

## 🗺️ Pistes d'évolution

- [ ] Documentation interactive de l'API (Swagger / OpenAPI)
- [ ] Validation de l'inscription par mail via nodemailer
- [ ] Gestion de mot de passe oublier (un patch sur "/users/:id necessite une authentification")
- [ ] Test global avec superTest
- [ ] Pagination et filtres sur les tâches
- [ ] Tests d'intégration
- [ ] Conteneurisation avec Docker
- [ ] Déploiement automatisé (CI/CD)

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Crée une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit tes changements (`git commit -m "Ajout de ma fonctionnalité"`)
4. Push la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvre une Pull Request



## 👨🏾‍💻 Auteur

<div align="center">

**Tchegninougbo Kenneth** — Développeur Full-Stack

<a href="https://github.com/Dorovane"><img src="https://img.shields.io/badge/GitHub-Dorovane-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
<a href="https://www.linkedin.com/in/kenneth-tchegninougbo-59201a30b"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
<a href="https://www.facebook.com/61594058785427">
<img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" />
</a>
<a href="https://www.instagram.com/dorovane_dev">
<img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
</a>
<a href="https://wa.me/22990136567">
<img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp" />
</a>
<a href="mailto:kennethtchegninougbo2003@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
<a href="https://www.dorovane.space"><img src="https://img.shields.io/badge/Portfolio-4F46E5?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" /></a>

⭐ *Si ce projet t'a été utile, n'hésite pas à  laisser une étoile !*

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,100:4F46E5&height=100&section=footer" alt="Footer" />

</div>
