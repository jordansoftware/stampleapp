
# Application de Pointage

Une application React Native pour le suivi du temps de travail avec une interface moderne et intuitive.

## Fonctionnalités

### ⏰ Enregistrement du temps de travail
- Sélection de la date (par défaut : date actuelle)
- Sélection de l'heure d'arrivée et de fin via des sélecteurs de temps
- Calcul automatique des heures totales pour chaque jour

### 📊 Dashboard et aperçu
- Liste de tous les jours de travail avec date, heure de début, heure de fin et heures totales
- Affichage des heures totales cumulées
- Filtrage par semaine ou par mois
- Possibilité de supprimer des entrées

### 💾 Stockage des données
- Aucune authentification requise
- Stockage local des données sur l'appareil avec AsyncStorage
- Persistance des données entre les sessions

### 🎨 Interface utilisateur
- Interface mobile moderne et claire en allemand
- Écran principal : Dashboard avec liste et heures totales
- Bouton "Neuer Arbeitstag" pour ajouter une nouvelle entrée
- Design Material Design avec couleurs cohérentes

## Installation et démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn
- Expo CLI installé globalement
- Expo Go app sur votre appareil mobile (pour le test)

### Installation
1. Clonez le repository ou téléchargez les fichiers
2. Naviguez vers le dossier du projet :
   ```bash
   cd stampleapp
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```

### Démarrage
1. Démarrez l'application Expo :
   ```bash
   npm start
   # ou
   expo start
   ```

2. Scannez le QR code avec l'application Expo Go sur votre appareil mobile
3. L'application se lancera automatiquement

### Scripts disponibles
- `npm start` - Démarre le serveur de développement Expo
- `npm run android` - Lance l'application sur un émulateur Android
- `npm run ios` - Lance l'application sur un simulateur iOS
- `npm run web` - Lance l'application dans un navigateur web

## Structure du projet

```
stampleapp/
├── App.js                 # Point d'entrée principal avec navigation
├── package.json           # Dépendances et scripts
├── screens/              # Écrans de l'application
│   ├── DashboardScreen.js    # Écran principal avec liste des jours de travail
│   └── AddWorkDayScreen.js   # Écran d'ajout d'un nouveau jour de travail
├── components/           # Composants réutilisables
│   └── DateTimePicker.js     # Sélecteur de date et heure
├── services/            # Services et logique métier
│   └── StorageService.js     # Service de stockage local avec AsyncStorage
└── assets/              # Images et ressources
```

## Technologies utilisées

- **React Native** - Framework de développement mobile
- **Expo** - Plateforme de développement React Native
- **React Navigation** - Navigation entre les écrans
- **AsyncStorage** - Stockage local des données
- **react-native-date-picker** - Sélecteurs de date et heure

## Fonctionnalités techniques

### Stockage des données
- Utilisation d'AsyncStorage pour la persistance locale
- Structure de données JSON pour les jours de travail
- Gestion des erreurs de stockage

### Calculs automatiques
- Calcul des heures totales basé sur la différence entre heure de début et fin
- Validation des heures (l'heure de fin doit être après l'heure de début)
- Formatage des dates et heures en allemand

### Interface utilisateur
- Design responsive et moderne
- Couleurs cohérentes (bleu #2196F3 comme couleur principale)
- Animations et transitions fluides
- Support du mode sombre (préparé)

## Personnalisation

### Couleurs
Les couleurs principales peuvent être modifiées dans les fichiers de style :
- Couleur principale : `#2196F3`
- Couleur de fond : `#f5f5f5`
- Couleur de texte : `#333`

### Langue
L'application est entièrement en allemand. Pour changer la langue, modifiez les textes dans les composants et les formats de date/heure.

## Développement

### Ajout de nouvelles fonctionnalités
1. Créez de nouveaux composants dans le dossier `components/`
2. Ajoutez de nouveaux écrans dans le dossier `screens/`
3. Étendez le service de stockage si nécessaire
4. Mettez à jour la navigation dans `App.js`

### Tests
L'application peut être testée sur :
- Appareils Android (via Expo Go)
- Appareils iOS (via Expo Go)
- Navigateurs web (fonctionnalités limitées)

## Support

Pour toute question ou problème, consultez la documentation Expo ou React Native.

## Licence

Ce projet est sous licence 0BSD (voir package.json).
=======
# stampleapp
>>>>>>> e1edd897c9d80246a9de661168881c3fa4856458
