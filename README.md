# GearConnect Landing Page

<div align="center">

**Landing page officielle de GearConnect - Connect Passion with Ambition**

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Deployed%20on-Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

</div>

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Développement](#-développement)
- [Déploiement](#-déploiement)
- [Structure du projet](#-structure-du-projet)
- [Architecture](#-architecture)
- [Internationalisation](#-internationalisation)
- [Authentification](#-authentification)
- [Scripts disponibles](#-scripts-disponibles)
- [Documentation](#-documentation)

## 🎯 À propos

GearConnect Landing Page est la plateforme web officielle de **GearConnect**, une application mobile dédiée à la communauté du sport automobile. Cette landing page présente l'application, ses fonctionnalités principales, et permet aux utilisateurs de télécharger l'application et de contacter l'équipe.

### Mission

Connecter la passion du sport automobile avec l'ambition de développer sa carrière dans ce domaine.

## ✨ Fonctionnalités

### 🌐 Internationalisation (i18n)
- Support de **22 langues européennes**
- Détection automatique de la langue via les headers HTTP
- Sélecteur de langue persistant
- Contenu externalisé dans des fichiers YAML

### 🔐 Authentification
- Intégration avec **Clerk** pour l'authentification
- Pages de connexion, inscription et réinitialisation de mot de passe personnalisées
- Dashboard utilisateur avec accès aux conversations
- Synchronisation avec le backend Express

### 📱 Pages principales
- **Page d'accueil** : Hero section, features, statistiques, section de téléchargement
- **Features** : Présentation détaillée des fonctionnalités de l'application
- **FAQ** : Questions fréquentes
- **Contact** : Formulaire de contact avec validation
- **Dashboard** : Espace utilisateur authentifié
- **Privacy Policy** & **Terms of Use** : Pages légales

### 🎨 Design System
- Design Aesthetic (DA) aligné avec l'application mobile
- Palette de couleurs cohérente (rouge GearConnect)
- Animations et transitions fluides
- Responsive design (mobile-first)
- Styles externalisés dans des fichiers CSS modulaires

### 📊 Analytics & Performance
- Vercel Analytics intégré (optionnel)
- Speed Insights pour le monitoring des performances (optionnel)
- Optimisation des images avec Next.js Image
- Lazy loading et code splitting automatique

## 🛠 Technologies

### Core
- **[Next.js 15.2](https://nextjs.org/)** - Framework React avec App Router
- **[React 19](https://react.dev/)** - Bibliothèque UI
- **[TypeScript 5](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first

### Authentification & Backend
- **[Clerk](https://clerk.com/)** - Service d'authentification
- **[Prisma](https://www.prisma.io/)** - ORM pour la base de données

### Internationalisation
- **[js-yaml](https://github.com/nodeca/js-yaml)** - Parsing des fichiers YAML
- Middleware Next.js pour la détection de langue

### Déploiement & Monitoring
- **[Docker](https://www.docker.com/)** - Containerisation et déploiement
- **[Vercel Analytics](https://vercel.com/analytics)** - Analytics (optionnel)
- **[Speed Insights](https://vercel.com/speed-insights)** - Monitoring des performances (optionnel)

## 📦 Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0
- **Docker** et **Docker Compose** (pour le déploiement)
- Compte **Clerk** (pour l'authentification)

## 🚀 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd gearconnect-landing

# Installer les dépendances
npm install

# Générer le client Prisma (exécuté automatiquement via postinstall)
npm run postinstall
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Clerk Authentication (OBLIGATOIRE)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Backend API
BACKEND_URL=http://localhost:3001

# Dashboard Admin
DASHBOARD_ADMIN_URL=http://localhost:3002

# Cloudinary (OPTIONNEL)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

> **Note** : `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` est automatiquement mappé depuis `CLERK_PUBLISHABLE_KEY` dans `next.config.ts`

### Configuration Clerk

1. Créez un compte sur [Clerk](https://clerk.com/)
2. Créez une nouvelle application
3. Copiez les clés API dans votre `.env`
4. Configurez les URLs de redirection dans le dashboard Clerk :
   - Sign-in URL: `http://localhost:3000/auth/login`
   - Sign-up URL: `http://localhost:3000/auth/register`

## 💻 Développement

```bash
# Lancer le serveur de développement avec Turbopack
npm run dev

# Le site sera accessible sur http://localhost:3000
```

### Commandes disponibles

```bash
# Développement
npm run dev          # Serveur de développement avec Turbopack

# Build
npm run build        # Build de production (génère Prisma + Next.js)
npm run start        # Démarrer le serveur de production

# Qualité de code
npm run lint         # Linter ESLint

# Prisma
npm run postinstall  # Générer le client Prisma (automatique après npm install)
```

## 🚢 Déploiement

### Déploiement avec Docker

Le projet est configuré pour un déploiement avec Docker et Docker Compose.

#### Prérequis Docker

- **Docker** >= 20.10
- **Docker Compose** >= 2.0

#### Configuration

1. Créez un fichier `.env` à la racine du projet avec toutes les variables d'environnement nécessaires (voir section [Configuration](#-configuration))

2. Les variables d'environnement suivantes sont requises :
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ou `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `BACKEND_URL`
   - `DASHBOARD_ADMIN_URL` (optionnel)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (optionnel)

#### Déploiement avec Docker Compose

```bash
# Construire et lancer le conteneur
docker-compose up --build

# Lancer en arrière-plan
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter le conteneur
docker-compose down
```

#### Configuration du port

Le port par défaut est `3000`. Vous pouvez le modifier en définissant la variable d'environnement `DOCKER_PORT` :

```bash
DOCKER_PORT=8080 docker-compose up --build
```

#### Déploiement manuel (sans Docker)

```bash
# Build de production
npm run build

# Démarrer le serveur de production
npm run start
```

## 📁 Structure du projet

```
gearconnect-landing/
├── src/
│   ├── app/                      # App Router Next.js
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/             # Routes d'authentification
│   │   │   ├── backend/          # Proxy vers le backend Express
│   │   │   ├── conversations/    # Gestion des conversations
│   │   │   └── playstore/        # Données Play Store
│   │   ├── auth/                 # Pages d'authentification
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── components/           # Composants React
│   │   │   ├── contact/          # Composants de contact
│   │   │   ├── feature/          # Composants de features
│   │   │   └── ...               # Autres composants
│   │   ├── dashboard/            # Dashboard utilisateur
│   │   ├── contact/              # Page de contact
│   │   ├── features/             # Page des features
│   │   ├── faq/                  # Page FAQ
│   │   ├── privacy/              # Privacy Policy
│   │   ├── terms/                # Terms of Use
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Page d'accueil
│   │   └── globals.css           # Styles globaux
│   ├── content/                  # Contenu internationalisé (YAML)
│   │   ├── en/                   # Anglais
│   │   ├── fr/                   # Français
│   │   ├── de/                   # Allemand
│   │   └── ...                   # 19 autres langues
│   ├── lib/                      # Utilitaires
│   │   ├── content.ts            # Chargement du contenu YAML
│   │   ├── get-language.ts       # Détection de langue
│   │   ├── i18n.ts               # Configuration i18n
│   │   └── prisma.ts             # Client Prisma
│   ├── middleware.ts             # Middleware Next.js (i18n + auth)
│   └── styles/                   # Fichiers CSS modulaires
│       ├── components/           # Styles par composant
│       └── utilities.css         # Classes utilitaires
├── public/                        # Assets statiques
│   ├── images/                   # Images
│   └── logo.png                  # Logo GearConnect
├── scripts/                       # Scripts utilitaires
│   ├── replace-inline-styles.py  # Migration styles inline → CSS
│   └── fix-duplicate-classnames.py
├── .env                           # Variables d'environnement (gitignored)
├── .dockerignore                  # Fichiers ignorés par Docker
├── Dockerfile                     # Configuration Docker
├── docker-compose.yml             # Configuration Docker Compose
├── next.config.ts                 # Configuration Next.js
├── package.json                   # Dépendances
└── README.md                      # Ce fichier
```

## 🏗 Architecture

### App Router (Next.js 15)

Le projet utilise le nouveau App Router de Next.js avec :
- **Server Components** par défaut pour de meilleures performances
- **Client Components** uniquement quand nécessaire (`"use client"`)
- **API Routes** pour les endpoints backend
- **Middleware** pour l'i18n et l'authentification

### Internationalisation

1. **Détection de langue** : Cookie → Query param → Accept-Language header
2. **Stockage** : Fichiers YAML par langue dans `src/content/{lang}/`
3. **Chargement** : Fonctions utilitaires dans `src/lib/content.ts`
4. **Middleware** : Gestion automatique des cookies et redirections

### Authentification

1. **Clerk** : Gestion de l'authentification côté client
2. **Backend sync** : Synchronisation des utilisateurs avec le backend Express
3. **Routes protégées** : Middleware pour protéger `/dashboard`, `/account`, etc.
4. **Custom forms** : Pages d'authentification personnalisées

### Styles

- **CSS modulaire** : Fichiers CSS séparés par composant
- **Variables CSS** : Palette de couleurs centralisée
- **Tailwind CSS** : Classes utilitaires pour le layout
- **Animations** : Keyframes et transitions personnalisées

## 🌍 Internationalisation

### Langues supportées

Le site supporte **22 langues européennes** :

🇬🇧 Anglais (en) | 🇫🇷 Français (fr) | 🇩🇪 Allemand (de) | 🇪🇸 Espagnol (es) | 🇮🇹 Italien (it) | 🇵🇹 Portugais (pt) | 🇳🇱 Néerlandais (nl) | 🇵🇱 Polonais (pl) | 🇷🇺 Russe (ru) | 🇸🇪 Suédois (sv) | 🇩🇰 Danois (da) | 🇫🇮 Finnois (fi) | 🇳🇴 Norvégien (no) | 🇨🇿 Tchèque (cs) | 🇭🇺 Hongrois (hu) | 🇷🇴 Roumain (ro) | 🇬🇷 Grec (el) | 🇹🇷 Turc (tr) | 🇺🇦 Ukrainien (uk) | 🇸🇰 Slovaque (sk) | 🇭🇷 Croate (hr) | 🇧🇬 Bulgare (bg)

### Ajouter une nouvelle langue

1. Créer un dossier `src/content/{lang}/`
2. Copier les fichiers YAML depuis `src/content/en/`
3. Traduire le contenu
4. Ajouter la langue dans `src/lib/i18n.ts`

## 🔐 Authentification

### Flux d'authentification

1. **Inscription** : `/auth/register` → Vérification email → `/dashboard`
2. **Connexion** : `/auth/login` → `/dashboard`
3. **Réinitialisation** : `/auth/forgot-password` → Code email → Nouveau mot de passe
4. **Synchronisation** : Appel automatique à `/api/auth/sync` après authentification

### Routes protégées

Les routes suivantes nécessitent une authentification :
- `/dashboard`
- `/account`
- `/support`

Les utilisateurs non authentifiés sont redirigés vers `/auth/login`.

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur de développement avec Turbopack |
| `npm run build` | Build de production (génère Prisma + Next.js) |
| `npm run start` | Démarre le serveur de production |
| `npm run lint` | Exécute ESLint pour vérifier le code |
| `npm run postinstall` | Génère le client Prisma (automatique) |

## 📚 Documentation

### Ressources externes

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

### Documentation interne

- **Architecture** : Voir section [Architecture](#-architecture)
- **Internationalisation** : Voir section [Internationalisation](#-internationalisation)
- **Authentification** : Voir section [Authentification](#-authentification)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est propriétaire et confidentiel. Tous droits réservés.

---

<div align="center">

**GearConnect** - Connect Passion with Ambition

Développé avec ❤️ par l'équipe GearConnect

</div>
