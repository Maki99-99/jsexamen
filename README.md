# jsexamen

🕰️ Horloge Interactive Tout-en-Un
Ce projet JavaScript est une application web complète intégrant une horloge en temps réel, une alarme personnalisable, une minuterie avec presets, un chronomètre avec tours (laps) et l'affichage de la météo locale. Le tout avec un arrière-plan dynamique selon l'heure de la journée.

🌟 Fonctionnalités
⏰ Horloge : affiche l'heure actuelle, mise à jour chaque seconde.

🎵 Alarme :

Définis une heure d'alarme.

Téléverse un son d'alarme personnalisé (stocké localement).

Affiche le temps restant jusqu’à l’alarme.

⏳ Minuterie :

Définis une durée (heures, minutes, secondes).

Barre de progression et couleur en fonction du temps restant.

Presets rapides (5, 10, 15 min…).

🕓 Chronomètre :

Démarrer, arrêter, réinitialiser.

Sauvegarde automatique des tours (laps), stockés localement.

🌤️ Météo : récupère la température actuelle selon ta géolocalisation.

🌄 Arrière-plan :

Change dynamiquement selon le moment de la journée.

Affichage d’étoiles pendant la nuit.

📦 Technologies utilisées
HTML/CSS/JavaScript

API Open-Meteo pour la météo.

LocalStorage pour mémoriser les réglages (alarme, son, laps...).

🚀 Utilisation
Clone le dépôt :

bash
Copy
Edit
git clone https://github.com/ton-utilisateur/ton-repo.git
Ouvre index.html dans ton navigateur.

📁 Structure recommandée
pgsql
Copy
Edit
.
├── index.html
├── style.css
├── script.js
└── alarm.mp3
🛠️ À personnaliser
Ajoute d'autres presets de minuterie.

Ajoute des effets sonores au chronomètre.

Améliore le design (ex : thème sombre/clair).

🔒 Permissions
L'application demande l'accès à ta position géographique pour afficher la météo.