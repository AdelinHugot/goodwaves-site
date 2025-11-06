# Goodwaves

Un site web moderne pour Goodwaves - votre compagnon de surf idéal.

## Stack Technique

- **React** 18.3.1 - Bibliothèque UI
- **Vite** - Bundler et serveur de développement ultra-rapide
- **React Router** 6.22.0 - Gestion du routage
- **CSS3** - Stylisation responsive

## Structure du Projet

```
src/
├── pages/           # Pages principales (Home, About, Contact, NotFound)
├── components/      # Composants réutilisables (Header, Footer, Layout)
├── App.jsx          # Composant principal
├── main.jsx         # Point d'entrée
└── index.css        # Styles globaux
```

## Installation

```bash
npm install
```

## Développement

Pour démarrer le serveur de développement :

```bash
npm run dev
```

Le site s'ouvrira automatiquement sur `http://localhost:3000`

## Production

Pour créer une build de production :

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

Pour prévisualiser la build :

```bash
npm run preview
```

## Pages

- **/** - Page d'accueil avec héros et fonctionnalités
- **/about** - À propos de Goodwaves
- **/contact** - Formulaire de contact
- **/404** - Page non trouvée

## Fonctionnalités

- Design responsive (mobile, tablet, desktop)
- Navigation fluide avec React Router
- Formulaire de contact fonctionnel
- Composants réutilisables
- Styles modernes avec gradients et animations

## Développement Futur

- [ ] Authentification utilisateur
- [ ] API d'intégration des prévisions de vagues
- [ ] Profils utilisateurs
- [ ] Système de notifications
- [ ] Pagination des contenus

---

Créé avec ❤️ pour les passionnés de surf
